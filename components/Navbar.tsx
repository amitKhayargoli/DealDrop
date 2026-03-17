"use client";

import { useEffect, useState } from "react";
import {
  TrendingDown,
  Menu,
  X,
  Zap,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import AuthModal from "./AuthModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setDropdownOpen(false);
    router.refresh();
  };

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      setAuthModal("login");
    }
  };

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Dashboard", href: "/dashboard", onClick: handleDashboardClick },
  ];

  const avatarLetter =
    user?.user_metadata?.full_name?.[0] ??
    user?.email?.[0]?.toUpperCase() ??
    "U";
  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#FFFDF5] border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-1.5 border-4 border-black bg-[#FF6B6B] px-3 py-1.5 neo-shadow-sm transition-all duration-100 group-hover:-translate-y-0.5 group-hover:neo-shadow">
                <TrendingDown className="w-5 h-5 stroke-[3px] text-black" />
                <span className="font-black text-base sm:text-lg uppercase tracking-tight text-black">
                  Deal<span className="text-[#FFFDF5]">DROP</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center border-2 border-black bg-[#FFD93D] px-2 py-0.5 rotate-2 neo-shadow-sm">
                <span className="font-black text-xs uppercase tracking-widest">
                  Free
                </span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={link.onClick}
                  className="px-3 py-2 font-bold text-sm uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-[#FFD93D] hover:neo-shadow-sm transition-all duration-100"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA — logged out */}
            {!user ? (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => setAuthModal("login")}
                  className="px-5 py-2.5 font-bold text-sm uppercase tracking-wide border-4 border-black bg-white neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="px-5 py-2.5 font-bold text-sm uppercase tracking-wide border-4 border-black bg-[#FF6B6B] neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 stroke-[3px]" />
                  Start Free
                </button>
              </div>
            ) : (
              /* Desktop CTA — logged in */
              <div className="hidden md:flex items-center gap-3 relative">
                <a
                  href="/dashboard"
                  className="px-4 py-2.5 font-bold text-sm uppercase tracking-wide border-4 border-black bg-[#C4B5FD] neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 stroke-[3px]" />
                  Dashboard
                </a>

                {/* Avatar dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 border-4 border-black bg-white px-3 py-2 neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <div className="w-6 h-6 border-2 border-black bg-[#FFD93D] flex items-center justify-center font-black text-xs">
                      {avatarLetter}
                    </div>
                    <span className="font-bold text-sm max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 stroke-[3px] transition-transform duration-100 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 border-4 border-black bg-[#FFFDF5] neo-shadow z-50">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-3 font-bold text-sm uppercase tracking-wide hover:bg-[#FF6B6B] transition-colors duration-100 border-t-2 border-black first:border-t-0"
                      >
                        <LogOut className="w-4 h-4 stroke-[3px]" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden border-4 border-black p-2 bg-white neo-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-100"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5 stroke-[3px]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[3px]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t-4 border-black bg-[#FFFDF5]">
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-3 font-bold text-sm uppercase tracking-wide border-4 border-black bg-white neo-shadow-sm block"
                >
                  {link.label}
                </a>
              ))}

              {!user ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setAuthModal("login");
                      setMenuOpen(false);
                    }}
                    className="flex-1 py-3 font-bold text-sm uppercase tracking-wide border-4 border-black bg-white neo-shadow-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthModal("signup");
                      setMenuOpen(false);
                    }}
                    className="flex-1 py-3 font-bold text-sm uppercase tracking-wide border-4 border-black bg-[#FF6B6B] neo-shadow-sm flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 stroke-[3px]" />
                    Start Free
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 border-4 border-black bg-[#FFD93D] neo-shadow-sm">
                    <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center font-black text-sm">
                      {avatarLetter}
                    </div>
                    <span className="font-bold text-sm truncate">
                      {displayName}
                    </span>
                  </div>
                  <a
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="py-3 font-bold text-sm uppercase tracking-wide border-4 border-black bg-[#C4B5FD] neo-shadow-sm flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 stroke-[3px]" />
                    Dashboard
                  </a>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="py-3 font-bold text-sm uppercase tracking-wide border-4 border-black bg-white neo-shadow-sm flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4 stroke-[3px]" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
