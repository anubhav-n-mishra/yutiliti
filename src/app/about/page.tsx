import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, ArrowRight, Server, Cpu, Lock, Zap, FileCode, Layers, HelpCircle, Sparkles } from "lucide-react";
import DottedSurfaceHero from "@/src/components/DottedSurfaceHero";
import HoverFooter from "@/src/components/ui/hover-footer";

export const metadata: Metadata = {
  title: "About Yuitility — 100% In-Browser Zero-Latency Utility Engine",
  description: "Learn how Yuitility processes 140+ tools 100% inside your local browser memory. Zero server uploads, zero latency, no tracking cookies, and free forever.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const faqs = [
    {
      q: "How does Yuitility run 100% inside the browser?",
      a: "Yuitility is engineered with modern WebAssembly (WASM) and high-performance client-side JavaScript subroutines. When you open a PDF, convert an image, or compute a loan schedule, all computation happens directly in your CPU memory.",
    },
    {
      q: "Are my files or sensitive financial inputs ever sent to a server?",
      a: "No. Never. Your data never leaves your device network layer. Because there is no backend file processing server, your confidential documents, salary data, and passcodes are completely immune to server data leaks.",
    },
    {
      q: "Why is Yuitility faster than traditional converter websites?",
      a: "Traditional utility websites force you to upload files over the internet, wait in a remote queue, and download the output. Yuitility executes instantly with zero network roundtrips and zero latency.",
    },
    {
      q: "Is Yuitility completely free to use?",
      a: "Yes! All 140+ tools are 100% free with no hidden paywalls, no daily file limits, and no account registration required.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-white">Yuitility</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Explore 140+ Tools
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Animated Hero Landing Section with DottedSurface Wave Animation */}
        <section className="relative py-28 px-4 sm:px-6 overflow-hidden min-h-[75vh] flex items-center justify-center border-b border-zinc-800">
          <DottedSurfaceHero isDark={true} />
          
          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/80 border border-blue-800/80 rounded-full text-xs font-bold text-blue-400 shadow-xl backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>THE ZERO-LATENCY IN-BROWSER UTILITY PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.15] text-white">
              Privately Process 140+ Tools <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                100% Inside Your Local Memory
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Yuitility replaces slow, ad-choked converter websites with a clean, high-precision browser engine. Zero server file uploads, zero data retention, and zero network latency.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                Launch All 140+ Tools <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#architecture"
                className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-xs rounded-2xl shadow-sm hover:bg-zinc-800 transition-all"
              >
                Explore Architecture
              </a>
            </div>
          </div>
        </section>

        {/* Live Metrics Counter Banner */}
        <section className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-extrabold font-mono text-blue-400">140+</p>
              <p className="text-xs font-semibold text-zinc-400">Live Browser Tools</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-extrabold font-mono text-emerald-400">0 KB</p>
              <p className="text-xs font-semibold text-zinc-400">Server File Retention</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-extrabold font-mono text-amber-400">100%</p>
              <p className="text-xs font-semibold text-zinc-400">Client Memory Isolation</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-extrabold font-mono text-cyan-400">0 ms</p>
              <p className="text-xs font-semibold text-zinc-400">Network Processing Delay</p>
            </div>
          </div>
        </section>

        {/* Technical Features Bento Grid */}
        <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white">Engineered for Absolute Privacy & Speed</h2>
            <p className="text-xs text-zinc-400">Built from the ground up for modern browser execution capabilities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">WebAssembly Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                PDF manipulation, image optimization, and archive extraction execute compiled C++/Rust subroutines inside client browser threads.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Server Data Leakage</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your private files, passwords, financial calculations, and data payloads are never transmitted to any external server.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <div className="w-10 h-10 bg-cyan-600/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Progressive Offline App</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Install Yuitility as a PWA on iOS, Android, macOS, or Windows to use 140+ tools offline without an active internet connection.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture Comparison Section */}
        <section id="architecture" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white">Traditional Web Tools vs Yuitility Engine</h2>
            <p className="text-xs text-zinc-400">Compare traditional remote server processing with Yuitility's in-browser technology.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Web Converters */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-3 text-red-400">
                <Server className="w-6 h-6" />
                <h3 className="text-lg font-bold">Traditional Remote Converters</h3>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Uploads confidential PDFs, images, and calculations to third-party server hard disks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>High latency: forced upload delays, server queue waiting, and download delays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Cluttered with banner ads, cookie tracking walls, and artificial daily file paywalls.</span>
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
                  <span>Zero uploads. 100% of calculations execute inside client CPU memory.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Instant execution: zero network latency and instant output generation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Commercial clean design: zero banner ads, zero tracking, and free forever.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Enterprise Partner Callout (Amvelt.com) */}
        <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto my-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase">
                DIGITAL ENGINEERING & GROWTH PARTNER
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold">Need Custom Web, Mobile App or SEO Engineering?</h3>
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

        {/* Platform FAQs Section */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-display font-extrabold tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-zinc-400">Everything you need to know about Yuitility's architecture and usage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-2">
                <h3 className="text-sm font-bold text-white leading-snug">{faq.q}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Full Bleed Edge-to-Edge Hover Footer */}
      <HoverFooter />
    </div>
  );
}
