"use client";

import Link from "next/link";
import AnimatedGradientBackground from "@/src/components/ui/animated-gradient-background";
import { ArrowLeft, Search, Wrench } from "lucide-react";
import { LIVE_TOOLS } from "@/src/lib/toolRegistry";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 text-white flex flex-col items-center justify-center">
      <AnimatedGradientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 px-4 max-w-md">
        <div className="p-4 bg-blue-600/20 border border-blue-500/40 rounded-full text-blue-400">
          <Wrench className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-extrabold tracking-tight">404 — Tool Not Found</h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The page or tool you are looking for does not exist on Yuitility. Try searching our {LIVE_TOOLS.length} free browser utilities.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Explore all {LIVE_TOOLS.length} tools
          </Link>
        </div>
      </div>
    </div>
  );
}
