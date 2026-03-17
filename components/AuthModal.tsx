"use client";

import { createClient } from "../lib/supabase/client";
import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { redirect } from "next/navigation";

interface AuthModalProps {
  defaultTab: "login" | "signup";
  onClose: () => void;
}

export default function AuthModal({ defaultTab, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google sign-in error:", error.message);
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        console.error("Login error:", error.message);
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        setLoading(false);
        onClose();
        redirect("/dashboard");
      }
    } else {
      console.log("Attempting Signup with payload:", {
        email: email.trim(),
        passwordLength: password.length,
        name,
      });
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Sign-up error:", error.message);
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        setLoading(false);
        onClose();
        redirect("/dashboard");
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="relative bg-[#FFFDF5] border-4 border-black neo-shadow-xl w-full max-w-md animate-bounce-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#FFD93D] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF6B6B] border-2 border-black" />
            <div className="w-3 h-3 bg-[#FFD93D] border-2 border-black" />
            <div className="w-3 h-3 bg-[#000] border-2 border-black" />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">
            {tab === "login" ? "Welcome Back!" : "Join DealDrop"}
          </span>
          <button
            onClick={onClose}
            className="border-2 border-black bg-white p-1 hover:bg-[#FF6B6B] transition-colors duration-100"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-4 border-black">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setErrorMsg("");
            }}
            className={`flex-1 py-3 font-black text-sm uppercase tracking-wide transition-all duration-100 border-r-2 border-black
              ${
                tab === "login"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#C4B5FD]"
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("signup");
              setErrorMsg("");
            }}
            className={`flex-1 py-3 font-black text-sm uppercase tracking-wide transition-all duration-100
              ${
                tab === "signup"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-[#C4B5FD]"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="border-4 border-black bg-[#FF6B6B] p-3 animate-bounce-in neo-shadow-sm">
              <p className="font-black text-sm uppercase tracking-wide text-black text-center">
                {errorMsg}
              </p>
            </div>
          )}

          {/* {successMsg && (
            <div className="border-4 border-black bg-[#86EFAC] p-3 animate-bounce-in neo-shadow-sm">
              <p className="font-black text-sm uppercase tracking-wide text-black text-center">
                {successMsg}
              </p>
            </div>
          )} */}

          {tab === "signup" && (
            <div className="flex flex-col gap-1">
              <label className="font-black text-xs uppercase tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5px] text-black/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full h-14 pl-10 pr-4 border-4 border-black bg-white font-bold text-base placeholder:text-black/30
                    focus:outline-none focus:bg-[#FFD93D] focus:neo-shadow-sm transition-all duration-100"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-black text-xs uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5px] text-black/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-14 pl-10 pr-4 border-4 border-black bg-white font-bold text-base placeholder:text-black/30
                  focus:outline-none focus:bg-[#FFD93D] focus:neo-shadow-sm transition-all duration-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-black text-xs uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5px] text-black/40" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                className="w-full h-14 pl-10 pr-12 border-4 border-black bg-white font-bold text-base placeholder:text-black/30
                  focus:outline-none focus:bg-[#FFD93D] focus:neo-shadow-sm transition-all duration-100"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5 stroke-[2.5px] text-black/40" />
                ) : (
                  <Eye className="w-5 h-5 stroke-[2.5px] text-black/40" />
                )}
              </button>
            </div>
          </div>

          {tab === "login" && (
            <a
              href="#"
              className="text-sm font-bold underline underline-offset-2 text-right hover:text-[#FF6B6B] transition-colors"
            >
              Forgot password?
            </a>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-14 border-4 border-black bg-[#FF6B6B] font-black text-sm uppercase tracking-widest
              neo-shadow-sm hover:-translate-y-0.5 hover:neo-shadow transition-all duration-100
              active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
              disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div
                  className="w-5 h-5 border-3 border-black border-t-transparent animate-spin"
                  style={{
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: "#000 #000 transparent transparent",
                    animation: "loading-spin 0.8s linear infinite",
                    borderRadius: "0",
                  }}
                />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 stroke-[3px]" />
                {tab === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </>
            )}
          </button>

          <p className="text-center text-sm font-bold">
            {tab === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="underline underline-offset-2 hover:text-[#FF6B6B] transition-colors"
            >
              {tab === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>

        {/* Bottom decoration */}
        <div
          className="border-t-4 border-black bg-[#C4B5FD] px-6 py-3 cursor-pointer hover:bg-[#A78BFA] transition-colors"
          onClick={handleGoogleSignIn}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-center">
            Continue With Google
          </p>
        </div>
      </div>
    </div>
  );
}
