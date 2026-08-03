"use client";

import React, { useEffect, useState } from "react";
import { Cookie, ShieldAlert, Check, X, Info } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [showRejectionWarning, setShowRejectionWarning] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent", "all");
    setShowBanner(false);
    setShowRejectionWarning(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem("cookie_consent", "essential");
    setShowBanner(false);
    setShowRejectionWarning(false);
  };

  const handleRejectClick = () => {
    setShowRejectionWarning(true);
  };

  const handleConfirmRejection = () => {
    localStorage.setItem("cookie_consent", "rejected");
    setShowBanner(false);
    setShowRejectionWarning(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      {!showRejectionWarning && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-3xl shadow-2xl text-zinc-900 dark:text-zinc-100 font-sans animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 mt-0.5 sm:mt-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Cookie & Local Storage Preferences
                </h3>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mt-1">
                  Yuitility operates 100% locally. We do NOT use advertising trackers. Local storage cookies remember your theme, recent search history, and favorite tools.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={handleRejectClick}
                className="px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Consequence Warning Modal */}
      {showRejectionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 font-sans">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold">Feature Restrictions Warning</h3>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              If you decline all non-essential storage, the following local features will be disabled:
            </p>

            <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Recent Tool Search History won&apos;t be remembered.</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Calculation History in calculators won&apos;t persist across reloads.</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0" />
                <span>Theme preference (Dark/Light) will reset on browser restart.</span>
              </li>
            </ul>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectionWarning(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
