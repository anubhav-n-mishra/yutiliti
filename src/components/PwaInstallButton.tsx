"use client";

import React, { useEffect, useState } from "react";
import { Download, CheckCircle2, Sparkles, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    // Detect standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect OS for fallback instructions
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType("ios");
    } else if (/android/.test(ua)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show device-specific install instructions if beforeinstallprompt hasn't fired
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
        <CheckCircle2 className="w-3.5 h-3.5" /> Installed
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all transform active:scale-95 shrink-0"
        aria-label="Install Yuitility PWA"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>Install App</span>
      </button>

      {/* Manual Installation Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Install Yuitility App</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Use offline with zero latency</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              {deviceType === "ios" ? (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Tap the <span className="font-bold text-blue-600 dark:text-blue-400">Share button</span> (bottom of Safari).</li>
                  <li>Scroll down and tap <span className="font-bold text-zinc-900 dark:text-white">&quot;Add to Home Screen&quot;</span>.</li>
                  <li>Tap <span className="font-bold text-blue-600 dark:text-blue-400">&quot;Add&quot;</span> to launch from your home screen.</li>
                </ol>
              ) : deviceType === "android" ? (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Tap the browser menu <span className="font-bold text-zinc-900 dark:text-white">(⋮ top right)</span>.</li>
                  <li>Select <span className="font-bold text-blue-600 dark:text-blue-400">&quot;Install app&quot;</span> or &quot;Add to Home screen&quot;.</li>
                  <li>Confirm installation.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>Look for the <span className="font-bold text-blue-600 dark:text-blue-400">Install icon</span> in your browser address bar (top right).</li>
                  <li>Or open menu <span className="font-bold text-zinc-900 dark:text-white">(⋮)</span> → <span className="font-bold text-blue-600 dark:text-blue-400">&quot;Install Yuitility...&quot;</span>.</li>
                  <li>Enjoy instant 100% offline tools!</li>
                </ol>
              )}
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
