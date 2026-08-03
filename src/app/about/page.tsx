import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Lock, Code, CheckCircle, Sparkles, Heart } from "lucide-react";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export const metadata: Metadata = {
  title: "About Yuitility — Free Online Tools Built for Speed & Privacy",
  description: "Learn about Yuitility's local-first architecture. 75+ free browser-based tools that execute 100% in client-side memory with zero server uploads, no accounts, and no tracking.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Yuitility</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400">
            <ArrowLeft className="w-4 h-4" /> Back to Tools
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <span className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
            THE ARCHITECTURAL STANDARD
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Privacy-First Browser Utilities <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500">
              Engineered for Zero Latency.
            </span>
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Yuitility is a suite of 75+ free, high-performance browser tools designed to simplify everyday developer, PDF, financial, and media workflows without creating accounts or uploading files to remote servers.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl inline-block">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">100% In-Browser Engine</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every operation — from PDF merging to AI background removal — runs inside your local browser memory using JavaScript, HTML5 Canvas, and WebAssembly.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl inline-block">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Zero Latency</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No server roundtrips, no upload queues, and no processing wait times. Instant results rendered directly on your machine.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-3 shadow-sm">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl inline-block">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">No Account Required</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              No sign-ups, no passwords, no email subscriptions, and no paywalls. Free forever with unlimited client usage.
            </p>
          </div>
        </div>

        {/* Detailed Platform Story */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 shadow-sm">
          <h2 className="text-2xl font-bold font-display">Why We Built Yuitility</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            The web is flooded with single-purpose utility sites covered in invasive banner ads, forced registration popups, and hidden file size limits. Most of these sites upload your sensitive documents and images to unknown third-party servers.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Yuitility was created to set a new standard: clean commercial design, total privacy, and maximum execution speed. By writing optimized client-side algorithms, we eliminate backend server dependencies so your data never leaves your device.
          </p>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">75+</p>
              <p className="text-xs text-zinc-500">Free Tools</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0 KB</p>
              <p className="text-xs text-zinc-500">Server Uploads</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">100%</p>
              <p className="text-xs text-zinc-500">Client Execution</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400">24 Hours</p>
              <p className="text-xs text-zinc-500">Tool Addition SLA</p>
            </div>
          </div>
        </div>

        {/* Custom Engineering Partner Callout */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-8 space-y-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-display">Need Custom Web or Mobile App Engineering?</h3>
            <p className="text-xs text-blue-100 mt-1 max-w-xl leading-relaxed">
              Yuitility is powered by digital innovation. For custom web applications, enterprise software, mobile apps, or high-intent SEO engineering, explore <strong>Amvelt.com</strong>.
            </p>
          </div>
          <a
            href="https://amvelt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-blue-600 font-bold text-xs rounded-2xl hover:bg-blue-50 transition-colors shrink-0 shadow-sm"
          >
            Visit Amvelt.com →
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Yuitility · Built for the modern web · hello@yuitility.app
      </footer>
    </div>
  );
}
