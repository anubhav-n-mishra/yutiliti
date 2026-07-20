import React, { useState, useRef } from 'react';
import { UploadCloud, Box, Trash2, Share2, Download, RefreshCw, FileArchive, CheckCircle2 } from 'lucide-react';
import JSZip from 'jszip';

interface FaviconGeneratorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function FaviconGenerator({ onCopy, onShare }: FaviconGeneratorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const sizes = [16, 32, 48, 192, 512];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleNewFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleNewFile(e.target.files[0]);
    }
  };

  const handleNewFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      alert('Please upload an image file (PNG/JPG/WEBP)');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new window.Image();
    img.onload = () => {
      imageRef.current = img;
    };
    img.src = url;
  };

  const generateFavicons = async () => {
    if (!file || !imageRef.current) return;
    setIsProcessing(true);
    setProgress(10);
    
    try {
      const zip = new JSZip();
      const img = imageRef.current;
      
      const resizeImage = (size: number): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error("Canvas context missing"));
            return;
          }
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw image cropped to square
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Blob failed"));
          }, 'image/png');
        });
      };

      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const blob = await resizeImage(size);
        zip.file(`favicon-${size}x${size}.png`, blob);
        setProgress(10 + Math.floor(((i + 1) / sizes.length) * 60));
      }

      // Generate web app manifest
      const manifest = {
        name: "My App",
        short_name: "App",
        icons: [
          {
            src: "/favicon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/favicon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));
      
      // Also provide a basic HTML snippet
      const htmlSnippet = `
<!-- Place these in the <head> of your HTML -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="192x192" href="/favicon-192x192.png">
<link rel="manifest" href="/site.webmanifest">
      `.trim();
      
      zip.file('instructions.html', htmlSnippet);

      setProgress(90);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `favicons.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      setProgress(100);
      
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Error generating favicons.");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    imageRef.current = null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Favicon Generator</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Generate a complete set of web favicons and a manifest in seconds.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={() => onShare("Favicon Generator", "#/favicon-generator")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Upload a square image</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center max-w-sm">
                For best results, upload a PNG with a transparent background. At least 512x512 is recommended.
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Selected Master Image</h3>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-8 min-h-[300px]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v10H0zm10 10h10v10H10z' fill='%23d4d4d8' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Original" 
                  className="max-w-[200px] max-h-[200px] object-contain shadow-lg rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6 flex-grow flex flex-col">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <Box className="relative w-12 h-12 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Generate Package</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  This tool will automatically create a ZIP containing:
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                favicon-16x16.png
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                favicon-32x32.png
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Apple Touch Icon (192x192)
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                site.webmanifest & HTML integration code
              </div>
            </div>
            
            <div className="pt-8 mt-auto">
              {isProcessing && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-semibold text-zinc-500">
                    <span>Generating assets...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={generateFavicons}
                disabled={!file || isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <FileArchive className="w-6 h-6" />
                )}
                {isProcessing ? 'Packaging...' : 'Generate ZIP Package'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
