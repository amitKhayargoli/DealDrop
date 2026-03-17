"use client";

import { useState } from "react";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import AuthModal from "../AuthModal";

export default function CTABanner() {
  const [url, setUrl] = useState("");
  const [authModal, setAuthModal] = useState<"signup" | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) setAuthModal("signup");
  };

  return (
    <>
      <section className="bg-[#C4B5FD] border-y-4 border-black py-20 sm:py-28 relative overflow-hidden">
        {/* BG grid */}
        <div className="absolute inset-0 neo-pattern-grid opacity-20" />

        {/* Floating decor */}
        <div className="absolute top-8 right-[10%] w-20 h-20 bg-[#FFD93D] border-4 border-black rotate-12 opacity-60" />
        <div className="absolute bottom-8 left-[6%] w-14 h-14 bg-[#FF6B6B] border-4 border-black -rotate-6 opacity-60" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center gap-8">
            {/* Badge */}
            <div className="border-4 border-black bg-black px-4 py-1.5 rotate-1">
              <span className="font-black text-xs uppercase tracking-widest text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Start in 10 seconds
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                Join 10,000+
              </h2>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter">
                Smart{" "}
                <span className="bg-[#FFD93D] border-4 border-black neo-shadow px-2 inline-block -rotate-1">
                  Shoppers
                </span>
              </h2>
            </div>

            <p className="font-bold text-lg sm:text-xl max-w-lg leading-relaxed">
              Paste a product link below and we'll start tracking it immediately.
              No account needed to try your first product.
            </p>

            {/* URL Input + CTA */}
            <form onSubmit={handleTrack} className="w-full flex flex-col sm:flex-row gap-0 border-4 border-black neo-shadow-lg">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Amazon product URL here..."
                className="flex-1 h-16 px-5 font-bold text-base bg-white border-0 border-r-0 sm:border-r-4 sm:border-black outline-none placeholder:text-black/30 focus:bg-[#FFD93D] transition-colors duration-100"
              />
              <button
                type="submit"
                className="h-16 px-6 font-black text-sm uppercase tracking-wide bg-[#FF6B6B] border-0 sm:border-l-0 border-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors duration-100 active:opacity-80 shrink-0"
              >
                Track It Free
                <ArrowRight className="w-5 h-5 stroke-[3px]" />
              </button>
            </form>

            {/* Trust bullets */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Free to use",
                "No spam alerts",
                "Hourly price checks",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 stroke-[3px]" />
                  <span className="font-bold text-sm">{item}</span>
                </div>
              ))}
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
