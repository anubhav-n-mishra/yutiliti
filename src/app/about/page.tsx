import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Lock, Code, CheckCircle2, Sparkles, ArrowRight, Server, Laptop, Cpu, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "About Yuitility — The 100% Private, Zero-Latency Browser Platform",
  description: "Learn how Yuitility processes 150+ tools 100% inside your local browser memory. Zero server uploads, zero latency, no tracking cookies, and free forever.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
      {/* Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Yuitility</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">
              <ArrowLeft className="w-4 h-4" /> Explore 150+ Tools
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Landing Section */}
      <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>THE ARCHITECTURAL STANDARD FOR THE WEB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.15]">
            The Zero-Latency <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
              In-Browser Utility Engine
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Yuitility replaces slow, ad-choked online converter sites with 150+ ultra-fast browser tools. Your files, calculations, and inputs are processed 100% inside your local CPU memory.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              Launch Platform (150+ Tools) <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#architecture"
              className="px-6 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-2xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Live Metrics Counter Banner */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-600 dark:text-blue-400">150+</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active Live Tools</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">0 KB</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Server Data Saved</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 dark:text-amber-400">100%</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Local Privacy</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-600 dark:text-sky-400">0 ms</p>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Network Latency</p>
          </div>
        </div>
      </section>

      {/* Architecture Comparison Section */}
      <section id="architecture" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-extrabold tracking-tight">Traditional vs Yuitility Architecture</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">See why in-browser processing is safer, faster, and more reliable.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Web Converters */}
          <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Server className="w-6 h-6" />
              <h3 className="text-lg font-bold">Traditional Online Converters</h3>
            </div>
            <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
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
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-6 h-6" />
              <h3 className="text-lg font-bold">Yuitility In-Browser Engine</h3>
            </div>
            <ul className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
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
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
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

      {/* Footer Section */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 text-center space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-semibold">
          <a href="mailto:hello@yuitility.app" className="hover:text-blue-600">hello@yuitility.app</a>
          <a href="mailto:develop.yuitility.app" className="hover:text-blue-600">develop.yuitility.app</a>
          <a href="mailto:support.yuitility.app" className="hover:text-blue-600">support.yuitility.app</a>
        </div>
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Yuitility Platform · Privacy First · Free Forever
        </p>
      </footer>
    </div>
  );
}
