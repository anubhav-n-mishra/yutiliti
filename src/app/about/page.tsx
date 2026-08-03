import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, ArrowRight, Server, Cpu } from "lucide-react";
import DottedSurfaceHero from "@/src/components/DottedSurfaceHero";
import HoverFooter from "@/src/components/ui/hover-footer";

export const metadata: Metadata = {
  title: "About Yuitility — The 100% Private, Zero-Latency Browser Platform",
  description: "Learn how Yuitility processes 152+ tools 100% inside your local browser memory. Zero server uploads, zero latency, no tracking cookies, and free forever.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-white">Yuitility</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Explore 152+ Tools
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Animated Hero Landing Section with DottedSurface Wave Animation */}
        <section className="relative py-24 px-4 sm:px-6 overflow-hidden min-h-[70vh] flex items-center justify-center">
          <DottedSurfaceHero isDark={true} />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/80 border border-blue-800/80 rounded-full text-xs font-bold text-blue-400 shadow-xl backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>THE ARCHITECTURAL STANDARD FOR THE WEB</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.15] text-white">
              The Zero-Latency <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                In-Browser Utility Engine
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Yuitility replaces slow, ad-choked online converter sites with 152+ ultra-fast browser tools. Your files, calculations, and inputs are processed 100% inside your local CPU memory.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                Launch Platform (152+ Tools) <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#architecture"
                className="px-7 py-4 bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-xs rounded-2xl shadow-sm hover:bg-zinc-800 transition-all"
              >
                How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Live Metrics Counter Banner */}
        <section className="border-y border-zinc-800 bg-zinc-900/80 backdrop-blur-md py-10">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-400">152+</p>
              <p className="text-xs font-semibold text-zinc-400">Active Live Tools</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">0 KB</p>
              <p className="text-xs font-semibold text-zinc-400">Server Data Saved</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">100%</p>
              <p className="text-xs font-semibold text-zinc-400">Local Privacy</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400">0 ms</p>
              <p className="text-xs font-semibold text-zinc-400">Network Latency</p>
            </div>
          </div>
        </section>

        {/* Architecture Comparison Section */}
        <section id="architecture" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white">Traditional vs Yuitility Architecture</h2>
            <p className="text-xs text-zinc-400">See why in-browser processing is safer, faster, and more reliable.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Web Converters */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <Server className="w-6 h-6" />
                <h3 className="text-lg font-bold">Traditional Online Converters</h3>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Uploads confidential PDFs, images, and calculations to remote server hard disks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>High latency: file upload delays, processing queues, and download waits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Cluttered with banner ads, cookie tracking walls, and hidden paywall limits.</span>
                </li>
              </ul>
            </div>

            {/* Yuitility In-Browser Architecture */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Cpu className="w-6 h-6" />
                <h3 className="text-lg font-bold">Yuitility In-Browser Engine</h3>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero uploads. 100% of data processed inside client-side JavaScript memory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Instant execution: instant rendering with 0ms network server roundtrips.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Commercial clean design: zero ads, zero tracking, and no sign-up required.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Enterprise Partner Callout (Amvelt.com) */}
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase">
                POWERED BY AMVELT
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold">Need Custom Web, App or SEO Engineering?</h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                Yuitility is engineered by digital product specialists. For custom software development, mobile app engineering, enterprise web applications, or data-driven SEO growth, visit <strong>Amvelt.com</strong>.
              </p>
            </div>
            <a
              href="https://amvelt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-blue-600 font-bold text-xs rounded-2xl hover:bg-blue-50 transition-all shrink-0 shadow-lg"
            >
              Visit Amvelt.com →
            </a>
          </div>
        </section>
      </main>

      {/* Full Bleed Edge-to-Edge Hover Footer */}
      <HoverFooter />
    </div>
  );
}
