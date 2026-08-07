"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Cpu, 
  Lock, 
  Server,
  CheckCircle2,
  Activity,
  Sun,
  Moon,
  ChevronDown
} from "lucide-react";
import DottedSurfaceHero from "@/src/components/DottedSurfaceHero";
import HoverFooter from "@/src/components/ui/hover-footer";
import Header from "@/src/components/Header";

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0 filter-none" : "opacity-0 translate-y-8 blur-[1px]"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutPageClient() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<'blue' | 'emerald' | 'indigo' | 'rose' | 'amber'>('blue');

  const [password, setPassword] = useState("yui-secure-pass");
  const [textInput, setTextInput] = useState("Hello world! Yuitility runs completely locally.");
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [sandboxTab, setSandboxTab] = useState<'password' | 'analyzer'>('password');

  const generatePass = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    const savedAccent = localStorage.getItem('accent_color') as any;
    if (savedAccent) setAccentColor(savedAccent);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const changeAccent = (color: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber') => {
    setAccentColor(color);
    localStorage.setItem('accent_color', color);
  };

  return (
    <div className={`theme-${accentColor} ${darkMode ? 'dark text-zinc-150 bg-zinc-950 min-h-screen font-sans antialiased relative overflow-hidden flex flex-col justify-between' : 'text-zinc-800 bg-white min-h-screen font-sans antialiased relative overflow-hidden flex flex-col justify-between'}`}>
      
      {/* Editorial Decorative Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[var(--accent-glow)] via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-primary)]/3 blur-[120px] pointer-events-none -z-10 animate-float" />

      {/* Main Navigation (Sticky Dock) */}
      <Header />

      <main className="flex-1">
        {/* EDITORIAL HERO SECTION */}
        <section className="relative pt-40 pb-20 px-6 sm:px-8 border-b border-zinc-200/30 dark:border-zinc-900">
          <DottedSurfaceHero isDark={darkMode} />
          
          <div className="relative z-10 max-w-6xl mx-auto space-y-16 animate-fade-in">
            {/* Split layout: Headline & Statement */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              <div className="lg:col-span-7">
                <ScrollReveal delay={0}>
                  <div className="space-y-6">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.05] text-zinc-900 dark:text-white">
                      Computing,<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] via-cyan-400 to-[var(--accent-primary)]">
                        private by design.
                      </span>
                    </h1>
                    
                    <div className="flex gap-4 pt-4">
                      <Link
                        href="/"
                        className="px-6 py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs rounded-xl shadow-lg shadow-[var(--accent-glow)] transition-all flex items-center gap-2 group"
                      >
                        Open Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href="#manifesto"
                        className="px-6 py-3.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs rounded-xl hover:bg-zinc-200/40 dark:hover:bg-zinc-800/60 transition-all"
                      >
                        Read Manifesto
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-5">
                <ScrollReveal delay={150}>
                  <div className="space-y-6 text-zinc-500 dark:text-zinc-400 pt-2 text-sm sm:text-base leading-relaxed">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-base sm:text-lg">
                      We believe web tools should not trade functionality for your personal information.
                    </p>
                    <p>
                      Yuitility is a local-first platform designed to run completely inside your browser's sandboxed memory. File compression, syntax conversions, and PDF formatting execute locally on your CPU - meaning zero network uploads, zero latency, and absolute file safety.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* MANIFESTO / CORE PRINCIPLES */}
        <section id="manifesto" className="py-24 px-6 sm:px-8 max-w-6xl mx-auto space-y-16 border-b border-zinc-200/30 dark:border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Our pillars of local execution.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                Yuitility was created as an alternative to utility websites filled with trackers, pop-up ads, and server processing queues. We run on three design principles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
            <ScrollReveal delay={0}>
              <div className="relative p-8 h-full bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 hover:border-[var(--accent-primary)]/40 rounded-3xl transition-all duration-300 group hover:-translate-y-1.5 shadow-sm">
                <div className="absolute top-6 right-8 font-mono font-black text-2xl text-zinc-200 dark:text-zinc-850 group-hover:text-[var(--accent-primary)]/20 transition-colors">01</div>
                <div className="p-3 w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Client CPU Isolation</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Calculations are run using local client-side engines. By performing conversions inside your browser memory, your files are protected from database breaches or leakages.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="relative p-8 h-full bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 hover:border-emerald-500/30 rounded-3xl transition-all duration-300 group hover:-translate-y-1.5 shadow-sm">
                <div className="absolute top-6 right-8 font-mono font-black text-2xl text-zinc-200 dark:text-zinc-850 group-hover:text-emerald-500/20 transition-colors">02</div>
                <div className="p-3 w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Zero Transmission</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We believe that the safest place for your private files, salary charts, and API tokens is on your own hard drive. Yuitility guarantees zero file uploads.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="relative p-8 h-full bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 hover:border-cyan-500/30 rounded-3xl transition-all duration-300 group hover:-translate-y-1.5 shadow-sm">
                <div className="absolute top-6 right-8 font-mono font-black text-2xl text-zinc-200 dark:text-zinc-850 group-hover:text-cyan-500/20 transition-colors">03</div>
                <div className="p-3 w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Clean Workspace</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  No signups, subscription paywalls, or daily document limits. Yuitility is maintained as a fast, clean toolkit optimized for instant production usage.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ASYMMETRICAL ARCHITECTURE BREAKDOWN */}
        <section className="py-24 px-6 sm:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column (Sticky Title & Dynamic Visualizer) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-6">
              <ScrollReveal>
                <div className="space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-zinc-900 dark:text-white">
                    How it runs in browser.
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Traditional utility websites require an internet connection to send files to external cloud queues. Yuitility runs locally by compiling heavy backend scripts directly into browser bundles.
                  </p>
                </div>
              </ScrollReveal>

              {/* Dynamic Interactive Schematic Canvas */}
              <ScrollReveal>
                <div className="relative p-8 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl overflow-hidden min-h-[220px] flex flex-col justify-center shadow-lg shadow-zinc-100/10 dark:shadow-none">
                  {/* Glowing ambient background corresponding to step */}
                  <div className={`absolute inset-0 transition-opacity duration-700 opacity-[0.03] blur-3xl ${
                    activeStep === 1 ? "bg-blue-500" :
                    activeStep === 2 ? "bg-emerald-500" : "bg-cyan-500"
                  }`} />

                  {activeStep === 1 && (
                    <div className="relative space-y-4 animate-fade-in text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2.5 text-[var(--accent-primary)] font-extrabold text-xs uppercase tracking-wider">
                        <Cpu className="w-4.5 h-4.5" /> WebAssembly Subsystem
                      </div>
                      
                      {/* Graphical CPU Core grid */}
                      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto md:mx-0 p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((core) => (
                          <div 
                            key={core} 
                            className={`h-7 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold border transition-all ${
                              core <= 4 
                                ? "bg-[var(--accent-glow)] border-[var(--accent-primary)]/30 text-[var(--accent-primary)] animate-pulse" 
                                : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-150/40 dark:border-zinc-800 text-zinc-400"
                            }`}
                          >
                            CPU_{core}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                        Near-native C++ and Rust compilation executing directly inside localized browser threads.
                      </p>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="relative space-y-4 animate-fade-in text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2.5 text-emerald-500 font-extrabold text-xs uppercase tracking-wider">
                        <Lock className="w-4.5 h-4.5" /> V8 Isolated Sandbox
                      </div>

                      <div className="flex items-center justify-center md:justify-start gap-4 p-3 mx-auto md:mx-0 max-w-xs bg-white dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl">
                        <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/30 flex items-center justify-center animate-spin-slow">
                          <Lock className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-mono text-[10px] font-extrabold text-zinc-800 dark:text-zinc-200">SHIELD STATE: ACTIVE</p>
                          <p className="font-mono text-[9px] text-emerald-500 font-bold mt-0.5">0 Outgoing Packets</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                        Isolated tab environment context blocks outgoing data streams and prevents cookies transfer.
                      </p>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="relative space-y-4 animate-fade-in text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2.5 text-cyan-500 font-extrabold text-xs uppercase tracking-wider">
                        <Server className="w-4.5 h-4.5" /> PWA Cache Pipeline
                      </div>

                      <div className="p-3.5 bg-white dark:bg-zinc-950/80 border border-zinc-200/50 dark:border-zinc-850 rounded-2xl max-w-xs mx-auto md:mx-0 space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400">
                          <span>LOCAL DATABASE CACHE</span>
                          <span className="text-cyan-500">100% READY</span>
                        </div>
                        <div className="w-full h-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800 rounded-full overflow-hidden">
                          <div className="w-[100%] h-full bg-cyan-500 rounded-full"></div>
                        </div>
                        <div className="text-[9px] text-zinc-500 leading-none">Offline operations supported for all 140+ tools.</div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column (Timeline Steps) */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal delay={0}>
                <div 
                  className={`space-y-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeStep === 1 
                      ? "border-[var(--accent-primary)]/20 bg-zinc-50/50 dark:bg-zinc-900/30" 
                      : "border-transparent hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10"
                  }`}
                  onMouseEnter={() => setActiveStep(1)}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">1. WebAssembly Integration</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    For CPU-intensive tasks like converting file formats, extracting archives, or rendering PDFs, we compile performant libraries into WASM. This allows binary execution inside the browser sandbox at near-native speeds.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div 
                  className={`space-y-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeStep === 2 
                      ? "border-emerald-500/20 bg-zinc-50/50 dark:bg-zinc-900/30" 
                      : "border-transparent hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10"
                  }`}
                  onMouseEnter={() => setActiveStep(2)}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">2. Isolated JavaScript Subroutines</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Financial calculations, hash generation, and text formatting are evaluated in client-side JavaScript threads. These run inside your browser's V8 storage instance, isolated from other tabs and disconnected from network triggers.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div 
                  className={`space-y-3 p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    activeStep === 3 
                      ? "border-cyan-500/20 bg-zinc-50/50 dark:bg-zinc-900/30" 
                      : "border-transparent hover:bg-zinc-50/20 dark:hover:bg-zinc-900/10"
                  }`}
                  onMouseEnter={() => setActiveStep(3)}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">3. Offline Web Application caching</h3>
                  <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-455 leading-relaxed">
                    Yuitility is cacheable as a Progressive Web App (PWA). All assets and engine bundles are saved on your local device. Once loaded, you can disconnect your internet completely and run all 140+ tools offline.
                  </p>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </section>

        {/* MINIMAL PARTNER SECTION */}
        <section className="py-16 px-6 sm:px-8 max-w-6xl mx-auto border-t border-zinc-200/30 dark:border-zinc-900">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-8 px-6 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Need Custom Software Engineering?</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  Yuitility is engineered and optimized by digital product specialists. For custom web applications, mobile development, high-fidelity products, or data-driven SEO growth, visit <strong>Amvelt.com</strong>.
                </p>
              </div>
              <a
                href="https://amvelt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 hover:-translate-y-0.5 duration-200"
              >
                Visit Amvelt.com
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* INTERACTIVE FAQ ACCORDION SECTION */}
        <section className="py-24 px-6 sm:px-8 max-w-4xl mx-auto space-y-12 border-t border-zinc-200/30 dark:border-zinc-900">
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-zinc-900 dark:text-white text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: "How does Yuitility run 100% inside the browser?",
                a: "Yuitility is engineered with WebAssembly (WASM) compiler modules and client-side JavaScript subroutines. When you open a PDF, optimize an image, or evaluate loan calculations, the computations run directly in your browser tab's sandbox memory without any remote calls."
              },
              {
                q: "Are my files or sensitive records sent to a server?",
                a: "No. Because Yuitility runs locally, there is no file upload server. Your confidential documents, financial figures, and passcodes remain strictly offline inside your device cache, immune to remote database leaks."
              },
              {
                q: "Why is Yuitility faster than traditional converter tools?",
                a: "Traditional tools force you to upload files over network pipelines, wait in remote processing queues, and download the output. Yuitility compiles the logic locally, delivering instant file conversions with zero latency."
              },
              {
                q: "Is Yuitility completely free to use?",
                a: "Yes. All 140+ tools are free with no registrations, limits, or paywalls."
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <ScrollReveal key={index} delay={index * 50}>
                  <div className="border-b border-zinc-200/60 dark:border-zinc-800/80 pb-3">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between py-4 text-left font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-250 hover:text-[var(--accent-primary)] dark:hover:text-[var(--accent-primary)] transition-colors group"
                    >
                      <span>{faq.q}</span>
                      <span className={`p-1.5 rounded-full bg-zinc-100/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-400 group-hover:text-[var(--accent-primary)] transition-all shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </span>
                    </button>
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-40 pt-2 pb-4 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </main>

      <HoverFooter />
    </div>
  );
}
