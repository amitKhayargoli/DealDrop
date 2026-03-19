export interface PricePoint {
  date: string;
  price: number;
}

export interface TrackedProduct {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceChange: number; // absolute change
  priceChangePercent: number; // positive = up, negative = down
  platform: "amazon" | "flipkart" | "daraz";
  currency: string;
  rating: number;
  priceHistory: PricePoint[];
  addedAt: string;
  category: string;
}

