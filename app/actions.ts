"use server";

import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath, unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to get Supabase client and userId
async function getSupabaseUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return { supabase, userId };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect("/");
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient();

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const userId = user.id; // Get userId

  const url = formData.get("url") as string;

  if (!url || !userId) {
    throw new Error("URL and userId are required");
  }

  try {
    const productData = await scrapeProduct(url);

    if (!productData?.productName || !productData.currentPrice) {
      throw new Error("Failed to scrape product data");
    }

    const newPrice = parseFloat(productData.currentPrice.toString());
    const currency = productData.currencyCode || "NPR";

    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id,current_price")
      .eq("user_id", userId)
      .eq("url", url)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing product:", fetchError);
    }

    console.log("Existing product fetch result:", existingProduct);
    const isUpdate = !!existingProduct;

    const upsertData: any = {
      user_id: userId,
      url,
      name: productData.productName,
      current_price: newPrice,
      currency: currency,
      image_url: productData.productImageUrl || null,
      updated_at: new Date().toISOString(),
    };

    // Only set created_at for new products to avoid overwriting it
    if (!isUpdate) {
      upsertData.created_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("products")
      .upsert(upsertData, {
        onConflict: "user_id, url",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Add to price history if it's a new product or price changed
    const oldPrice = isUpdate ? Number(existingProduct.current_price) : null;
    const shouldAddHistory = !isUpdate || oldPrice !== newPrice;

    if (shouldAddHistory) {
      console.log(`Adding history point: Product ${data.id}, Price ${newPrice}`);
      const { error: historyError } = await supabase.from("price_history").insert({
        product_id: data.id,
        price: newPrice,
        currency: currency,
        checked_at: new Date().toISOString(),
      });

      if (historyError) {
        console.error("Error inserting price history:", historyError);
        throw new Error(`Failed to record price history: ${historyError.message}`);
      } else {
        console.log("History point added successfully");
      }
    } else {
      console.log("Price unchanged, skipping history point");
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      product: data,
      message: isUpdate
        ? "Product updated with latest price"
        : "Product added successfully",
    };
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      success: false,
      message: "Failed to add product. Please try again.",
    };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const { supabase, userId } = await getSupabaseUser();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("user_id", userId);

    if (error) throw error;

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product. Please try again.",
    };
  }
}

export async function getProducts() {
  unstable_noStore();
  try {
    const { supabase, userId } = await getSupabaseUser();

    // Fetch products with their full price history in one query
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        price_history (
          price,
          checked_at
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => {
      const currentPrice =
        typeof item.current_price === "string"
          ? parseFloat(item.current_price)
          : item.current_price || 0;

      const url = item.url || "";
      let platform: "amazon" | "flipkart" | "daraz" = "amazon";
      if (url.includes("flipkart.")) platform = "flipkart";
      if (url.includes("daraz.")) platform = "daraz";

      // Sort history ascending by checked_at and parse prices
      const history: { price: number; date: string }[] = (item.price_history ?? [])
        .map((h: any) => ({
          price: typeof h.price === "string" ? parseFloat(h.price) : h.price,
          date: h.checked_at,
        }))
        .filter((h: any) => !isNaN(h.price))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const prices = history.map((h) => h.price);

      const lowestPrice = prices.length ? Math.min(...prices) : currentPrice;
      const highestPrice = prices.length ? Math.max(...prices) : currentPrice;
      // Original = first ever recorded price; falls back to current if no history yet
      const originalPrice = prices.length ? prices[0] : currentPrice;
      const priceChange = currentPrice - originalPrice;
      const priceChangePercent =
        originalPrice !== 0 ? (priceChange / originalPrice) * 100 : 0;

      return {
        id: item.id,
        name: item.name || "Unknown Product",
        url,
        imageUrl: item.image_url || "",
        currentPrice,
        originalPrice,
        lowestPrice,
        highestPrice,
        priceChange,
        priceChangePercent,
        platform,
        rating: 0,
        currency: item.currency || "INR",
        addedAt: item.created_at,
        category: "Product",
        priceHistory: history,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getPriceHistory(productId: string) {
  try {
    const { supabase, userId } = await getSupabaseUser();

    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;

    return data.map((item: any) => {
      const price =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      return {
        ...item,
        price,
        date: item.checked_at, // Map checked_at to date for the chart component
      };
    });
  } catch (error) {
    console.error("Error fetching price history:", error);
    return [];
  }
}
