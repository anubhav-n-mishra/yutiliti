import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Share2, Download, RefreshCw, FileImage } from 'lucide-react';

interface FormatConverterProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function FormatConverter({ onCopy, onShare }: FormatConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<string>('image/webp');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
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
      
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsProcessing(false);
          alert("Conversion failed.");
          return;
        }
        
        const ext = targetFormat.split('/')[1];
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + `.${ext}`;
        
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = newFileName;
        a.click();
        URL.revokeObjectURL(blobUrl);
        setIsProcessing(false);
      }, targetFormat, 0.92);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error converting image.");
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Format Converter</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Instantly convert images to JPG, PNG, or WEBP.</p>
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
            onClick={() => onShare("Format Converter", "#/format-converter")}
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Any image format supported by your browser.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Selected Image</h3>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <FileImage className="relative w-12 h-12 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Conversion Target</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-[250px]">
                  Select the format you want to export your image to.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Target Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              >
                <option value="image/webp">WEBP (Best compression)</option>
                <option value="image/png">PNG (Lossless, Transparency)</option>
                <option value="image/jpeg">JPG (Standard)</option>
              </select>
            </div>
            
            <button
              onClick={handleConvert}
              disabled={!file || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Converting...' : 'Convert & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
