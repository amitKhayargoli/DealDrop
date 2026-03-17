"use client";

import { Star } from "lucide-react";

const items = [
  "TRACK AMAZON PRICES",
  "NEVER OVERPAY AGAIN",
  "PRICE DROP ALERTS",
  "SAVE MONEY DAILY",
  "FREE FOREVER",
  "10,000+ SMART SHOPPERS",
];

export default function MarqueeBanner() {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="border-y-4 border-black bg-[#FF6B6B] overflow-hidden py-4 relative z-10">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform" style={{ animationDuration: "30s" }}>
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-6">
            <span className="font-black text-base uppercase tracking-widest text-white">{item}</span>
            <Star className="w-4 h-4 fill-white stroke-white shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
