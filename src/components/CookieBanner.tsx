"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("yuitility_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("yuitility_cookie_consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy notice"
      className="fixed bottom-4 right-4 z-50 max-w-md w-[92%] sm:w-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 font-sans animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
            <Cookie className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-zinc-950 dark:text-white">Privacy & Local Storage</h4>
        </div>
        <button
          onClick={handleAccept}
          className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Yuitility runs 100% in your browser. We use local browser storage only to save your theme preferences and calculation settings. Zero tracking cookies or third-party ad networks used.{" "}
        <Link href="/cookies" className="underline font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
          Cookie Policy
        </Link>
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
