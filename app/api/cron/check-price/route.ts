import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendPriceDropAlert } from "@/lib/email";

export async function GET() {
  return NextResponse.json({
    message: "Price check endpoint is working.",
  });
}

// Detect platform from URL
function detectPlatform(url: string): "amazon" | "flipkart" | "daraz" {
  if (url.includes("amazon.")) return "amazon";
  if (url.includes("flipkart.")) return "flipkart";
  if (url.includes("daraz.")) return "daraz";
  return "daraz"; // fallback or handle unknown
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const cronsecret = process.env.CRON_SECRET;
    if (authHeader !== `Bearer ${cronsecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) throw productsError;

    const results = {
      total: products.length,
      updated: 0,
      failed: 0,
      priceChanges: 0,
      alertSent: 0,
    };

    for (const product of products) {
      try {
        const productData = await scrapeProduct(product.url);

        if (!productData?.currentPrice) {
          results.failed++;
          continue;
        }

        const newPrice = productData.currentPrice;
        const oldPrice = product.current_price;

        // Update product table
        await supabase
          .from("products")
          .update({
            current_price: newPrice,
            currency: productData.currencyCode || product.currency,
            name: productData.productName || product.name,
            image_url: productData.productImageUrl || product.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id);

        results.updated++;

        // Track price history if changed
        const currentNum = Number(newPrice);
        const oldNum = Number(oldPrice);
        console.log(`Product ${product.id}: oldPrice=${oldNum} (type: ${typeof oldPrice}), newPrice=${currentNum} (type: ${typeof newPrice}), changed=${currentNum !== oldNum}`);

        if (currentNum !== oldNum) {
          results.priceChanges++;
          const { error: historyError } = await supabase.from("price_history").insert({
            product_id: product.id,
            price: newPrice,
            currency: productData.currencyCode || product.currency,
            checked_at: new Date().toISOString(),
          });


          if (newPrice < oldPrice) {
            // Email the user
            const {
              data: { user },
            } = await supabase.auth.admin.getUserById(product.user_id);

            if (user?.email) {
              const result = await sendPriceDropAlert(
                user.email,
                {
                  id: product.id,
                  name: productData.productName || product.name,
                  url: product.url,
                  platform: detectPlatform(product.url),
                  currency: productData.currencyCode || product.currency,
                },
                oldPrice,
                newPrice,
              );

              if (result.success) {
                results.alertSent++;
              } 
            }
          }
        }
      } catch (error) {
        console.error(`Error processing product ${product.id}:`, error);
        results.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Cron internal error:", error?.message, error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
