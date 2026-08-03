"use client";

import AnimatedGradientBackground from "@/src/components/ui/animated-gradient-background";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950 text-white flex flex-col items-center justify-center">
      <AnimatedGradientBackground />
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4 px-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
        <h2 className="text-xl font-bold font-display tracking-tight">Loading Yuitility Engine...</h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          Preparing 100% in-browser client utilities with zero server data latency.
        </p>
      </div>
    </div>
  );
}
