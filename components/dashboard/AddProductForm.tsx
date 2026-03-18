"use client";

import { useState } from "react";
import { Link2, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

interface AddProductFormProps {
  onAdd: (url: string) => Promise<void>;
}

export default function AddProductForm({ onAdd }: AddProductFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidUrl = (u: string) =>
    u.includes("amazon.") || u.includes("amzn") || u.includes("daraz.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!url.trim()) {
      setError("Please paste a product URL.");
      return;
    }
    if (!isValidUrl(url)) {
      setError("Only Amazon and Daraz product URLs are supported right now.");
      return;
    }

    setLoading(true);
    await onAdd(url);
    setLoading(false);
    setSuccess(true);
    setUrl("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white border-4 border-black neo-shadow-md">
      {/* Header */}
      <div className="border-b-4 border-black bg-[#FF6B6B] px-6 py-4 flex items-center gap-3">
        <div className="border-4 border-black bg-white w-10 h-10 flex items-center justify-center neo-shadow-sm shrink-0">
          <Link2 className="w-5 h-5 stroke-[3px]" />
        </div>
        <div>
          <h2 className="font-black text-lg uppercase tracking-tight">
            Track a New Product
          </h2>
          <p className="font-bold text-xs text-black/60">
            Paste any Amazon or Daraz product URL below
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <div className="flex flex-row gap-0 border-4 border-black neo-shadow">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            placeholder="https://www.amazon.com/dp/XXXXXXXXXX"
            disabled={loading}
            className="flex-1 min-w-0 h-16 px-3 md:px-5 font-bold text-base bg-white outline-none placeholder:text-black/30
              truncate focus:bg-[#FFD93D] transition-colors duration-100 border-r-4 border-black disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-16 px-4 md:px-6 shrink-0 bg-black text-white font-black text-sm uppercase tracking-wide
              flex items-center justify-center gap-2 hover:bg-[#FF6B6B] hover:text-black transition-all duration-100
              active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                {/* Brutalist Spinner */}
                <div
                  className="w-5 h-5 border-[3px] border-white border-t-transparent"
                  style={{
                    animation: "loading-spin 0.7s linear infinite",
                    borderRadius: 0,
                  }}
                />
                <span className="hidden sm:inline">Fetching...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Track Product</span>
                <span className="sm:hidden">Track</span>
                <ArrowRight className="w-5 h-5 stroke-[3px]" />
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 border-4 border-black bg-[#FF6B6B] px-4 py-3 animate-slide-up">
            <AlertCircle className="w-5 h-5 stroke-[3px] shrink-0" />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 border-4 border-black bg-[#86EFAC] px-4 py-3 animate-slide-up">
            <CheckCircle className="w-5 h-5 stroke-[3px] shrink-0" />
            <p className="font-bold text-sm">
              Product added! We're starting to track its price now.
            </p>
          </div>
        )}

        <p className="font-bold text-xs text-black/40 uppercase tracking-widest">
          ✦ Supports Amazon and Daraz ✦ Price checked every hour ✦ Free forever
        </p>
      </form>
    </div>
  );
}
