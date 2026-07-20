import React, { useState, useRef, useEffect, useTransition } from 'react';
import { Download, RefreshCw, Share2, UploadCloud, FileImage, Percent } from 'lucide-react';

interface ImageCompressorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

interface ImageMetadata {
  name: string;
  type: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
}

export default function ImageCompressor({ onCopy, onShare }: ImageCompressorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isCompressing, startCompressing] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP)');
      return;
    }
    setSelectedFile(file);
  };

  const compressImage = () => {
    if (!selectedFile) return;

    startCompressing(async () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Maintain aspect ratio
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Compress to JPEG or WebP
          const outputType = selectedFile.type === 'image/png' ? 'image/jpeg' : selectedFile.type;
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedUrl = URL.createObjectURL(blob);
                const originalUrl = URL.createObjectURL(selectedFile);

                setMetadata({
                  name: selectedFile.name,
                  type: outputType,
                  originalSize: selectedFile.size,
                  compressedSize: blob.size,
                  originalUrl,
                  compressedUrl,
                  width: img.width,
                  height: img.height
                });
              }
            },
            outputType,
            quality / 100
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    });
  };

  // Re-compress when quality changes
  useEffect(() => {
    if (selectedFile) {
      compressImage();
    }
  }, [selectedFile, quality]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!metadata) return;
    const a = document.createElement('a');
    a.href = metadata.compressedUrl;
    // Replace extension with .compressed.jpg / webp
    const ext = metadata.type.split('/')[1];
    const newName = metadata.name.substring(0, metadata.name.lastIndexOf('.')) + `_compressed.${ext}`;
    a.download = newName;
    a.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setMetadata(null);
    setQuality(75);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savingsPercentage = metadata
    ? Math.max(0, Math.round(((metadata.originalSize - metadata.compressedSize) / metadata.originalSize) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Image Compressor</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Shrink JPEG, WEBP, or PNG images safely and locally with instant size calculations.</p>
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
            onClick={() => onShare("Image Compressor", "#/image-compressor")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Pane */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dropzone container */}
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer bg-zinc-50/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors relative group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-zinc-400 dark:text-zinc-500 mb-4 group-hover:text-zinc-600 transition-colors" />
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Drag & Drop image here</p>
              <p className="text-xs text-zinc-400 mt-1">Supports JPEG, PNG, or WEBP up to 20MB</p>
              <button
                type="button"
                className="mt-4 px-4 py-1.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-lg shadow-sm"
              >
                Browse File
              </button>
            </div>
          ) : (
            <div className="bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-900">
                    <FileImage className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[200px] truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{formatSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>

              <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

              {/* Quality control slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Compression Level (Quality)</label>
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-50">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-800 dark:accent-zinc-100"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  <span>High Compression (Low Quality)</span>
                  <span>Low Compression (High Quality)</span>
                </div>
              </div>
            </div>
          )}

          {/* Side by side before/after previews */}
          {metadata && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">Before (Original)</p>
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  <img src={metadata.originalUrl} alt="Before" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {formatSize(metadata.originalSize)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">After (Compressed)</p>
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  <img src={metadata.compressedUrl} alt="After" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    {formatSize(metadata.compressedSize)}
                  </span>
                  {isCompressing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          {!metadata ? (
            <div className="text-center py-10 my-auto text-zinc-400">
              <UploadCloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">Please upload an image to analyze size optimization potential.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <h2 className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Compression Report</h2>

                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Space Savings</p>
                      <p className="text-sm text-zinc-500">Reduction in bytes</p>
                    </div>
                  </div>
                  <p className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">-{savingsPercentage}%</p>
                </div>

                <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg">
                    <p className="text-[10px] text-zinc-400">Original Size</p>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-1 font-mono">{formatSize(metadata.originalSize)}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg">
                    <p className="text-[10px] text-zinc-400">Optimized Size</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatSize(metadata.compressedSize)}</p>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-200/50 dark:bg-zinc-800" />

                <div className="text-xs text-zinc-500 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{metadata.width} x {metadata.height} px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300 uppercase">{metadata.type.split('/')[1]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity mt-6"
              >
                <Download className="w-3.5 h-3.5" />
                Download Optimized Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
