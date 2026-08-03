"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Copy, X, Check } from "lucide-react";

export function recordToolUsage(toolId: string): boolean {
  if (typeof window === "undefined") return false;
  const key = `tool_usage_${toolId}`;
  const currentCount = parseInt(localStorage.getItem(key) || "0", 10);
  const newCount = currentCount + 1;
  localStorage.setItem(key, newCount.toString());

  // Trigger on 1st run, 5th run, 15th run, and every 15th run thereafter
  if (newCount === 1 || newCount === 5 || newCount === 15) {
    return true;
  }
  if (newCount > 15 && (newCount - 15) % 15 === 0) {
    return true;
  }
  return false;
}

interface ShareToastProps {
  toolTitle: string;
  toolId: string;
  show: boolean;
  onClose: () => void;
}

export default function ShareToast({ toolTitle, toolId, show, onClose }: ShareToastProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!show) setCopied(false);
  }, [show]);

  if (!show) return null;

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/tools/${toolId}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Share tool notification"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 dark:from-zinc-900 dark:to-zinc-800 text-white p-4 rounded-2xl shadow-2xl border border-zinc-700/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-100 leading-tight">
            Enjoyed using {toolTitle}?
          </p>
          <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
            Share this free, private tool with your friends!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Link
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
