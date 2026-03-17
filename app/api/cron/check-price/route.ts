import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendPriceDropAlert } from "@/lib/email";

export async function GET(){
    return NextResponse.json({
        message: "Price check endpoint is working."
    })
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
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        const {data:products, error:productsError} = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

        if(productsError) throw productsError;

        console.log(`Found ${products.length} products`);

        const results = {
            total: products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertSent: 0,
        }

        for(const product of products){
            try {
                const productData = await scrapeProduct(product.url);

                if(!productData?.currentPrice){
                    results.failed++;
                    continue;
                }

                const newPrice = productData.currentPrice;
                const oldPrice = Number(product.current_price);

                // Update product table
                await supabase.from("products").update({
                    current_price: newPrice,
                    currency: productData.currencyCode || product.currency,
                    name: productData.productName || product.name,
                    image_url: productData.productImageUrl || product.image_url,
                    updated_at: new Date().toISOString(),
                }).eq("id", product.id);

                results.updated++;

                // Track price history if changed
                if (newPrice !== oldPrice) {
                    results.priceChanges++;
                    await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        currency: productData.currencyCode || product.currency,
                        recorded_at: new Date().toISOString(),
                    });

                    if (newPrice < oldPrice){
                        // Email the user
                        const {data: {user},}= await supabase.auth.admin.getUserById(product.user_id);

                        if(user?.email){
                            const result = await sendPriceDropAlert(
                                user.email,
                                {
                                    id: product.id,
                                    name: productData.productName || product.name,
                                    url: product.url,
                                    platform: product.platform,
                                    currency: productData.currencyCode || product.currency,
                                },
                                oldPrice,
                                newPrice
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


    
    } catch (error) {
        console.error("Cron internal error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    
}