import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { absoluteUrl, SITE_NAME } from '@/src/lib/site';

export const metadata: Metadata = {
  title: `Cookie Policy – Privacy-First Online Tools Suite | ${SITE_NAME}`,
  description: "Read the Yuitility Cookie Policy. Learn how we use local browser storage strictly for user preferences with zero advertising or tracking cookies.",
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/cookies"),
    siteName: SITE_NAME,
    title: `Cookie Policy – Privacy-First Online Tools Suite | ${SITE_NAME}`,
    description: "Read the Yuitility Cookie Policy. Learn how we use local browser storage strictly for user preferences with zero advertising or tracking cookies.",
  },
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      
      {/* Top navigation bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">Yuitility Legal</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header */}
        <div className="mb-24 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
            Cookie Policy
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            Yuitility does not use third-party advertising cookies, cross-site tracking, or marketing scripts. We utilize local browser storage strictly for user preferences.
          </p>
          <div className="mt-10 inline-block px-4 py-1.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Effective Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl space-y-16 text-zinc-700 dark:text-zinc-300">
          
          <section id="what-are-cookies" className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">1. What Are Cookies and Local Storage?</h2>
            <p className="leading-relaxed">
              Cookies and Web Storage (such as <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">localStorage</code>) are small text files or key-value data structures stored locally on your device by your browser when you visit a website.
            </p>
          </section>

          <section id="how-we-use-storage" className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">2. How Yuitility Uses Local Storage</h2>
            <p className="leading-relaxed">
              Yuitility uses client-side local storage strictly to improve your user experience. We use it for:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong>Theme Preferences:</strong> Saving your light/dark mode preference so it persists across visits.</li>
              <li><strong>Currency Preferences:</strong> Saving your default currency selection (e.g. USD, EUR, INR) for financial calculators.</li>
              <li><strong>Cookie Banner Consent:</strong> Remembering your acknowledgment of this notice.</li>
            </ul>
          </section>

          <section id="no-tracking" className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">3. Zero Advertising or Tracking Cookies</h2>
            <p className="leading-relaxed">
              We do not integrate advertising networks, third-party analytics trackers, or commercial profiling scripts. Your activity on Yuitility is not tracked across websites or shared with third parties.
            </p>
          </section>

          <section id="managing-cookies" className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">4. Managing Your Storage & Cookies</h2>
            <p className="leading-relaxed">
              You can clear your browser storage or block cookies at any time via your browser settings. Clearing your browser data will simply reset your theme and currency preferences to default.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
