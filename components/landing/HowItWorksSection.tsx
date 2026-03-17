"use client";

import { Link2, Eye, BellRing, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Link2,
    title: "Paste the Link",
    description:
      "Copy any Amazon product URL and paste it into DealDrop. Works with any category electronics, fashion, home, toys.",
    color: "#FF6B6B",
  },
  {
    number: "02",
    icon: Eye,
    title: "We Track It",
    description:
      "Our bots check the price every hour, building a complete price history. You can see the full timeline any time.",
    color: "#FFD93D",
  },
  {
    number: "03",
    icon: BellRing,
    title: "You Save Money",
    description:
      "The moment the price drops, you get an instant alert. Buy at the lowest price. Never pay full price again.",
    color: "#C4B5FD",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-black py-20 sm:py-28 relative overflow-hidden"
    >
      {/* BG pattern */}
      <div className="absolute inset-0 neo-pattern-halftone opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <div className="border-4 border-white bg-transparent px-4 py-1.5 -rotate-1">
            <span className="font-black text-xs uppercase tracking-widest text-white">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white leading-none tracking-tighter">
            3 Steps to{" "}
            <span className="inline-block bg-[#FFD93D] text-black px-3 border-4 border-white neo-shadow-white rotate-1">
              Smarter
            </span>{" "}
            Shopping
          </h2>
          <p className="font-bold text-white/70 text-lg max-w-xl">
            No complicated setup. No credit card. Just paste and save.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connecting arrow (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-16 left-[calc(50%+10rem)] items-center z-10">
                    <ArrowRight className="w-10 h-10 stroke-[3px] text-white/60" />
                  </div>
                )}

                <div className="flex flex-col items-center gap-5 px-6 py-8">
                  {/* Step number + icon */}
                  <div className="relative">
                    <div
                      className="w-28 h-28 border-4 border-white neo-shadow-white flex items-center justify-center"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon className="w-12 h-12 stroke-[2.5px] text-black" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white border-4 border-white flex items-center justify-center">
                      <span className="font-black text-xs text-black">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-black text-2xl uppercase text-white tracking-tight leading-none">
                      {step.title}
                    </h3>
                    <p className="font-bold text-white/60 text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom border divider (mobile) */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden w-12 h-12 flex items-center justify-center border-4 border-white mb-2">
                    <ArrowRight className="w-6 h-6 stroke-[3px] text-white rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
