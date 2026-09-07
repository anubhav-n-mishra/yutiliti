"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";

export default function ServiceWorkerRegister() {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "[::1]";

      if (isLocalhost) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log("[PWA] Unregistered stale service worker on localhost to prevent caching issues in development.");
              }
            });
          }
        });
      } else {
        const registerSW = () => {
          navigator.serviceWorker
            .register("/sw.js")
            .catch(() => {
              // Silently handle in constrained/test environments
            });
        };

        const win = typeof window !== "undefined" ? (window as any) : null;
        if (win) {
          if (typeof win.requestIdleCallback === "function") {
            win.requestIdleCallback(() => setTimeout(registerSW, 2500));
          } else {
            win.addEventListener("load", () => setTimeout(registerSW, 2500), { once: true });
          }
        }
      }
    }

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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-3.5 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-left font-sans"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold leading-tight">Working Offline</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight mt-0.5">
            Tools run 100% locally in your browser with zero network needed.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
