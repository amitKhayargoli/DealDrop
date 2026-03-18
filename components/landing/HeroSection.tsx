"use client";

import { useState } from "react";
import { ArrowRight, TrendingDown, Star, Zap, Bell } from "lucide-react";
import AuthModal from "../AuthModal";

export default function HeroSection() {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <section className="relative min-h-[calc(100vh-5rem)] bg-[#FFFDF5] overflow-hidden neo-pattern-grid flex items-center">
        {/* Floating BG decorations */}
        <div
          className="absolute top-10 left-[5%] w-24 h-24 bg-[#FFD93D] border-4 border-black animate-float opacity-60"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-20 left-[8%] w-12 h-12 bg-[#C4B5FD] border-4 border-black animate-float opacity-70"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/3 right-[3%] w-16 h-16 bg-[#FF6B6B] border-4 border-black rotate-12 animate-wiggle opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col gap-6">
              {/* Top badge */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border-4 border-black bg-[#C4B5FD] px-4 py-2 neo-shadow-sm -rotate-1">
                  <Bell className="w-4 h-4 stroke-[3px]" />
                  <span className="font-black text-xs uppercase tracking-widest">
                    Price Drop Alerts
                  </span>
                </div>
                <div className="flex items-center gap-1 border-4 border-black bg-[#FFD93D] px-3 py-2 neo-shadow-sm rotate-1">
                  <Star className="w-3.5 h-3.5 fill-black stroke-[3px]" />
                  <span className="font-black text-xs uppercase tracking-widest">
                    Free
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="flex flex-col gap-1">
                <span className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tighter">
                  Track
                </span>
                <span className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tighter neo-text-stroke inline-block">
                  Prices.
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tighter">
                    Save
                  </span>
                  <div className="border-4 border-black bg-[#FF6B6B] px-3 py-0 neo-shadow rotate-2 inline-block -mb-2">
                    <span className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black uppercase leading-none tracking-tighter text-white">
                      Big.
                    </span>
                  </div>
                </div>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl font-bold max-w-lg leading-relaxed">
                Paste any Amazon product URL. We watch the price 24/7 and alert
                you the moment it drops.{" "}
                <span className="bg-[#FFD93D] border-2 border-black px-1">
                  Never overpay again.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => setAuthModal("signup")}
                  className="flex items-center justify-center gap-2 px-8 py-4 border-4 border-black bg-[#FF6B6B] font-black text-base uppercase tracking-wide neo-shadow hover:-translate-y-1 hover:neo-shadow-lg transition-all duration-200 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  <Zap className="w-5 h-5 stroke-[3px]" />
                  Start Tracking — Free
                  <ArrowRight className="w-5 h-5 stroke-[3px]" />
                </button>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 px-8 py-4 border-4 border-black bg-white font-black text-base uppercase tracking-wide neo-shadow hover:-translate-y-1 hover:neo-shadow-lg transition-all duration-200 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  See How It Works
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex -space-x-2">
                  {["#FF6B6B", "#FFD93D", "#C4B5FD", "#000"].map((bg, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 border-2 border-black font-black text-xs flex items-center justify-center"
                      style={{
                        backgroundColor: bg,
                        color: bg === "#000" ? "#fff" : "#000",
                        zIndex: 4 - i,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="font-bold text-sm">
                  <span className="font-black">10,000+</span> smart shoppers
                  tracking prices
                </p>
              </div>
            </div>

            {/* Right: Visual Chaos Zone */}
            <div className="relative hidden lg:block h-[520px]">
              {/* Background circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#C4B5FD] border-4 border-black opacity-30" />

              {/* Main floating product card */}
              <div className="absolute top-8 left-4 right-4 bg-white border-4 border-black neo-shadow-lg animate-float">
                <div className="border-b-4 border-black bg-[#FFD93D] px-4 py-2 flex justify-between items-center">
                  <span className="font-black text-xs uppercase tracking-widest">
                    Product Tracked
                  </span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 border border-black bg-[#FF6B6B]"
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4 flex gap-3 items-center">
                  <div className="w-20 h-20 border-4 border-black bg-[#C4B5FD] flex items-center justify-center shrink-0">
                    {/* <TrendingDown className="w-8 h-8 stroke-[3px]" /> */}
                    <img
                      src="https://cdn2.blanxer.com/uploads/682feff88c633f25b4c7ce32/product_image-sony-wfac700n-noise-canceling-earbuds-blue-1-0873.webp"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm leading-tight line-clamp-2">
                      Sony WH-1000XM5 Wireless Headphones
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-black text-2xl">₹24,990</span>
                      <span className="line-through text-black/40 font-bold text-sm">
                        ₹29,990
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 border-2 border-black bg-[#86EFAC] px-2 py-0.5 inline-flex w-fit">
                      <TrendingDown className="w-3.5 h-3.5 stroke-[3px] text-green-800" />
                      <span className="font-black text-xs text-green-800">
                        ▼ 16.7% — Price Dropped!
                      </span>
                    </div>
                  </div>
                </div>
                {/* Mini chart preview */}
                <div className="border-t-4 border-black p-3">
                  <svg viewBox="0 0 200 50" className="w-full h-10">
                    <polyline
                      points="0,40 25,45 50,30 75,35 100,20 125,28 150,10 175,18 200,12"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="200"
                      cy="12"
                      r="4"
                      fill="#FF6B6B"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <circle
                      cx="150"
                      cy="10"
                      r="4"
                      fill="#86EFAC"
                      stroke="#000"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>

              {/* Price drop badge */}
              <div className="absolute top-4 right-0 bg-[#FF6B6B] border-4 border-black neo-shadow px-3 py-2 rotate-6 animate-bounce">
                <p className="font-black text-xs uppercase tracking-widest">
                  -₹5,000
                </p>
                <p className="font-black text-xs uppercase">TODAY!</p>
              </div>

              {/* Alert badge */}
              <div className="absolute bottom-24 left-0 bg-[#FFD93D] border-4 border-black neo-shadow px-3 py-2 -rotate-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 stroke-[3px]" />
                  <span className="font-black text-xs uppercase tracking-widest">
                    Alert Sent!
                  </span>
                </div>
              </div>

              {/* Spinning star decorator */}
              <div className="absolute bottom-12 right-8">
                <Star className="w-12 h-12 fill-[#FFD93D] stroke-black stroke-[2px] animate-spin-slow" />
              </div>

              {/* Stats card */}
              <div className="absolute bottom-4 left-4 right-16 bg-black text-white border-4 border-black neo-shadow-white flex gap-0">
                {[
                  { label: "Tracked", value: "10K+" },
                  { label: "Saved", value: "₹50L+" },
                  { label: "Drops", value: "2.3K" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex-1 px-3 py-2 text-center ${i < 2 ? "border-r-4 border-white" : ""}`}
                  >
                    <p className="font-black text-lg leading-none">
                      {stat.value}
                    </p>
                    <p className="font-bold text-xs uppercase tracking-widest text-white/60 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
