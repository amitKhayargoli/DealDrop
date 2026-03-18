"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AddProductForm from "@/components/dashboard/AddProductForm";
import ProductCard from "@/components/dashboard/ProductCard";
import PriceHistoryChart from "@/components/dashboard/PriceHistoryChart";
import { dashboardStats } from "@/lib/mockData";
import {
  TrendingDown,
  Package,
  IndianRupee,
  BellRing,
  Star,
  Plus,
} from "lucide-react";
import {
  addProduct,
  getProducts,
  getPriceHistory,
  deleteProduct,
} from "@/app/actions";
import { scrapeProduct } from "@/lib/firecrawl";

export interface TrackedProduct {
  id: string;
  name: string;
  url: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceChange: number;
  priceChangePercent: number;
  platform: "amazon" | "flipkart" | "daraz";
  currency: string;
  rating: number;
  addedAt: string;
  category: string;
  priceHistory: any[];
}

export default function DashboardPage() {
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<TrackedProduct | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Detect platform from URL
  function detectPlatform(url: string): "amazon" | "flipkart" | "daraz" {
    if (url.includes("amazon.")) return "amazon";
    if (url.includes("flipkart.")) return "flipkart";
    if (url.includes("daraz.")) return "daraz";
    return "daraz"; // fallback or handle unknown
  }

  const handleAddProduct = async (url: string) => {
    setLoading(true);

    const formData = new FormData();
    formData.set("url", url);

    const result = await addProduct(formData);

    if (result.success) {
      const products = await getProducts();
      setProducts(products || []);
    }

    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);

    const result = await deleteProduct(id);

    if (result.success) {
      const products = await getProducts();
      setProducts(products || []);
    }

    setLoading(false);
  };

  const handleViewHistory = async (product: TrackedProduct) => {
    const history = await getPriceHistory(product.id);
    setSelectedProduct({ ...product, priceHistory: history });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FFFDF5] neo-pattern-grid">
        {/* Dashboard Header */}
        <div className="bg-black border-b-4 border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="border-4 border-white bg-[#FF6B6B] px-3 py-1 w-fit -rotate-1">
                  <span className="font-black text-xs uppercase tracking-widest text-white">
                    My Dashboard
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white leading-none tracking-tighter">
                  Price Tracker
                  <br />
                  <span className="text-[#FFD93D]">Command Center</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">
          {/* Add Product Form */}
          <AddProductForm onAdd={handleAddProduct} />

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-4 border-4 border-black bg-[#FFD93D] px-6 py-4 neo-shadow animate-slide-up">
              <div
                className="w-8 h-8 border-4 border-black border-t-transparent shrink-0"
                style={{
                  animation: "loading-spin 0.7s linear infinite",
                  borderRadius: 0,
                }}
              />
              <div>
                <p className="font-black text-sm uppercase tracking-wide">
                  Fetching product details...
                </p>
                <p className="font-bold text-xs text-black/60">
                  Checking price, title, and history
                </p>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex flex-col gap-6">
            {!loading && products.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-black text-2xl uppercase tracking-tight">
                    Tracked Products
                  </h2>
                  <div className="border-4 border-black bg-[#FF6B6B] px-3 py-1 neo-shadow-sm">
                    <span className="font-black text-sm">
                      {products?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 border-2 border-black/20 px-3 py-1">
                  <BellRing className="w-4 h-4 stroke-[2.5px]" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    {dashboardStats.priceDropsToday} drops today
                  </span>
                </div>
              </div>
            )}

            {!loading && products.length === 0 ? (
              <div className="border-4 border-dashed border-black bg-white py-20 flex flex-col items-center gap-4 neo-shadow text-center">
                <div className="border-4 border-black bg-[#FFD93D] w-16 h-16 flex items-center justify-center neo-shadow-sm">
                  <Plus className="w-8 h-8 stroke-[3px]" />
                </div>
                <h3 className="font-black text-xl uppercase">
                  No Products Yet
                </h3>
                <p className="font-bold text-black/50 max-w-xs">
                  Paste an Amazon or Daraz URL above to start tracking your
                  first product.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onViewHistory={handleViewHistory}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedProduct && (
        <PriceHistoryChart
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
