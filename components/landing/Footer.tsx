"use client";

import { TrendingDown, Twitter, Github, Instagram, Star } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#FFD93D] border-t-4 border-black">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-10 items-start">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex items-center gap-1.5 border-4 border-black bg-[#FF6B6B] px-3 py-1.5 neo-shadow group-hover:-translate-y-0.5 group-hover:neo-shadow-md transition-all duration-100">
                <TrendingDown className="w-5 h-5 stroke-[3px]" />
                <span className="font-black text-base uppercase tracking-tight">
                  Deal<span className="text-[#FFFDF5]">Drop</span>
                </span>
              </div>
            </a>
            <p className="font-bold text-sm max-w-[200px] leading-relaxed">
              Track. Alert. Save. Your personal Amazon price watchdog.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="border-4 border-black bg-white w-10 h-10 flex items-center justify-center neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  <Icon className="w-4 h-4 stroke-[2.5px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-center md:pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-bold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-black transition-all duration-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA box */}
          <div className="border-4 border-black bg-black text-white p-5 neo-shadow flex flex-col gap-3 max-w-xs">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#FFD93D] stroke-[#FFD93D]" />
              <span className="font-black text-sm uppercase tracking-wide">
                Start for Free
              </span>
            </div>
            <p className="font-bold text-xs text-white/70 leading-relaxed">
              No credit card. Unlimited product tracking. Instant alerts.
            </p>

            <a
              href="/dashboard"
              className="border-4 border-white bg-[#FF6B6B] px-4 py-2.5 font-black text-xs uppercase tracking-wide text-center hover:bg-[#FFD93D] hover:text-black transition-colors duration-100"
            >
              Open Dashboard →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t-4 border-black bg-black px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold text-xs uppercase tracking-widest text-white/70">
            © 2025 DealDrop — Made with ♥ for deal hunters
          </p>
          <div className="flex items-center gap-2 border-2 border-white/20 px-3 py-1">
            <div className="w-2 h-2 bg-green-400 border border-white/40" />
            <span className="font-bold text-xs uppercase tracking-widest text-white/60">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
