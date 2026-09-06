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
  ChevronLeft,
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
  BookOpen,
  Star,
  CalendarDays,
  Dog,
  Baby,
  PiggyBank,
  GraduationCap,
  Hash,
  Percent,
  Compass,
  Activity,
  DollarSign,
  User,
  Bike,
  Car,
  Building,
  Landmark,
  Briefcase,
  BadgeDollarSign,
  Gift,
  Receipt,
  CreditCard,
  ShieldAlert,
  BarChart3,
  LineChart,
  Tag,
  BadgePercent,
  Wallet,
  Layers,
  Heart
} from 'lucide-react';

import { CATEGORIES, Tool } from '../types';
import { LIVE_TOOLS as TOOLS } from '@/src/lib/toolRegistry';
import Header from '../components/Header';
import CookieBanner from '../components/CookieBanner';
import HoverFooter from '../components/ui/hover-footer';
import DottedSurfaceHero from '../components/DottedSurfaceHero';
// import CinematicHeroText from '../components/CinematicHeroText';
import ScrollReveal from '../components/ScrollReveal';

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
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Dog,
  Baby,
  PiggyBank,
  GraduationCap,
  Hash,
  Percent,
  Compass,
  Activity,
  DollarSign,
  User,
  Bike,
  Car,
  Building,
  Landmark,
  Briefcase,
  BadgeDollarSign,
  Gift,
  Receipt,
  CreditCard,
  ShieldAlert,
  BarChart3,
  LineChart,
  Tag,
  BadgePercent,
  Wallet,
  Layers,
  Heart
};



export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 24;
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMac, setIsMac] = useState<boolean>(false);
  const [starredTools, setStarredTools] = useState<string[]>([]);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [accentColor, setAccentColor] = useState<'blue' | 'emerald' | 'indigo' | 'rose' | 'amber'>('blue');
  const [activeQuickWidget, setActiveQuickWidget] = useState<'none' | 'calculator' | 'password'>('none');
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

    // Load Starred Tools
    const starred = JSON.parse(localStorage.getItem('starred_tools') || '[]');
    setStarredTools(starred);

    // Load Layout and Accent
    const savedLayout = localStorage.getItem('layout_mode') as any;
    if (savedLayout) setLayoutMode(savedLayout);
    const savedAccent = localStorage.getItem('accent_color') as any;
    if (savedAccent) setAccentColor(savedAccent);
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

  const openContactModal = (type: 'request' | 'feedback' | 'bug') => {
    setContactType(type);
    setIsContactOpen(true);
  };

  /**
   * Records the tool in "recently used" and lets the anchor navigate.
   *
   * Previously this called window.location.assign from a div's onClick, which
   * meant the homepage rendered zero crawlable links to any tool page. The
   * cards are now real <Link> elements and this only handles the side effect.
   */
  const rememberVisit = (toolId: string) => {
    try {
      const updated = [toolId, ...recentlyUsedToolIds.filter((id) => id !== toolId)].slice(0, 10);
      localStorage.setItem('recently_used_tools', JSON.stringify(updated));
    } catch {
      /* storage unavailable - navigation still works */
    }
  };

  const toggleStar = (toolId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (starredTools.includes(toolId)) {
      updated = starredTools.filter(id => id !== toolId);
    } else {
      updated = [...starredTools, toolId];
    }
    setStarredTools(updated);
    localStorage.setItem('starred_tools', JSON.stringify(updated));
  };

  const changeAccent = (color: 'blue' | 'emerald' | 'indigo' | 'rose' | 'amber') => {
    setAccentColor(color);
    localStorage.setItem('accent_color', color);
  };

  const changeLayout = (mode: 'grid' | 'list' | 'compact') => {
    setLayoutMode(mode);
    localStorage.setItem('layout_mode', mode);
  };

  const [sortBy, setSortBy] = useState<'default' | 'popular' | 'recent' | 'alpha'>('default');

  // Filter main grid based on active category and sort order
  const filteredTools = useMemo(() => {
    let list = TOOLS.filter((t) => {
      if (activeCategory === 'starred') {
        return starredTools.includes(t.id);
      }
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
  }, [activeCategory, sortBy, starredTools, recentlyUsedToolIds]);

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / ITEMS_PER_PAGE));
  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  // Dedicated search results for the dropdown menu
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter((t) => {
      return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const suggestedTools = useMemo(() => {
    return TOOLS.filter((t) => t.popular).slice(0, 3);
  }, []);

  return (
    <div className={`theme-${accentColor} ${darkMode ? 'dark text-zinc-100 bg-zinc-950 min-h-screen font-sans antialiased relative overflow-hidden' : 'text-zinc-800 bg-white min-h-screen font-sans antialiased relative overflow-hidden'}`}>
      <DottedSurfaceHero isDark={darkMode} />

      {/* Header section */}
      <Header />

      {/* Main Content Area */}
      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">

        {/* PREMIUM HUMAN-MADE HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
            Free Online Browser Tools &amp; Calculators<br />
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] bg-clip-text text-transparent">
              100% Private, In Your Browser
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Zero signups. Zero server uploads. Every single calculation, image transformation, and PDF operation executes entirely inside your browser memory for uncompromising privacy and speed.
          </p>

          {/* Trust badges pill row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
              <Zap className="w-3.5 h-3.5" /> Zero File Uploads
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
              <Sparkles className="w-3.5 h-3.5" /> 79+ Free Fast Tools
            </span>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#tools-directory"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <LayoutGrid className="w-4 h-4" />
              Explore All 79+ Tools
            </a>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('finance');
                const el = document.getElementById('tools-directory');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm border border-zinc-200 dark:border-zinc-800 transition-all active:scale-[0.98]"
            >
              <Calculator className="w-4 h-4" />
              Try Popular Calculators
            </button>
          </div>
        </section>

        {/* Toolbar Header with Search, Filter & Sort */}
        <ScrollReveal delay={100} className="w-full">
          <div id="tools-directory" className="max-w-7xl mx-auto space-y-6 scroll-mt-24">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1 group" role="search">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-[var(--accent-primary)]">
                  <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-[var(--accent-primary)] transition-colors" aria-hidden="true" />
                  <label htmlFor="tool-search" className="sr-only">Search tools</label>
                  <input
                    id="tool-search"
                    ref={searchInputRef}
                    type="text"
                    placeholder={`Search ${TOOLS.length}+ free tools, calculators...`}
                    className="w-full bg-transparent border-none py-3.5 pl-12 pr-20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none rounded-2xl text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
                      <span className="text-[9px]">{isMac ? '⌘' : 'Ctrl'}</span> K
                    </kbd>
                  </div>
                </div>

                {/* Command-Palette Style Dropdown */}
                {searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
                    <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {searchResults.length === 0 ? (
                        <div className="p-4 space-y-4 text-center">
                          <div className="p-4 bg-[var(--accent-glow)] border border-[var(--accent-primary)]/10 rounded-2xl text-left space-y-2">
                            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                              Can&apos;t find &quot;{searchQuery}&quot;?
                            </h4>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                              Request this tool now and we will build and add it to Yuitility within 24 hours!
                            </p>
                            <button
                              onClick={() => { setSearchQuery(''); openContactModal('request'); }}
                              className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                            >
                              Request &quot;{searchQuery}&quot; (24h Add)
                            </button>
                          </div>

                          <div className="text-left pt-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Suggested Tools</p>
                            <div className="space-y-1">
                              {suggestedTools.map((t) => {
                                const Icon = IconMap[t.icon] || Calculator;
                                return (
                                  <a
                                    key={t.id}
                                    href={`/tools/${t.id}`}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition-colors text-left"
                                  >
                                    <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
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
                              className="w-full flex items-start gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl transition-colors text-left group"
                            >
                              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
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

              {/* Layout Toggler & Sort controls */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 rounded-2xl h-11">
                  <button
                    onClick={() => changeLayout('grid')}
                    className={`p-2 rounded-xl transition-all ${layoutMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-[var(--accent-primary)] shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => changeLayout('list')}
                    className={`p-2 rounded-xl transition-all ${layoutMode === 'list' ? 'bg-white dark:bg-zinc-800 text-[var(--accent-primary)] shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => changeLayout('compact')}
                    className={`p-2 rounded-xl transition-all ${layoutMode === 'compact' ? 'bg-white dark:bg-zinc-800 text-[var(--accent-primary)] shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                    title="Compact View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 rounded-2xl h-11">
                  <label htmlFor="sort-by-select" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Sort:</label>
                  <select
                    id="sort-by-select"
                    aria-label="Sort tools by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 outline-none cursor-pointer"
                  >
                    <option className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100" value="default">Default</option>
                    <option className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100" value="popular">Most Popular</option>
                    <option className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100" value="recent">Recently Used</option>
                    <option className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100" value="alpha">A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories filters */}
            <div className="flex justify-center">
              <div className="w-full max-w-full inline-flex items-center gap-1.5 p-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-x-auto no-scrollbar shadow-sm backdrop-blur-sm" role="tablist" aria-label="Tool categories">
                {/* Starred filter button */}
                <button
                  onClick={() => setActiveCategory('starred')}
                  role="tab"
                  aria-selected={activeCategory === 'starred'}
                  className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ease-out flex items-center gap-1.5 ${activeCategory === 'starred'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Favorites ({starredTools.length})
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ease-out ${activeCategory === cat.id
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
        </ScrollReveal>

        {/* Tools Grid Section */}
        <section id="tools-grid" aria-labelledby="tools-catalog-heading" className="space-y-8">
          <h2 id="tools-catalog-heading" className="sr-only">
            Free Browser Utilities Catalog
          </h2>
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>
              Showing {filteredTools.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTools.length)} of {filteredTools.length} tools
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* MAIN LISTINGS - SWITCHABLE VIEW MODES */}
          {layoutMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTools.map((t, idx) => {
                const Icon = IconMap[t.icon] || Calculator;
                const isStarred = starredTools.includes(t.id);
                return (
                  <ScrollReveal key={t.id} delay={(idx % 3) * 60}>
                    {/* The card is a real anchor so the homepage passes link
                        equity and anchor text to every tool page. The star
                        control sits outside the anchor - interactive content
                        must not be nested inside <a>. */}
                    <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl hover:border-[var(--accent-primary)]/60 dark:hover:border-[var(--accent-primary)]/45 transition-all duration-300 ease-out group overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_var(--accent-glow)] dark:hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.65)]">
                      <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                        {t.popular && (
                          <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-900">
                            Popular
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => toggleStar(t.id, e)}
                          className={`p-1.5 rounded-full border transition-all duration-300 ${isStarred
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                            : 'bg-zinc-100/50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800/80 text-zinc-400 hover:text-amber-550 hover:border-amber-500/30'
                            }`}
                          aria-label={isStarred ? `Remove ${t.title} from starred` : `Add ${t.title} to starred`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <Link
                        href={`/tools/${t.id}`}
                        onClick={() => rememberVisit(t.id)}
                        className="flex h-full flex-col justify-between p-6 cursor-pointer"
                      >
                        <div className="space-y-4 relative z-10">
                          <div className="p-3 w-fit bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] rounded-2xl group-hover:bg-[var(--accent-light)] dark:group-hover:bg-[var(--accent-dark)]/40 transition-colors duration-300">
                            <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--accent-primary)] transition-colors">
                              {t.title}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {t.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-[var(--accent-primary)] relative z-10">
                          <span>{t.cta}</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          {layoutMode === 'list' && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900 overflow-hidden divide-y divide-zinc-200/60 dark:divide-zinc-850">
              {paginatedTools.map((t) => {
                const Icon = IconMap[t.icon] || Calculator;
                const isStarred = starredTools.includes(t.id);
                return (
                  <div key={t.id} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 group transition-all">
                    <Link
                      href={`/tools/${t.id}`}
                      onClick={() => rememberVisit(t.id)}
                      className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer after:absolute after:inset-0 after:content-['']"
                    >
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] rounded-xl group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--accent-primary)] transition-colors truncate">
                          {t.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                          {t.description}
                        </p>
                      </div>
                    </Link>

                    <div className="relative z-10 flex items-center gap-4 mt-3 sm:mt-0 ml-10 sm:ml-0 self-end sm:self-auto">
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold px-2 py-1 rounded-md border border-zinc-200/40 dark:border-zinc-800/40 capitalize">
                        {t.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleStar(t.id, e)}
                        className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-colors border border-transparent hover:border-amber-200/50"
                        aria-label={isStarred ? `Remove ${t.title} from starred` : `Add ${t.title} to starred`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
                      </button>
                      <span className="text-xs font-bold text-[var(--accent-primary)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Run <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {layoutMode === 'compact' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedTools.map((t) => {
                const Icon = IconMap[t.icon] || Calculator;
                const isStarred = starredTools.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 hover:shadow-md hover:border-[var(--accent-primary)]/40 dark:hover:border-[var(--accent-primary)]/40 transition-all flex items-center justify-between group gap-2"
                  >
                    <Link
                      href={`/tools/${t.id}`}
                      onClick={() => rememberVisit(t.id)}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer after:absolute after:inset-0 after:content-['']"
                    >
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] rounded-lg group-hover:scale-110 transition-transform shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[var(--accent-primary)] transition-colors truncate">
                        {t.title}
                      </h3>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => toggleStar(t.id, e)}
                      className="relative z-10 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md shrink-0 transition-colors"
                      aria-label={isStarred ? `Remove ${t.title} from starred` : `Add ${t.title} to starred`}
                    >
                      <Star className={`w-3 h-3 ${isStarred ? 'text-amber-500 fill-amber-500' : 'text-zinc-400'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                  document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-1 px-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all h-9 shrink-0"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline ml-0.5">Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  return (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  );
                })
                .map((pageNum, idx, arr) => {
                  const showEllipsisBefore = pageNum > 1 && arr[idx - 1] !== pageNum - 1;
                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsisBefore && (
                        <span className="w-9 h-9 flex items-center justify-center text-xs font-bold text-zinc-400 select-none">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setCurrentPage(pageNum);
                          document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${currentPage === pageNum
                          ? "bg-[var(--accent-primary)] text-white shadow-md"
                          : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-1 px-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all h-9 shrink-0"
                aria-label="Next page"
              >
                <span className="hidden sm:inline mr-0.5">Next</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        
          {/* Crawlable entry points.
              The grid above is paginated client-side, so pages 2+ produce no
              URLs a crawler can follow. These links (and /tools) are how the
              full corpus stays reachable from the site's strongest page. */}
          <nav aria-label="Browse all tools" className="border-t border-zinc-200 dark:border-zinc-800 pt-8 space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Prefer one long list?{' '}
              <Link href="/tools" className="font-bold text-[var(--accent-primary)] hover:underline">
                See all {TOOLS.length} Yuitility tools on a single page
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-[var(--accent-primary)]/50 hover:text-[var(--accent-primary)] transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>

</section>
      </main>

      {/* Interactive Hover Footer */}
      <HoverFooter />

      <CookieBanner />
    </div>
  );
}
