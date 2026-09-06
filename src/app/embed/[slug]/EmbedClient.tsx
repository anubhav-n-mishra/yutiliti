"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2, ShieldCheck } from "lucide-react";
import { Tool } from "@/src/types";
import { toolPath } from "@/src/lib/site";
import { ToolRenderer } from "@/src/components/ToolPageClient";

interface EmbedClientProps {
  tool: Tool;
}

export default function EmbedClient({ tool }: EmbedClientProps) {
  const [message, setMessage] = useState<string>("");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Detect parent or system theme preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    }
  }, []);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 2200);
    } catch {
      setMessage("Copy failed.");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const share = async (title: string, path: string) => {
    const url = `${window.location.origin}${toolPath(tool.id)}`;
    await copy(url);
  };

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 flex flex-col justify-between p-3 sm:p-5 font-sans`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <img src="/brand/yuitility-logo.png" alt="Yuitility logo" width={22} height={22} className="h-5.5 w-5.5 object-contain" />
          <h1 className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-white m-0 p-0">
            {tool.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Privacy
          </span>
          <a
            href={toolPath(tool.id)}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition"
            title="Open full screen in a new tab"
          >
            Full View <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Tool Component */}
      <div className="flex-1">
        <ToolRenderer tool={tool} onCopy={copy} onShare={share} />
      </div>

      {/* Attribution Footer */}
      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1 text-[11px]">
          🔒 Client-side only • Zero data uploaded
        </span>
        <a
          href={toolPath(tool.id)}
          target="_blank"
          rel="noopener"
          className="font-semibold text-blue-600 hover:underline dark:text-cyan-400 inline-flex items-center gap-1"
        >
          ⚡ Free &amp; Private Tools by Yuitility
        </a>
      </div>

      {/* Toast */}
      {message && (
        <div className="fixed bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-zinc-900 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          {message}
        </div>
      )}
    </div>
  );
}
