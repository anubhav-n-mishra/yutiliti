"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers,
  BookOpen,
  FileText,
  Sparkles,
  Share2,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Wrench
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import PwaInstallButton from './PwaInstallButton';
import ShareModal from './ShareModal';
import ContactModal from './ContactModals';
import SettingsDrawer from './SettingsDrawer';

export default function Header() {
  const pathname = usePathname() || '';
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<'blue' | 'emerald' | 'indigo' | 'rose' | 'amber'>('blue');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactType, setContactType] = useState<'request' | 'feedback' | 'bug'>('request');

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    const savedAccent = localStorage.getItem('accent_color') as any;
    if (savedAccent) {
      setAccentColor(savedAccent);
      const root = document.documentElement;
      root.classList.add(`theme-${savedAccent}`);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('theme-change', { detail: darkMode }));
  }, [darkMode]);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (customEvent.detail !== darkMode) {
        setDarkMode(customEvent.detail);
      }
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, [darkMode]);

  const changeAccent = (color: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber') => {
    setAccentColor(color);
    localStorage.setItem('accent_color', color);
    const root = document.documentElement;
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-')) {
        root.classList.remove(cls);
      }
    });
    root.classList.add(`theme-${color}`);
  };

  const openContactModal = (type: 'request' | 'feedback' | 'bug') => {
    setContactType(type);
    setIsContactOpen(true);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out ${scrolled
        ? 'top-4 w-[90%] md:w-[70%] max-w-4xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
        : 'top-6 w-[94%] max-w-6xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/40 dark:border-zinc-800/40 rounded-3xl md:rounded-full shadow-sm'
        }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-5 h-12' : 'px-6 h-14'}`}>
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <Image src="/brand/yuitility-logo.png" alt="Yuitility logo" width={30} height={30} className="object-contain transition-transform group-hover:scale-105" priority />
              <span className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 tracking-tight">Yuitility</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-650 dark:text-zinc-400">
            <Link
              href="/"
              className={`flex items-center gap-1.5 transition-colors duration-200 ${isActive('/')
                ? 'text-[var(--accent-primary)]'
                : 'text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)]'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Home
            </Link>
            <Link
              href="/tools"
              className={`flex items-center gap-1.5 transition-colors duration-200 ${isActive('/tools')
                ? 'text-[var(--accent-primary)]'
                : 'text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)]'
                }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              All Tools
            </Link>
            <Link
              href="/blog"
              className={`flex items-center gap-1.5 transition-colors duration-200 ${isActive('/blog')
                ? 'text-[var(--accent-primary)]'
                : 'text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)]'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Journal
            </Link>
            <Link
              href="/about"
              className={`flex items-center gap-1.5 transition-colors duration-200 ${isActive('/about')
                ? 'text-[var(--accent-primary)]'
                : 'text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)]'
                }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              About
            </Link>
            <button
              onClick={() => openContactModal('request')}
              className="flex items-center gap-1.5 text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)] transition-colors duration-200 cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:group-hover:text-[var(--accent-primary)] transition-colors" />
              Request Tool
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <PwaInstallButton />

            <button
              onClick={() => setIsShareOpen(true)}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Share platform"
              title="Share platform"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>

            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-3 space-y-1 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-b-3xl text-xs font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${isActive('/') ? 'text-[var(--accent-primary)] bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Layers className="w-4 h-4" /> Home
            </Link>
            <Link
              href="/tools"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${isActive('/tools') ? 'text-[var(--accent-primary)] bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <Wrench className="w-4 h-4" /> All Tools
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${isActive('/blog') ? 'text-[var(--accent-primary)] bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <FileText className="w-4 h-4" /> Journal
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileNavOpen(false)}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-colors ${isActive('/about') ? 'text-[var(--accent-primary)] bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
            >
              <BookOpen className="w-4 h-4" /> About
            </Link>
            <button
              onClick={() => { setIsMobileNavOpen(false); openContactModal('request'); }}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" /> Request Tool
            </button>
          </div>
        )}
      </header>

      {/* Shared Modals */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Yuitility Platform"
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenContact={openContactModal}
        accentColor={accentColor}
        onChangeAccent={changeAccent}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialType={contactType}
      />
    </>
  );
}
