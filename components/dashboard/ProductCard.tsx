"use client";

import { TrackedProduct } from "@/lib/mockData";
import {
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Trash2,
  Bell,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: TrackedProduct;
  onViewHistory: (product: TrackedProduct) => void;
  onDelete: (id: string) => void;
}

const formatPrice = (p: number | undefined | null, currency: string) => {
  if (typeof p !== "number" || isNaN(p)) return "N/A";
  if (currency === "NPR") return `Rs. ${p.toLocaleString("en-IN")}`;
  if (currency === "INR") return `₹${p.toLocaleString("en-IN")}`;
  // Fallback for USD, EUR, etc.
  return `${currency} ${p.toLocaleString("en-IN")}`;
};

// Removed broken ConfirmDeleteDialog helper component

export default function ProductCard({
  product,
  onViewHistory,
  onDelete,
}: ProductCardProps) {
  const hasHistory = product.priceHistory && product.priceHistory.length >= 1;
  const isDown = product.priceChangePercent < 0;
  const isUp = product.priceChangePercent > 0;
  const pct = Math.abs(product.priceChangePercent).toFixed(1);

  return (
    <div className="bg-white border-4 border-black neo-shadow-md hover:-translate-y-1 hover:neo-shadow-lg transition-all duration-200 flex flex-col group">
      {/* Card header: platform + actions */}
      <div className="border-b-4 border-black bg-[#FFFDF5] px-4 py-2 flex items-center justify-between">
        <div
          className={`border-2 border-black px-2 py-0.5 ${
            product.platform === "amazon"
              ? "bg-[#FFD93D]"
              : product.platform === "flipkart"
                ? "bg-[#3b82f6] text-white"
                : "bg-[#f97316] text-white"
          }`}
        >
          <span className="font-black text-xs uppercase tracking-widest">
            {product.platform}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-black p-1.5 hover:bg-[#C4B5FD] transition-colors duration-100"
            aria-label={`Open on ${product.platform}`}
          >
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5px]" />
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="border-2 border-black p-1.5 hover:bg-[#FF6B6B] transition-colors duration-100"
                aria-label="Remove product"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.5px]" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-4 border-black neo-shadow-lg rounded-none bg-[#FFFDF5] p-6 max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black text-2xl uppercase tracking-tight">
                  Remove Product?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-bold text-black/60 text-sm">
                  This will permanently delete "{product.name}" from your price
                  tracker. This action cannot be undone!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-2 sm:gap-4">
                <AlertDialogCancel className="border-4 border-black rounded-none font-black uppercase text-sm px-6 py-2.5 h-auto bg-white hover:bg-gray-100 hover:text-black transition-colors">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(product.id)}
                  className="border-4 border-black rounded-none font-black uppercase text-sm px-6 py-2.5 h-auto bg-[#FF6B6B] text-black hover:bg-red-500 transition-colors neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Yes, Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Product image + name */}
      <div className="flex gap-4 p-4 border-b-4 border-black">
        <div className="w-20 h-20 shrink-0 border-4 border-black bg-[#C4B5FD] overflow-hidden neo-shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm leading-tight line-clamp-3">
            {product.name}
          </p>
          <div className="mt-1.5 border-2 border-black bg-[#FFFDF5] px-2 py-0.5 inline-flex">
            <span className="font-bold text-xs uppercase tracking-widest text-black/50">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Price section */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-bold text-xs uppercase tracking-widest text-black/40 mb-1">
              Current Price
            </p>
            <p className="font-black text-3xl leading-none">
              {formatPrice(product.currentPrice, product.currency)}
            </p>
          </div>

          {/* Price change badge — only shown when there's meaningful history */}
          {hasHistory && (
            <div
              className={`border-4 border-black px-3 py-2 neo-shadow-sm flex items-center gap-1.5 ${
                isDown ? "bg-[#86EFAC]" : isUp ? "bg-[#FCA5A5]" : "bg-[#E5E7EB]"
              }`}
            >
              {isDown ? (
                <TrendingDown className="w-4 h-4 stroke-[3px] text-green-800" />
              ) : isUp ? (
                <TrendingUp className="w-4 h-4 stroke-[3px] text-red-800" />
              ) : null}
              <span
                className={`font-black text-sm ${
                  isDown
                    ? "text-green-800"
                    : isUp
                      ? "text-red-800"
                      : "text-black/50"
                }`}
              >
                {isDown ? "▼" : isUp ? "▲" : "—"} {pct}%
              </span>
            </div>
          )}
        </div>

        {/* Original / Low / High */}
        <div className="grid grid-cols-3 gap-0 border-4 border-black">
          {(
            [
              {
                label: "Original",
                value: hasHistory
                  ? formatPrice(product.originalPrice, product.currency)
                  : "—",
                bg: "",
              },
              {
                label: "Lowest",
                value: hasHistory
                  ? formatPrice(product.lowestPrice, product.currency)
                  : "—",
                bg: hasHistory ? "bg-[#86EFAC]" : "bg-[#F3F4F6]",
              },
              {
                label: "Highest",
                value: hasHistory
                  ? formatPrice(product.highestPrice, product.currency)
                  : "—",
                bg: hasHistory ? "bg-[#FCA5A5]" : "bg-[#F3F4F6]",
              },
            ] as const
          ).map((stat, i) => (
            <div
              key={stat.label}
              className={`px-2 py-2 text-center ${i < 2 ? "border-r-4 border-black" : ""} ${stat.bg}`}
            >
              <p className="font-bold text-xs uppercase tracking-widest text-black/40 leading-none">
                {stat.label}
              </p>
              <p className="font-black text-sm mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Mini sparkline chart */}
        <div className="border-4 border-black p-2 bg-[#FFFDF5]">
          <MiniChart
            data={(product.priceHistory ?? []).map((p) => p.price)}
            isDown={isDown}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            disabled={!hasHistory}
            onClick={() => onViewHistory(product)}
            className="flex-1 py-2.5 border-4 border-black bg-black text-white font-black text-xs uppercase tracking-wide
              hover:bg-[#FF6B6B] hover:text-black transition-colors duration-100
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none neo-shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {hasHistory ? "View History" : "No History Yet"}
          </button>
          <button
            className="py-2.5 px-3 border-4 border-black bg-[#C4B5FD] font-black text-xs uppercase
              hover:bg-[#FF6B6B] transition-colors duration-100
              active:translate-x-[2px] active:translate-y-[2px] neo-shadow-sm"
            aria-label="Set price alert"
          >
            <Bell className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniChart({ data, isDown }: { data: number[]; isDown: boolean }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-xs text-black/40 text-center">No price history</div>
    );
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 180;
  const H = 40;
  const divisor = data.length > 1 ? data.length - 1 : 1; // prevent 0/0 = NaN
  const pts = data.map((v, i) => {
    const x = data.length === 1 ? W / 2 : (i / divisor) * W; // centre single point
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  const lastPt = pts[pts.length - 1].split(",");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10 overflow-visible">
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx={parseFloat(lastPt[0])}
        cy={parseFloat(lastPt[1])}
        r="4"
        fill={isDown ? "#86EFAC" : "#FCA5A5"}
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
}
