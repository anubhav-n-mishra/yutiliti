import React, { useState, useRef } from 'react';
import { Share2, Download, RefreshCw, Type, Layout, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';

interface OgImageGeneratorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

const GRADIENTS = [
  'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600',
  'bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500',
  'bg-gradient-to-r from-emerald-400 to-cyan-400',
  'bg-gradient-to-bl from-orange-400 to-rose-400',
  'bg-slate-900'
];

export default function OgImageGenerator({ onCopy, onShare }: OgImageGeneratorProps) {
  const [title, setTitle] = useState('How to build a next-generation web application');
  const [subtitle, setSubtitle] = useState('A comprehensive guide to modern development tools and practices.');
  const [author, setAuthor] = useState('John Doe');
  const [website, setWebsite] = useState('yuitility.app');
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const ogRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!ogRef.current) return;
    setIsProcessing(true);
    
    try {
      const canvas = await html2canvas(ogRef.current, {
        useCORS: true,
        scale: 2, // Retain high quality
        width: 1200,
        height: 630
      });
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error("Failed to generate blob");
      
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `og_image_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Error generating OG Image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTitle('How to build a next-generation web application');
    setSubtitle('A comprehensive guide to modern development tools and practices.');
    setAuthor('John Doe');
    setWebsite('yuitility.app');
    setGradient(GRADIENTS[0]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">OG Image Generator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Design beautiful 1200x630 Open Graph images for social media sharing.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => onShare("OG Image Generator", "#/og-image-generator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Pane */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <Layout className="w-5 h-5 text-indigo-500" />
              Card Content
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Title</label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none h-24"
                  placeholder="Enter main title..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Subtitle</label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none h-20"
                  placeholder="Enter a brief subtitle..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Website / Brand</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5" /> Background Theme
                </label>
                <div className="flex flex-wrap gap-3">
                  {GRADIENTS.map((grad, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGradient(grad)}
                      className={`w-10 h-10 rounded-full ${grad} shadow-sm border-2 transition-transform hover:scale-110 ${
                        gradient === grad ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent'
                      }`}
                      aria-label="Select gradient"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Generating...' : 'Download Image'}
            </button>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 md:p-8 min-h-[400px] overflow-hidden">
          
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">1200 x 630 Preview</p>
          
          <div className="w-full overflow-hidden flex justify-center items-center rounded shadow-2xl border border-zinc-200 dark:border-zinc-700">
            {/* The actual 1200x630 container scaled down for preview via CSS transform */}
            <div 
              ref={ogRef}
              className={`relative overflow-hidden ${gradient} flex flex-col justify-between`}
              style={{
                width: '1200px',
                height: '630px',
                transform: 'scale(0.4)', // Approx scale to fit in most screens in preview
                transformOrigin: 'center',
                margin: '-189px -360px' // Offset the scaling box
              }}
            >
              {/* Glassmorphism Pattern Overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>

              {/* Top Brand */}
              <div className="relative z-10 p-16 flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Type className="w-10 h-10 text-zinc-900" />
                  </div>
                  <span className="text-3xl font-bold text-white tracking-wide">{website}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 px-16 pb-20 flex-grow flex flex-col justify-center">
                <h1 className="text-white font-bold tracking-tight leading-tight" style={{ fontSize: '72px', textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-white/80 font-medium mt-8 leading-normal" style={{ fontSize: '36px' }}>
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Bottom Author Section */}
              <div className="relative z-10 px-16 pb-16 flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">{author.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-2xl">{author}</p>
                  <p className="text-white/70 text-xl font-medium">Author & Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
