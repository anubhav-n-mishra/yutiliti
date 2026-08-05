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

import { TOOLS, CATEGORIES, Tool } from '../types';
import PwaInstallButton from '../components/PwaInstallButton';
import ShareModal from '../components/ShareModal';
import ContactModal from '../components/ContactModals';
import SettingsDrawer from '../components/SettingsDrawer';
import CookieBanner from '../components/CookieBanner';
import HoverFooter from '../components/ui/hover-footer';
import DottedSurfaceHero from '../components/DottedSurfaceHero';

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
  }, [darkMode]);

  const openContactModal = (type: 'request' | 'feedback' | 'bug') => {
    setContactType(type);
    setIsContactOpen(true);
  };

  const navigateTo = (toolId: string | null) => {
    if (toolId) {
      const updated = [toolId, ...recentlyUsedToolIds.filter((id) => id !== toolId)].slice(0, 10);
      localStorage.setItem('recently_used_tools', JSON.stringify(updated));
    }
    window.location.assign(toolId ? `/tools/${toolId}` : '/');
  };

  const toggleStar = (toolId: string, e: React.MouseEvent) => {
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
      <header className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out ${scrolled
          ? 'top-4 w-[90%] md:w-[70%] max-w-4xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
          : 'top-6 w-[94%] max-w-6xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/40 dark:border-zinc-800/40 rounded-full shadow-sm'
        }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-5 h-12' : 'px-6 h-14'}`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigateTo(null)}>
              <Image src="/brand/yuitility-logo.png" alt="Yuitility logo" width={30} height={30} className="object-contain transition-transform group-hover:scale-105" priority />
              <span className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 tracking-tight">Yuitility</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-650 dark:text-zinc-400">
            <button 
              onClick={() => navigateTo(null)} 
              className="flex items-center gap-1.5 text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)] transition-colors duration-200 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              All Tools
            </button>
            <Link 
              href="/about" 
              className="flex items-center gap-1.5 text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              <BookOpen className="w-3.5 h-3.5" />
              About
            </Link>
            <Link 
              href="/blog" 
              className="flex items-center gap-1.5 text-zinc-600 hover:text-[var(--accent-primary)] dark:text-zinc-400 dark:hover:text-[var(--accent-primary)] transition-colors duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              Blog
            </Link>
            <button 
              onClick={() => openContactModal('request')} 
              className="flex items-center gap-1.5 text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors duration-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
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
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">

        {/* PREMIUM HUMAN-MADE HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-8 pb-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-zinc-900 dark:text-zinc-50 tracking-tight leading-[1.1]">
            All the utilities you need.<br />
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] bg-clip-text text-transparent">
              In one clean workspace.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
            Zero signups. Zero server uploads. Every single calculation and file modification happens entirely inside your browser for complete data privacy.
          </p>
        </section>

        {/* Toolbar Header with Search, Filter & Sort */}
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1 group" role="search">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-300"></div>
              <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-[var(--accent-primary)] transition-colors" aria-hidden="true" />
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

        {/* Tools Grid Section */}
        <section id="tools-grid" className="space-y-8">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
            <span>
              Showing {filteredTools.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredTools.length)} of {filteredTools.length} tools
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* MAIN LISTINGS - SWITCHABLE VIEW MODES */}
          {layoutMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTools.map((t) => {
                const Icon = IconMap[t.icon] || Calculator;
                const isStarred = starredTools.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => navigateTo(t.id)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 hover:border-[var(--accent-primary)]/60 dark:hover:border-[var(--accent-primary)]/45 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between group relative overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-8px_var(--accent-glow)] dark:hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.65)]"
                  >
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] rounded-2xl group-hover:bg-[var(--accent-light)] dark:group-hover:bg-[var(--accent-dark)]/40 transition-colors duration-300">
                          <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex items-center gap-2">
                          {t.popular && (
                            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-900">
                              Popular
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleStar(t.id, e)}
                            className={`p-1.5 rounded-full border transition-all duration-300 ${isStarred
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                                : 'bg-zinc-100/50 dark:bg-zinc-800/40 border-zinc-200/60 dark:border-zinc-800/80 text-zinc-400 hover:text-amber-550 hover:border-amber-500/30'
                              }`}
                            title={isStarred ? "Remove from starred" : "Add to starred"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-current' : ''}`} />
                          </button>
                        </div>
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
                  </div>
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
                  <div
                    key={t.id}
                    onClick={() => navigateTo(t.id)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
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
                    </div>

                    <div className="flex items-center gap-4 mt-3 sm:mt-0 ml-10 sm:ml-0 self-end sm:self-auto">
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold px-2 py-1 rounded-md border border-zinc-200/40 dark:border-zinc-800/40 capitalize">
                        {t.category}
                      </span>
                      <button
                        onClick={(e) => toggleStar(t.id, e)}
                        className="p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-lg transition-colors border border-transparent hover:border-amber-200/50"
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
                    onClick={() => navigateTo(t.id)}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 hover:shadow-md hover:border-[var(--accent-primary)]/40 dark:hover:border-[var(--accent-primary)]/40 transition-all cursor-pointer flex items-center justify-between group gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-[var(--accent-primary)] rounded-lg group-hover:scale-110 transition-transform shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[var(--accent-primary)] transition-colors truncate">
                        {t.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => toggleStar(t.id, e)}
                      className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md shrink-0 transition-colors"
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
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
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
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  document.getElementById("tools-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Interactive Hover Footer */}
      <HoverFooter />

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
        accentColor={accentColor}
        onChangeAccent={changeAccent}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialType={contactType}
      />

      <CookieBanner />
    </div>
  );
}
