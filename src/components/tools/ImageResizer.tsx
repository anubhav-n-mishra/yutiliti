import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Share2, Download, RefreshCw, Lock, Unlock, Crop } from 'lucide-react';

interface ImageResizerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function ImageResizer({ onCopy, onShare }: ImageResizerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Image metadata
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  
  // Resize states
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    const img = new window.Image();
    img.onload = () => {
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width.toString());
      setHeight(img.height.toString());
      imageRef.current = img;
    };
    img.src = url;
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (lockAspectRatio && originalWidth && originalHeight) {
      const numVal = parseInt(val);
      if (!isNaN(numVal)) {
        const ratio = originalHeight / originalWidth;
        setHeight(Math.round(numVal * ratio).toString());
      } else {
        setHeight('');
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (lockAspectRatio && originalWidth && originalHeight) {
      const numVal = parseInt(val);
      if (!isNaN(numVal)) {
        const ratio = originalWidth / originalHeight;
        setWidth(Math.round(numVal * ratio).toString());
      } else {
        setWidth('');
      }
    }
  };

  const handleResize = async () => {
    if (!file || !imageRef.current) return;
    
    const targetW = parseInt(width);
    const targetH = parseInt(height);
    
    if (isNaN(targetW) || isNaN(targetH) || targetW <= 0 || targetH <= 0) {
      alert("Please enter valid dimensions above 0.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Failed to get canvas context");
      
      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(imageRef.current, 0, 0, targetW, targetH);

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsProcessing(false);
          alert("Resizing failed.");
          return;
        }
        
        const ext = file.name.split('.').pop() || 'png';
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + `_${targetW}x${targetH}.${ext}`;
        
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = newFileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
        setIsProcessing(false);
      }, file.type, 0.95);
    } catch (err) {
      console.error(err);
      alert("Error resizing image.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth('');
    setHeight('');
    imageRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Image Resizer</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Change image dimensions instantly in your browser.</p>
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
            onClick={() => onShare("Image Resizer", "#/image-resizer")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
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
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Click to upload or drag and drop</p>
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
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Original Image</h3>
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center min-h-[300px]">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Original preview" 
                  className="max-h-[400px] object-contain"
                />
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg text-white text-xs font-mono">
                  {originalWidth} x {originalHeight} px
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <Crop className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Dimensions</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Lock Aspect Ratio</label>
                <button 
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`p-2 rounded-lg transition-colors ${lockAspectRatio ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}
                >
                  {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    disabled={!file}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    placeholder="Width"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    disabled={!file}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    placeholder="Height"
                  />
                </div>
              </div>

              {/* Preset buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                {[25, 50, 75, 200].map(percent => (
                  <button
                    key={percent}
                    disabled={!file}
                    onClick={() => {
                      if (!originalWidth) return;
                      setLockAspectRatio(true);
                      handleWidthChange(Math.round(originalWidth * (percent / 100)).toString());
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                  >
                    {percent === 200 ? '2x' : `${percent}%`}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 mt-auto border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={handleResize}
                disabled={!file || isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isProcessing ? 'Resizing...' : 'Resize & Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
