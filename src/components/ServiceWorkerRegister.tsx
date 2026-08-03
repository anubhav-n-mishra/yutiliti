"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, CheckCircle2, X } from "lucide-react";

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] ServiceWorker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] ServiceWorker registration failed:", err);
          });
      });
    }

    // Monitor Network Connectivity
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-zinc-900/95 dark:bg-zinc-100/95 text-white dark:text-zinc-950 p-3.5 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200 backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 dark:text-amber-600 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight">Offline Engine Ready ⚡</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-600 leading-tight mt-0.5">
            100% of Yuitility tools process data locally in your browser.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 text-zinc-400 dark:text-zinc-600 transition-colors"
        aria-label="Dismiss offline banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
