import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased">
      
      {/* Ultra-clean top navigation bar */}
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
        
        {/* Editorial Header */}
        <div className="mb-24 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Please read these terms carefully. By using our local-first utility suite, you agree to the conditions governing our application logic and responsibilities.
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
                <li><a href="#services" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">1. Provision of Services</a></li>
                <li><a href="#responsibilities" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">2. User Responsibilities</a></li>
                <li><a href="#proprietary" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">3. Proprietary Rights</a></li>
                <li><a href="#warranties" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">4. Disclaimer of Warranties</a></li>
                <li><a href="#liability" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block">5. Limitation of Liability</a></li>
              </ul>
            </div>
          </aside>

          {/* Main Content Body */}
          <main className="max-w-3xl flex-1 pb-20">
            
            <section id="services" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                1. Acceptance & Provision of Services
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Yuitility provides a suite of advanced developer and media utilities provided "as is" and "as available". We do not guarantee uninterrupted, secure, or error-free tools. 
                Because our application logic runs entirely in your local browser environment, performance is strictly tied to your device's hardware constraints and browser capabilities.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="responsibilities" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                2. User Responsibilities & Rights
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                You are solely responsible for the files, images, and raw data you process using Yuitility. 
                While Yuitility processes tool inputs in your browser instead of using a Yuitility file-processing server, you must ensure you have the legal right and copyright permissions to modify, share, or reproduce the documents and images processed through our toolkit.
              </p>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We do not monitor the content passing through our application because we simply do not have the technical capability to view files that remain on your local device.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="proprietary" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                3. Proprietary Rights
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The original interface, aesthetic layout, structural design, and specific combination of local technologies that formulate Yuitility are our exclusive property. 
                You may not blindly copy, scrape, or reverse-engineer the visual branding of Yuitility without express written authorization.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="warranties" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                4. Disclaimer of Warranties
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Yuitility is utilized entirely at your own risk. The toolsets are provided without any warranties, express or implied. 
                We specifically disclaim implied warranties of merchantability, fitness for a specific purpose, and non-infringement. We cannot be held responsible for corrupted files resulting from in-browser memory exhaustion.
              </p>
            </section>

            <hr className="my-14 border-zinc-200 dark:border-zinc-800/80" />

            <section id="liability" className="scroll-mt-32">
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
                5. Limitation of Liability
              </h2>
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                In no absolute event shall Yuitility, nor its developers, be held liable for any indirect, incidental, consequential, or punitive damages arising out of your access to our utility suite. 
                This includes, but is not limited to, data loss, business disruption, or hardware failure resulting from intensive local processing.
              </p>
            </section>

          </main>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 text-center text-sm font-semibold text-zinc-400 dark:text-zinc-500">
        © {new Date().getFullYear()} Yuitility. Private, practical browser tools.
      </footer>
    </div>
  );
}
