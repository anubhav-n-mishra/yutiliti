"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  MessageSquareCode,
  HelpCircle,
  Home,
  CheckCircle,
  AlertCircle,
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
  LayoutDashboard
} from 'lucide-react';

import { TOOLS, CATEGORIES, Tool } from '../types';

// Import our individual modular tools
import EmiCalculator from '../components/tools/EmiCalculator';
import SipCalculator from '../components/tools/SipCalculator';
import AgeCalculator from '../components/tools/AgeCalculator';
import PasswordGenerator from '../components/tools/PasswordGenerator';
import QrCodeGenerator from '../components/tools/QrCodeGenerator';
import WordCounter from '../components/tools/WordCounter';
import ImageCompressor from '../components/tools/ImageCompressor';
import SalaryCalculator from '../components/tools/SalaryCalculator';
import JsonFormatter from '../components/tools/JsonFormatter';
import ColorPalette from '../components/tools/ColorPalette';
import PdfMerger from '../components/tools/PdfMerger';
import PdfSplitter from '../components/tools/PdfSplitter';
import ImageToPdf from '../components/tools/ImageToPdf';
import PdfWatermarker from '../components/tools/PdfWatermarker';
import PdfMetadata from '../components/tools/PdfMetadata';
import BackgroundRemover from '../components/tools/BackgroundRemover';
import ImageResizer from '../components/tools/ImageResizer';
import FormatConverter from '../components/tools/FormatConverter';
import PdfCompressor from '../components/tools/PdfCompressor';
import ZipExtractor from '../components/tools/ZipExtractor';
import UnitConverter from '../components/tools/UnitConverter';
import MemeMaker from '../components/tools/MemeMaker';
import FaviconGenerator from '../components/tools/FaviconGenerator';
import OgImageGenerator from '../components/tools/OgImageGenerator';
import SocialMediaResizer from '../components/tools/SocialMediaResizer';
import FakeDataGenerator from '../components/tools/FakeDataGenerator';
import PhotoCollageMaker from '../components/tools/PhotoCollageMaker';



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

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'large' | 'small' | 'list'>('large');
  
  // Custom Toast Message state
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Scroll State
  const [scrolled, setScrolled] = useState<boolean>(false);

  // URL Hash-based router
  // URL Hash-based router
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState<boolean>(true);

  useEffect(() => {
    // Detect OS for keyboard shortcuts
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    // Global Search Shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        // If not on homepage, go to homepage to search
        if (window.location.hash.length > 1) {
          window.location.hash = '#/';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Initialize Dark Mode on mount (default to light mode)
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);

    // Initialize Hash Router
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    setActiveToolId(hash || null);

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#/', '').replace('#', '');
      setActiveToolId(newHash || null);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);

    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
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

  const showToastMessage = (msg: string) => {
    setToast({ message: msg, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToastMessage('Copied to clipboard successfully!');
  };

  const handleShare = (title: string, path: string) => {
    const canonicalPath = path === '#/' ? '/' : path.startsWith('#/') ? `/tools/${path.slice(2)}` : path;
    const fullUrl = `${window.location.origin}${canonicalPath}`;
    navigator.clipboard.writeText(fullUrl);
    showToastMessage(`Copied direct share link for ${title}!`);
  };

  const navigateTo = (toolId: string | null) => {
    window.location.assign(toolId ? `/tools/${toolId}` : '/');
  };

  // Filter main grid ONLY based on active category (search no longer filters main grid)
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      return activeCategory === 'all' || t.category === activeCategory;
    });
  }, [activeCategory]);

  // Dedicated search results for the dropdown menu
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter((t) => {
      return t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const activeTool = useMemo(() => {
    return TOOLS.find((t) => t.id === activeToolId) || null;
  }, [activeToolId]);

  // Split tools into Popular & Recent for dynamic landing grids
  const popularTools = useMemo(() => TOOLS.filter((t) => t.popular), []);
  const recentlyAddedTools = useMemo(() => TOOLS.filter((t) => t.recentlyAdded), []);

  // FAQ list for landing page
  const generalFAQs = [
    {
      question: "Are my input files or calculations processed on your servers?",
      answer: "No. Yuitility processes your inputs in your browser and does not use a Yuitility file-processing server. Some tools may download public code or models required to run locally."
    },
    {
      question: "Does Yuitility use tracking cookies?",
      answer: "No. Yuitility does not include advertising trackers or analytics scripts. Your theme preference is stored only in your browser's local storage."
    },
    {
      question: "Can I deep-link and share calculations directly with peers?",
      answer: "Yes! Every single tool features active URL hash routing. Simply click the 'Share' button in the toolbar of any utility tool to copy a direct share link that pre-opens that exact module for anyone."
    }
  ];

  return (
    <div className={darkMode ? 'dark text-zinc-100 bg-zinc-950 min-h-screen font-sans antialiased' : 'text-zinc-800 bg-zinc-50/50 min-h-screen font-sans antialiased'}>
      
      {/* Header section */}
      <header className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'top-4 w-[85%] md:w-[60%] max-w-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-blue-500/10'
          : 'top-6 w-[92%] max-w-4xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)]'
      }`}>
        <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'px-4 h-12' : 'px-4 h-14'}`}>
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigateTo(null)}>
            <img src="/brand/yuitility-logo.png" alt="" className="h-8 w-8 object-contain transition-transform group-hover:scale-105" />
            <div>
              <span className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 tracking-tight">Yuitility</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <button onClick={() => navigateTo(null)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Utilities</button>
            <a href="#why-choose" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            {/* Dark Mode toggle */}
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem('theme', newMode ? 'dark' : 'light');
              }}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all"
              title="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleShare("Yuitility Library", "#/")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-sm hover:shadow-md dark:shadow-blue-500/10 text-xs font-bold rounded-xl hover:scale-105 transition-all"
            >
              Share <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dynamic View Controller */}
      <main className="max-w-7xl mx-auto px-4 pt-28 pb-12 relative">
        
        {/* Animated Background Orbs for Hero */}
        {!activeTool && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-float-delayed" />
          </div>
        )}
        
        {activeTool ? (
          /* SINGLE TOOL VIEW PANEL */
          <div className="space-y-6">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <button onClick={() => navigateTo(null)} className="hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center gap-1">
                <Home className="w-3 h-3" />
                Home
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="capitalize">{activeTool.category}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-900 dark:text-zinc-300 font-semibold">{activeTool.title}</span>
            </div>

            {/* Active Tool Loader */}
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl p-6 md:p-8 shadow-sm">
              {activeTool.id === 'emi-calculator' && <EmiCalculator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'sip-calculator' && <SipCalculator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'age-calculator' && <AgeCalculator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'password-generator' && <PasswordGenerator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'qr-code-generator' && <QrCodeGenerator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'word-counter' && <WordCounter onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'image-compressor' && <ImageCompressor onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'salary-calculator' && <SalaryCalculator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'json-formatter' && <JsonFormatter onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'color-palette' && <ColorPalette onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'pdf-merger' && <PdfMerger onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'pdf-splitter' && <PdfSplitter onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'image-to-pdf' && <ImageToPdf onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'pdf-watermark' && <PdfWatermarker onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'pdf-metadata' && <PdfMetadata onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'background-remover' && <BackgroundRemover onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'image-resizer' && <ImageResizer onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'format-converter' && <FormatConverter onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'pdf-compressor' && <PdfCompressor onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'zip-extractor' && <ZipExtractor onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'unit-converter' && <UnitConverter onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'meme-maker' && <MemeMaker onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'favicon-generator' && <FaviconGenerator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'og-image-generator' && <OgImageGenerator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'social-media-resizer' && <SocialMediaResizer onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'fake-data-generator' && <FakeDataGenerator onCopy={handleCopy} onShare={handleShare} />}
              {activeTool.id === 'photo-collage-maker' && <PhotoCollageMaker onCopy={handleCopy} onShare={handleShare} />}


            </div>
          </div>
        ) : (
          /* HOMEPAGE / LANDING SECTION */
          <div className="space-y-16">
            
            {/* Premium Hero block */}
            <div className="text-center max-w-5xl mx-auto py-20 relative">
              
              

              <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.15] mb-6">
                The refined toolkit for <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-300">
                  builders & analysts.
                </span>
              </h1>
              
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                Enjoy beautifully designed local browser instruments for calculations, media, and structures. Engineered for speed, privacy, and zero latency.
              </p>

              {/* Dynamic query Search bar */}
              <div className="relative max-w-2xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl transition-shadow group-hover:shadow-2xl">
                  <Search className="absolute left-4 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search tools, calculators, formats..." 
                    className="w-full bg-transparent border-none py-4 pl-12 pr-20 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-0 outline-none rounded-2xl text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
                      <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span> K
                    </kbd>
                  </div>
                </div>

                {/* Search Results Dropdown */}
                {searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300 text-left">
                    <div className="max-h-[350px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {searchResults.length === 0 ? (
                        <div className="p-4 text-center text-sm text-zinc-500">No results found for "{searchQuery}"</div>
                      ) : (
                        searchResults.map((t) => {
                          const Icon = IconMap[t.icon] || Calculator;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                setSearchQuery('');
                                navigateTo(t.id);
                              }}
                              className="w-full flex items-start gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors text-left group"
                            >
                              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.title}</h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{t.description}</p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust indicators */}
              <div className="pt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Local Execution</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Tracking Cookies</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Instant Results</div>
              </div>
            </div>

            {/* Categories filters - Premium Segmented Control */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-1 p-1.5 bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl overflow-x-auto shadow-sm backdrop-blur-sm">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-300 ease-out ${
                      activeCategory === cat.id 
                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)]' 
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Grid Listing */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  {activeCategory === 'all' ? 'All Utilities' : `${activeCategory} Tools`}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg">
                    <button onClick={() => setViewMode('large')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'large' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`} title="Large Grid"><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('small')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'small' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`} title="Compact Grid"><Grid3X3 className="w-4 h-4" /></button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`} title="List View"><List className="w-4 h-4" /></button>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono font-bold hidden sm:inline-block">{filteredTools.length} results</span>
                </div>
              </div>

              {filteredTools.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                  <p className="text-sm text-zinc-500">No tools match your active search filter query.</p>
                </div>
              ) : (
                <div className={
                  viewMode === 'list' 
                    ? "flex flex-col gap-3" 
                    : viewMode === 'small' 
                      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }>
                  {filteredTools.map((t) => {
                    const CardIcon = IconMap[t.icon] || Calculator;
                    return (
                      <a
                        key={t.id}
                          href={t.disabled ? undefined : `/tools/${t.id}`}
                          className={`group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden ${
                            t.disabled 
                              ? 'opacity-60 cursor-not-allowed grayscale pointer-events-none' 
                              : 'hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer'
                          } ${
                            viewMode === 'list' 
                              ? "flex flex-row items-center justify-between p-4 rounded-2xl hover:-translate-y-0.5" 
                              : viewMode === 'small'
                                ? "flex flex-col justify-between p-5 rounded-2xl hover:-translate-y-1 h-52"
                                : "flex flex-col justify-between p-6 rounded-3xl hover:-translate-y-1 h-60"
                          }`}
                        >
                        {viewMode === 'list' ? (
                          <div className="flex items-center gap-4 w-full">
                            <div className="p-3 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                              <CardIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-display font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {t.title}
                                </h3>
                                {t.popular && <span className="hidden sm:inline-block text-[9px] font-bold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 px-2 py-0.5 rounded-full shadow-sm">HOT</span>}
                                {t.recentlyAdded && <span className="hidden sm:inline-block text-[9px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 px-2 py-0.5 rounded-full shadow-sm">NEW</span>}
                              </div>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{t.description}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        ) : (
                          <>
                            {/* Decorative Background for cards */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent to-blue-50/30 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-32 bg-blue-100/20 dark:bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div className="relative z-10">
                              {/* Card Icon Header */}
                              <div className="flex justify-between items-start">
                                <div className={`bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 ${viewMode === 'small' ? 'p-2.5 rounded-xl' : 'p-3 rounded-2xl'}`}>
                                  <CardIcon className={viewMode === 'small' ? 'w-5 h-5' : 'w-6 h-6'} />
                                </div>
                                
                                {/* Badges */}
                                <div className="flex gap-1.5 flex-col items-end sm:flex-row sm:items-center">
                                  {t.popular && (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 px-2.5 py-1 rounded-full shadow-sm">
                                      HOT
                                    </span>
                                  )}
                                  {t.recentlyAdded && (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/50 px-2.5 py-1 rounded-full shadow-sm">
                                      NEW
                                    </span>
                                  )}
                                </div>
                              </div>

                              <h3 className={`font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${viewMode === 'small' ? 'text-[17px] mt-4 line-clamp-2' : 'text-xl mt-5 line-clamp-1'}`}>
                                {t.title}
                              </h3>
                              <p className={`text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 ${viewMode === 'small' ? 'text-[13px] mt-1.5' : 'text-sm mt-2'}`}>
                                {t.description}
                              </p>
                            </div>

                            {/* Card CTA Footer */}
                            <div className={`relative z-10 flex items-center gap-2 font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${viewMode === 'small' ? 'text-xs mt-4' : 'text-sm mt-4'}`}>
                              <span>{t.cta}</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </>
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Why Choose Yuitility Section (Bento Grid) */}
            <div id="why-choose" className="pt-20">
              <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">The Architectural Standard</h2>
                <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">Professional developer tools that are instantaneous, distraction-free, and respectful of core privacy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl mx-auto">
                <div className="md:col-span-8 bg-gradient-to-br from-blue-600 to-cyan-500 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 space-y-4">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl inline-block">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold">100% In-Browser Privacy</h3>
                    <p className="text-blue-100 leading-relaxed max-w-md">
                      Zero uploads. Raw inputs, image compressions, and credential generators run completely in client-side memory using pure native scripts. We never see your data.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow group">
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">Zero Latency</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Calculations run on optimized JavaScript routines. Avoid remote cloud roundtrips for maximum speed.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow flex flex-col md:flex-row items-center gap-8 group">
                  <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl group-hover:rotate-12 transition-transform">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">Clean Commercial Design</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                      Say goodbye to endless banner ads, cookie walls, and bloated page weight. Yuitility serves clean layout geometry designed specifically for modern workflows.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* General FAQs */}
            <div id="faq" className="pt-20 pb-10">
              <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
                <h2 className="text-3xl font-display font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">Frequently Asked Questions</h2>
                <p className="text-base text-zinc-500 leading-relaxed">Learn how we package operations without persistent database systems.</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {generalFAQs.map((faq, idx) => (
                  <details key={idx} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-zinc-900 dark:text-zinc-100">
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-500" />
                        {faq.question}
                      </span>
                      <ChevronDown className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 pt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/50">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
      {/* Premium Footer section */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-12 w-12 object-contain" />
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 font-display tracking-tight">Yuitility</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                A premium suite of client-side developer utilities and creator tools. 
                Everything runs locally in your browser. No servers, no tracking, zero latency.
              </p>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">
                  100% LOCAL ENGINE
                </span>
                <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  ALL SYSTEMS ONLINE
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <li><button onClick={() => navigateTo(null)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Utilities</button></li>
                <li><a href="#why-choose" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Legal & Open Source</h4>
              <ul className="space-y-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                <li><a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="/tools/password-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">Password Generator</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 font-medium">
              © {new Date().getFullYear()} Yuitility. Practical tools built for the web.
            </p>
            <p className="text-xs text-zinc-400 font-medium text-center md:text-right">
              No data is collected. Privacy by design.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating toast notification bar */}
      <div
        className={`fixed bottom-6 right-6 z-50 p-3 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xl shadow-lg border border-zinc-800 dark:border-zinc-200 flex items-center gap-2.5 max-w-sm transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'}`}
      >
        <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span className="text-xs font-semibold leading-none">{toast.message}</span>
      </div>

    </div>
  );
}
