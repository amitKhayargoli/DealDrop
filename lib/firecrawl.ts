import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({
  apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_API_KEY!,
});

export type ProductData = {
  productName: string;
  currentPrice: number;
  currencyCode: string;
  productImageUrl: string;
};

export async function scrapeProduct(url: string): Promise<ProductData | null> {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          prompt:
            "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code(USD,EUR,NPR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
          schema: {
            type: "object",
            required: ["productName", "currentPrice"],
            properties: {
              productName: { type: "string" },
              currentPrice: { type: "string" },
              currencyCode: { type: "string" },
              productImageUrl: { type: "string" },
            },
          },
        },
      ],
    });

    if (result?.json) {
      const data = result.json as {
        productName: string;
        currentPrice: string;
        currencyCode: string;
        productImageUrl: string;
      };
      const price = Number(data.currentPrice);
      return {
        productName: data.productName,
        currentPrice: isNaN(price) ? 0 : price,
        currencyCode: data.currencyCode,
        productImageUrl: data.productImageUrl,
      };
    }
    return null;
  } catch (error) {
    console.error("Error scraping product:", error);
    return null;
  }
}
