import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Share2, Download, RefreshCw, Smile, Type } from 'lucide-react';
import html2canvas from 'html2canvas';

interface MemeMakerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function MemeMaker({ onCopy, onShare }: MemeMakerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [topText, setTopText] = useState<string>('TOP TEXT');
  const [bottomText, setBottomText] = useState<string>('BOTTOM TEXT');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const memeRef = useRef<HTMLDivElement>(null);

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
  };

  const handleDownload = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to get canvas context");
      
      // Draw image
      ctx.drawImage(img, 0, 0);

      // Setup text style
      const fontSize = Math.max(Math.floor(img.width / 10), 24);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(Math.floor(fontSize / 15), 2);
      ctx.textAlign = 'center';
      
      // Function to draw text with word wrap
      const drawText = (text: string, y: number, isTop: boolean) => {
        const words = text.split(' ');
        let line = '';
        let lines = [];
        const maxWidth = img.width * 0.9;
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);
        
        // Calculate starting Y based on number of lines
        let startY = y;
        if (!isTop) {
          startY = y - (lines.length - 1) * (fontSize * 1.2);
        }
        
        lines.forEach((l, i) => {
          const lineY = startY + (i * (fontSize * 1.2));
          ctx.strokeText(l, img.width / 2, lineY);
          ctx.fillText(l, img.width / 2, lineY);
        });
      };

      if (topText) drawText(topText, fontSize * 1.2, true);
      if (bottomText) drawText(bottomText, img.height - (fontSize * 0.5), false);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Failed to generate blob");
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `meme_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(blobUrl);
        setIsProcessing(false);
      }, 'image/png', 1.0);
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error generating meme.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTopText('TOP TEXT');
    setBottomText('BOTTOM TEXT');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Meme Maker</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create classic image macros with standard Impact font natively.</p>
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
            onClick={() => onShare("Meme Maker", "meme-maker")}
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
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Click to upload a base image</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Processed entirely locally.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Edit Text</h3>
                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Change Image
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Top Text</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      placeholder="TOP TEXT"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Bottom Text</label>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      placeholder="BOTTOM TEXT"
                    />
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
                {isProcessing ? 'Generating...' : 'Download Meme'}
              </button>
            </div>
          )}
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 md:p-8 min-h-[400px]">
          {!file ? (
            <div className="flex flex-col items-center justify-center text-zinc-400 space-y-4">
              <Smile className="w-16 h-16 opacity-20" />
              <p className="text-sm">Upload an image to start meming</p>
            </div>
          ) : (
            <div className="relative max-w-full overflow-hidden rounded shadow-lg" ref={memeRef}>
              <img 
                src={URL.createObjectURL(file)} 
                alt="Meme Base" 
                className="max-w-full h-auto object-contain block"
                style={{ maxHeight: '60vh' }}
              />
              <div 
                className="absolute top-4 left-0 w-full text-center px-4"
                style={{
                  fontFamily: 'Impact, sans-serif',
                  fontSize: 'clamp(2rem, 8vw, 4rem)',
                  color: 'white',
                  textTransform: 'uppercase',
                  WebkitTextStroke: '2px black',
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                  lineHeight: 1.1,
                  wordWrap: 'break-word'
                }}
              >
                {topText}
              </div>
              <div 
                className="absolute bottom-4 left-0 w-full text-center px-4"
                style={{
                  fontFamily: 'Impact, sans-serif',
                  fontSize: 'clamp(2rem, 8vw, 4rem)',
                  color: 'white',
                  textTransform: 'uppercase',
                  WebkitTextStroke: '2px black',
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                  lineHeight: 1.1,
                  wordWrap: 'break-word'
                }}
              >
                {bottomText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
