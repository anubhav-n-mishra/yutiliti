import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Share2, Download, RefreshCw, Crop, LayoutTemplate } from 'lucide-react';

interface SocialMediaResizerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

const PLATFORMS = {
  Instagram: [
    { name: 'Square Post', width: 1080, height: 1080 },
    { name: 'Portrait Post', width: 1080, height: 1350 },
    { name: 'Story / Reel', width: 1080, height: 1920 }
  ],
  X_Twitter: [
    { name: 'In-Stream Photo', width: 1600, height: 900 },
    { name: 'Header Image', width: 1500, height: 500 }
  ],
  Facebook: [
    { name: 'Shared Image', width: 1200, height: 630 },
    { name: 'Cover Photo', width: 820, height: 312 },
    { name: 'Story', width: 1080, height: 1920 }
  ],
  LinkedIn: [
    { name: 'Post Image', width: 1200, height: 627 },
    { name: 'Cover Photo', width: 1128, height: 191 }
  ],
  YouTube: [
    { name: 'Thumbnail', width: 1280, height: 720 },
    { name: 'Channel Cover', width: 2560, height: 1440 }
  ]
};

type PlatformKey = keyof typeof PLATFORMS;

export default function SocialMediaResizer({ onCopy, onShare }: SocialMediaResizerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('Instagram');
  const [activeFormat, setActiveFormat] = useState(PLATFORMS['Instagram'][0]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
      alert('Please upload an image file');
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

  const handleResize = () => {
    if (!file || !imageRef.current) return;
    setIsProcessing(true);
    
    try {
      const img = imageRef.current;
      const targetW = activeFormat.width;
      const targetH = activeFormat.height;
      
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context missing");
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Calculate crop to cover (center crop)
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;
      
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
      
      if (imgRatio > targetRatio) {
        // Image is wider than target ratio
        sWidth = img.height * targetRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        // Image is taller than target ratio
        sHeight = img.width / targetRatio;
        sy = (img.height - sHeight) / 2;
      }
      
      // Fill background (if transparency exists)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);
      
      // Draw centered/cropped
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
      
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed generating blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const prefix = activePlatform.toLowerCase().replace('_', '-');
        const formatName = activeFormat.name.toLowerCase().replace(/[\s/]+/g, '-');
        a.download = `${prefix}-${formatName}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }, 'image/png', 1.0);
      
    } catch (err) {
      console.error(err);
      alert("Error resizing image.");
      setIsProcessing(false);
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
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Social Media Resizer</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Perfectly crop and resize images for any platform instantly.</p>
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
            onClick={() => onShare("Social Media Resizer", "social-media-resizer")}
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
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Upload a photo to crop</p>
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
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Original Image</h3>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center min-h-[400px]">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Original" 
                  className="max-h-[400px] object-contain shadow-md"
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
                <LayoutTemplate className="relative w-12 h-12 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Select Platform Format</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  Images will be center-cropped to fit perfectly.
                </p>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              
              {/* Platform Tabs */}
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PLATFORMS) as PlatformKey[]).map(platform => (
                  <button
                    key={platform}
                    onClick={() => {
                      setActivePlatform(platform);
                      setActiveFormat(PLATFORMS[platform][0]);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                      activePlatform === platform 
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                        : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {platform.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Format Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLATFORMS[activePlatform].map((format, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFormat(format)}
                    className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${
                      activeFormat.name === format.name 
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' 
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <span className={`font-semibold ${activeFormat.name === format.name ? 'text-indigo-700 dark:text-indigo-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                      {format.name}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                      {format.width} x {format.height} px
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-8 mt-auto border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleResize}
                disabled={!file || isProcessing}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <Crop className="w-6 h-6" />
                )}
                {isProcessing ? 'Cropping...' : `Download for ${activePlatform.replace('_', ' ')}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
