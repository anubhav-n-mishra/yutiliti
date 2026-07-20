import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      
      {/* Ultra-clean top navigation bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-display font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">Yutiliti Legal</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Editorial Header */}
        <div className="mb-24 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Your data is your property. We have built Yutiliti on a foundation of absolute privacy, ensuring your files never leave your device.
          </p>
          <div className="mt-10 inline-block px-4 py-1.5 rounded-md bg-zinc-200/50 dark:bg-zinc-800/50 text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
            Effective Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Two-column layout: TOC + Content */}
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 relative">
          
          {/* Sticky Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-32">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Contents</h4>
              <ul className="space-y-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                <li><a href="#client-side" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">1. Client-Side Processing</a></li>
                <li><a href="#no-collection" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">2. No Data Collection</a></li>
                <li><a href="#cookies" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">3. Tracking & Cookies</a></li>
                <li><a href="#libraries" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">4. Open Source Libraries</a></li>
                <li><a href="#updates" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">5. Updates to Policy</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Body */}
          <main className="max-w-3xl flex-1 pb-20">
            
            <section id="client-side" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                1. 100% Client-Side Processing
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every tool on Yutiliti executes its calculations and modifications locally within your web browser. We do not own any backend servers for processing your files. 
                Whether you are removing a background, converting a PDF, or generating JSON data, all operations occur directly in your device's memory.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="no-collection" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                2. No Data Collection
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                We explicitly <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">do not collect</strong>, intercept, or upload:
              </p>
              <ul className="space-y-4 text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed list-disc list-inside ml-2">
                <li>Uploaded Images & PDFs</li>
                <li>Passwords or generated credentials</li>
                <li>Formatted JSON or SQL code</li>
                <li>Financial or calculator inputs</li>
              </ul>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mt-6">
                Once you close your browser tab or clear your local cache, the temporary memory used by our application is completely wiped by your browser.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="cookies" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                3. Zero Tracking & Cookies
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Yutiliti is designed to be distraction-free and respects your anonymity. We do not use third-party analytics (like Google Analytics) or advertising trackers. 
                The only data saved is your UI preferences (like your choice between light and dark mode), which is stored safely in your browser's local storage and never transmitted to our servers.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="libraries" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                4. Open Source Libraries
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our advanced tools utilize trusted open-source libraries that execute securely in a sandboxed WebAssembly environment. Because there are no backend servers, you are protected from traditional server-side vulnerabilities and data breaches.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="updates" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                5. Updates to Policy
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We reserve the right to update this policy. Because our architecture is strictly local, any future changes involving cloud services would require explicit user consent and opt-in. Currently, our pledge remains: <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">Zero Uploads, Zero Latency.</strong>
              </p>
            </section>

          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 text-center text-sm font-semibold text-zinc-400 dark:text-zinc-500">
        © {new Date().getFullYear()} Yutiliti. Owned by amvelt.com and the Yutiliti team. Built for developers.
      </footer>
    </div>
  );
}
