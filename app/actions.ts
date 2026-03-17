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

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id,current_price")
      .eq("user_id", userId)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: userId,
          url,
          name: productData.productName,
          current_price: newPrice,
          currency: currency,
          image_url: productData.productImageUrl || null,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id, url",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Add to price history
    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: data.id,
        price: newPrice,
        currency: currency,
        recorded_at: new Date().toISOString(),
      });
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

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    console.log("Supabase raw data from getProducts:", data);

    return data.map((item: any) => {
      const currentPrice =
        typeof item.current_price === "string"
          ? parseFloat(item.current_price)
          : item.current_price || 0;

      const url = item.url || "";
      let platform: "amazon" | "flipkart" | "daraz" = "amazon";
      if (url.includes("flipkart.")) platform = "flipkart";
      if (url.includes("daraz.")) platform = "daraz";

      return {
        id: item.id,
        name: item.name || "Unknown Product",
        url: url,
        imageUrl: item.image_url || "",
        currentPrice: currentPrice,
        originalPrice: currentPrice,
        lowestPrice: currentPrice,
        highestPrice: currentPrice,
        priceChange: 0,
        priceChangePercent: 0,
        platform: platform,
        rating: 0,
        currency: item.currency || "INR",
        addedAt: item.created_at,
        category: "Product",
        priceHistory: [],
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
      .order("recorded_at", { ascending: true });

    if (error) throw error;

    return data.map((item: any) => ({
      ...item,
      price:
        typeof item.price === "string" ? parseFloat(item.price) : item.price,
    }));
  } catch (error) {
    console.error("Error fetching price history:", error);
    return [];
  }
}
