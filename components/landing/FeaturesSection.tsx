"use client";

import { TrendingDown, BarChart3, Bell, LayoutDashboard, RefreshCw, ShieldCheck, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: TrendingDown,
    title: "Live Price Tracking",
    description: "Prices checked every hour automatically. See the exact moment a price changes.",
    bg: "#FF6B6B",
  },
  {
    icon: BarChart3,
    title: "Price History Charts",
    description: "Full timeline of every price change. Know if today's price is actually a good deal.",
    bg: "#C4B5FD",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get email or push notifications the second a price drops to your target.",
    bg: "#FFD93D",
  },
  {
    icon: LayoutDashboard,
    title: "Multi-Product Dashboard",
    description: "Track unlimited products from one clean dashboard. Compare trends at a glance.",
    bg: "#FFFDF5",
  },
  {
    icon: RefreshCw,
    title: "Auto-Refresh",
    description: "Set refresh intervals from hourly to daily. Customize tracking per product.",
    bg: "#C4B5FD",
  },
  {
    icon: ShieldCheck,
    title: "Price Drop Guarantee",
    description: "We never miss a drop. Our reliability is backed by 99.9% uptime monitoring.",
    bg: "#FF6B6B",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#FFD93D] py-20 sm:py-28 border-y-4 border-black relative overflow-hidden">
      {/* BG dots */}
      <div className="absolute inset-0 neo-pattern-dots opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="flex flex-col gap-3">
            <div className="border-4 border-black bg-black px-4 py-1.5 inline-flex w-fit rotate-1">
              <span className="font-black text-xs uppercase tracking-widest text-white">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">
              Everything You<br />
              <span className="bg-[#FF6B6B] border-4 border-black neo-shadow px-2 inline-block -rotate-1 mt-1 text-white">
                Need to Save
              </span>
            </h2>
          </div>
          <p className="font-bold text-lg max-w-xs leading-relaxed">
            A complete toolkit for the deal-hunting, budget-conscious modern shopper.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white border-4 border-black neo-shadow hover:-translate-y-1 hover:neo-shadow-lg transition-all duration-200 flex flex-col"
                style={{ transform: i % 3 === 1 ? "rotate(-0.5deg)" : i % 3 === 2 ? "rotate(0.5deg)" : "none" }}
              >
                {/* Icon area */}
                <div
                  className="border-b-4 border-black p-5 flex items-center gap-4"
                  style={{ backgroundColor: f.bg }}
                >
                  <div className="border-4 border-black bg-white w-14 h-14 flex items-center justify-center shrink-0 neo-shadow-sm">
                    <Icon className="w-7 h-7 stroke-[2.5px]" />
                  </div>
                  <h3 className="font-black text-lg uppercase leading-tight tracking-tight">
                    {f.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="p-5 flex-1">
                  <p className="font-bold text-base leading-relaxed text-black/80">
                    {f.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
