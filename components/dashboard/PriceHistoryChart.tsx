"use client";

import { TrackedProduct } from "@/lib/mockData";
import { X, TrendingDown, TrendingUp } from "lucide-react";

interface PriceHistoryChartProps {
  product: TrackedProduct;
  onClose: () => void;
}

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;
const formatDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export default function PriceHistoryChart({
  product,
  onClose,
}: PriceHistoryChartProps) {
  const history = product.priceHistory;
  const prices = product.priceHistory
    .map((p) => p.price)
    .filter((v) => typeof v === "number" && !isNaN(v));
  if (prices.length === 0) {
    return (
      <div className="text-xs text-black/40 text-center">No price history</div>
    );
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1; // Prevent division by zero

  const W = 600;
  const H = 200;
  const PAD = { top: 20, bottom: 40, left: 60, right: 20 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const toPoint = (i: number, v: number) => ({
    x: PAD.left + (i / (history.length - 1)) * innerW,
    y: PAD.top + innerH - ((v - min) / range) * innerH,
  });

  const pts = history.map((h, i) => toPoint(i, h.price));
  const polylineStr = pts.map((p) => `${p.x},${p.y}`).join(" ");

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from(
    { length: yTicks },
    (_, i) => min + (range / (yTicks - 1)) * i,
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#FFFDF5] border-4 border-black neo-shadow-xl w-full max-w-2xl animate-slide-up">
        {/* Header */}
        <div className="border-b-4 border-black bg-[#C4B5FD] px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-black text-base uppercase tracking-tight leading-tight line-clamp-2">
              {product.name}
            </h3>
            <p className="font-bold text-xs text-black/60 mt-1 uppercase tracking-widest">
              Full Price History · {history.length} data points
            </p>
          </div>
          <button
            onClick={onClose}
            className="border-4 border-black bg-white p-1.5 hover:bg-[#FF6B6B] transition-colors duration-100 shrink-0"
          >
            <X className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 border-b-4 border-black">
          {[
            {
              label: "Current",
              value: formatPrice(product.currentPrice),
              bg: "bg-white",
            },
            {
              label: "Lowest Ever",
              value: formatPrice(product.lowestPrice),
              bg: "bg-[#86EFAC]",
            },
            {
              label: "Highest Ever",
              value: formatPrice(product.highestPrice),
              bg: "bg-[#FCA5A5]",
            },
            {
              label: "Change",
              value: `${product.priceChangePercent > 0 ? "+" : ""}${product.priceChangePercent.toFixed(1)}%`,
              bg:
                product.priceChangePercent < 0
                  ? "bg-[#86EFAC]"
                  : "bg-[#FCA5A5]",
            },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`${s.bg} px-3 py-3 text-center ${i < 3 ? "border-r-4 border-black" : ""}`}
            >
              <p className="font-bold text-xs uppercase tracking-widest text-black/50">
                {s.label}
              </p>
              <p className="font-black text-base mt-1 leading-none">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* SVG Chart */}
        <div className="p-4 neo-pattern-grid border-b-4 border-black">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            style={{ maxHeight: 220 }}
          >
            {/* Grid lines */}
            {yTickValues.map((tick, i) => {
              const y = PAD.top + innerH - ((tick - min) / range) * innerH;
              return (
                <g key={i}>
                  <line
                    x1={PAD.left}
                    y1={y}
                    x2={W - PAD.right}
                    y2={y}
                    stroke="#000"
                    strokeWidth="0.5"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  <text
                    x={PAD.left - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="9"
                    fontWeight="700"
                    fill="#000"
                    opacity="0.5"
                  >
                    {(tick / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {history.map((h, i) => {
              const pt = toPoint(i, h.price);
              const show =
                history.length <= 8 ||
                i % Math.ceil(history.length / 6) === 0 ||
                i === history.length - 1;
              if (!show) return null;
              return (
                <text
                  key={i}
                  x={pt.x}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="700"
                  fill="#000"
                  opacity="0.5"
                >
                  {formatDate(h.date)}
                </text>
              );
            })}

            {/* Line */}
            <polyline
              points={polylineStr}
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {history.map((h, i) => {
              const pt = toPoint(i, h.price);
              const isLow = h.price === min;
              const isHigh = h.price === max;
              const isLast = i === history.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isLow || isHigh || isLast ? 7 : 4}
                    fill={
                      isLow
                        ? "#86EFAC"
                        : isHigh
                          ? "#FCA5A5"
                          : isLast
                            ? "#FFD93D"
                            : "#FFFDF5"
                    }
                    stroke="#000"
                    strokeWidth="2"
                  />
                  {(isLow || isHigh) && (
                    <text
                      x={pt.x}
                      y={pt.y - 13}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="900"
                      fill="#000"
                    >
                      {formatPrice(h.price)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Timeline list */}
        <div className="p-4 max-h-52 overflow-y-auto">
          <p className="font-black text-xs uppercase tracking-widest mb-3">
            Price Timeline
          </p>
          <div className="flex flex-col gap-0">
            {[...history].reverse().map((h, i) => {
              const prev = history[history.length - 2 - i];
              const changed = prev && h.price !== prev.price;
              const dropped = prev && h.price < prev.price;
              return (
                <div
                  key={h.date}
                  className={`flex items-center justify-between border-b-2 border-black/10 py-2.5 px-2 ${i === 0 ? "bg-[#FFD93D]" : ""}`}
                >
                  <span className="font-bold text-sm">
                    {formatDate(h.date)}
                  </span>
                  <div className="flex items-center gap-3">
                    {changed && (
                      <div
                        className={`flex items-center gap-1 border-2 border-black px-2 py-0.5 ${dropped ? "bg-[#86EFAC]" : "bg-[#FCA5A5]"}`}
                      >
                        {dropped ? (
                          <TrendingDown className="w-3 h-3 stroke-[3px]" />
                        ) : (
                          <TrendingUp className="w-3 h-3 stroke-[3px]" />
                        )}
                        <span className="font-black text-xs">
                          {dropped ? "▼" : "▲"}{" "}
                          {formatPrice(Math.abs(h.price - prev.price))}
                        </span>
                      </div>
                    )}
                    <span className="font-black text-base">
                      {formatPrice(h.price)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
