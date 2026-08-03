"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  Calendar,
  KeyRound,
  QrCode,
  FileText,
  Image as ImageIcon,
  Coins,
  Code,
  Palette,
  Search,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  HelpCircle,
  Home as HomeIcon,
  CheckCircle,
  ChevronDown,
  FilePlus2,
  Scissors,
  Stamp,
  FileEdit,
  LayoutGrid,
  Grid3X3,
  List,
  ImageOff,
  Maximize,
  Repeat,
  FileArchive,
  ArrowDownToLine,
  Scale,
  Smile,
  Box,
  ImagePlay,
  Crop,
  Database,
  LayoutDashboard,
  Share2,
  Settings,
  Wrench,
  BookOpen
} from 'lucide-react';

import { TOOLS, CATEGORIES, Tool } from '../types';
import PwaInstallButton from '../components/PwaInstallButton';
import ShareModal from '../components/ShareModal';
import ContactModal from '../components/ContactModals';
import SettingsDrawer from '../components/SettingsDrawer';
import CookieBanner from '../components/CookieBanner';
import AiChatbot from '../components/AiChatbot';

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Calculator,
  TrendingUp,
  Calendar,
  KeyRound,
  QrCode,
  FileText,
  Image: ImageIcon,
  Coins,
  Code,
  Palette,
  FilePlus2,
  Scissors,
  Stamp,
  FileEdit,
  Lock,
  ImageOff,
  Maximize,
  Repeat,
  FileArchive,
  ArrowDownToLine,
  Scale,
  Smile,
  Box,
  ImagePlay,
  Crop,
  Database,
  LayoutDashboard
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMac, setIsMac] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [recentlyUsedToolIds, setRecentlyUsedToolIds] = useState<string[]>([]);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactType, setContactType] = useState<'request' | 'feedback' | 'bug'>('request');

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMac(typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
    const recent = JSON.parse(localStorage.getItem('recently_used_tools') || '[]');
    setRecentlyUsedToolIds(recent);
  }, []);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle sticky header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Dark Mode state to classList
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const openContactModal = (type: 'request' | 'feedback' | 'bug') => {
    setContactType(type);
    setIsContactOpen(true);
  };

  const navigateTo = (toolId: string | null) => {
    if (toolId) {
      // Track in recently used tools
      const updated = [toolId, ...recentlyUsedToolIds.filter((id) => id !== toolId)].slice(0, 10);
      localStorage.setItem('recently_used_tools', JSON.stringify(updated));
    }
    window.location.assign(toolId ? `/tools/${toolId}` : '/');
  };

  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'recent' | 'alpha'>('default');

  // Filter main grid based on active category and sort order
  const filteredTools = useMemo(() => {
    let list = TOOLS.filter((t) => {
      return activeCategory === 'all' || t.category === activeCategory;
    });

    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === 'recent') {
      list = [...list].sort((a, b) => {
        const aIdx = recentlyUsedToolIds.indexOf(a.id);
        const bIdx = recentlyUsedToolIds.indexOf(b.id);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    } else if (sortBy === 'alpha') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [activeCategory, sortBy, recentlyUsedToolIds]);

  // Dedicated search results for the dropdown menu
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter((t) => {
      return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  // Suggested popular tools when search returns zero results
  const suggestedTools = useMemo(() => {
    return TOOLS.filter((t) => t.popular).slice(0, 3);
  }, []);

  return (
    <div className={darkMode ? 'dark text-zinc-100 bg-zinc-950 min-h-screen font-sans antialiased' : 'text-zinc-800 bg-white min-h-screen font-sans antialiased'}>
      
      {/* Header section */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out ${
        scrolled
          ? 'top-4 w-[88%] md:w-[65%] max-w-3xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-blue-500/10'
          : 'top-6 w-[94%] max-w-5xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)]'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-4 h-12' : 'px-5 h-14'}`}>
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigateTo(null)}>
            <Image src="/brand/yuitility-logo.png" alt="Yuitility logo" width={32} height={32} className="object-contain transition-transform group-hover:scale-105" priority />
            <span className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 tracking-tight">Yuitility</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <button onClick={() => navigateTo(null)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Tools</button>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
            <button onClick={() => openContactModal('request')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Request Tool</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Share platform"
              title="Share platform"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="space-y-12">
          
          {/* Compact Clean Toolbar Header with Search, Filter & Sort */}
          <div className="max-w-5xl mx-auto pt-4 pb-2 space-y-6">

            {/* Dynamic query Search bar with Sort & Filter controls inline */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full group" role="search">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-35 transition duration-300"></div>
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" aria-hidden="true" />
                  <label htmlFor="tool-search" className="sr-only">Search tools</label>
                  <input 
                    id="tool-search"
                    ref={searchInputRef}
                    type="text" 
                    placeholder={`Search ${TOOLS.length}+ free tools, calculators...`} 
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 outline-none rounded-2xl text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
                      <span className="text-[10px]">{isMac ? '⌘' : 'Ctrl'}</span> K
                    </kbd>
                  </div>
                </div>

                {/* Search Results Dropdown with "Can't find the tool?" fallback */}
                {searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
                    <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {searchResults.length === 0 ? (
                        <div className="p-4 space-y-4 text-center">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl text-left space-y-2">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              Can&apos;t find &quot;{searchQuery}&quot;?
                            </h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              Request this tool now and our engineering team will build and add it to Yuitility within 24 hours!
                            </p>
                            <button
                              onClick={() => { setSearchQuery(''); openContactModal('request'); }}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                            >
                              Request &quot;{searchQuery}&quot; (24h Add)
                            </button>
                          </div>

                          <div className="text-left pt-2">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Suggested Tools</p>
                            <div className="space-y-1">
                              {suggestedTools.map((t) => {
                                const Icon = IconMap[t.icon] || Calculator;
                                return (
                                  <a
                                    key={t.id}
                                    href={`/tools/${t.id}`}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors text-left"
                                  >
                                    <Icon className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t.title}</span>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        searchResults.map((t) => {
                          const Icon = IconMap[t.icon] || Calculator;
                          return (
                            <a
                              key={t.id}
                              href={`/tools/${t.id}`}
                              className="w-full flex items-start gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors text-left group"
                            >
                              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.title}</h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{t.description}</p>
                              </div>
                            </a>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Selector Dropdown */}
              <div className="w-full md:w-auto flex items-center gap-2 shrink-0">
                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full md:w-auto px-3.5 py-3 text-sm font-semibold rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-sm outline-none cursor-pointer focus:border-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Used</option>
                  <option value="alpha">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Categories filters - Segmented Control with no-scrollbar */}
            <div className="flex justify-center">
              <div className="w-full max-w-full inline-flex items-center gap-1 p-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-x-auto no-scrollbar shadow-sm backdrop-blur-sm" role="tablist" aria-label="Tool categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ease-out ${
                      activeCategory === cat.id 
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-sm' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((t) => {
              const Icon = IconMap[t.icon] || Calculator;
              return (
                <div
                  key={t.id}
                  onClick={() => navigateTo(t.id)}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      {t.popular && (
                        <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-900">
                          Popular
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {t.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>{t.cta}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Section */}
          <footer className="border-t border-zinc-200 dark:border-zinc-800 pt-12 pb-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <Image src="/brand/yuitility-logo.png" alt="Yuitility logo" width={24} height={24} />
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Yuitility</span> — Free Online Tools & Calculators
              </div>

              <div className="flex flex-wrap items-center gap-4 font-semibold text-zinc-600 dark:text-zinc-400">
                <a href="mailto:hello@yuitility.app" className="hover:text-blue-600">hello@yuitility.app</a>
                <a href="mailto:develop.yuitility.app" className="hover:text-blue-600">develop.yuitility.app</a>
                <a href="mailto:support.yuitility.app" className="hover:text-blue-600">support.yuitility.app</a>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              © {new Date().getFullYear()} Yuitility. 100% In-Browser Privacy Guarantee. No Sign-In, Free Forever.
            </p>
          </footer>

        </div>
      </main>

      {/* Global Utility Modals & Components */}
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
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialType={contactType}
      />

      <CookieBanner />

      <AiChatbot />
    </div>
  );
}
