import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Share2, Download, RefreshCw, Wand2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

interface BackgroundRemoverProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function BackgroundRemover({ onCopy, onShare }: BackgroundRemoverProps) {
  const [file, setFile] = useState<File | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
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
    setProcessedUrl(null);
  };

  const handleRemoveBackground = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressMessage('Initializing AI models...');
    
    try {
      const blobUrl = URL.createObjectURL(file);
      
      const config = {
        publicPath: 'https://unpkg.com/@imgly/background-removal/dist/',
        progress: (key: string, current: number, total: number) => {
          if (key.includes('fetch')) {
            setProgressMessage(`Downloading AI Models... ${Math.round((current / total) * 100)}%`);
          } else if (key.includes('compute')) {
            setProgressMessage('Processing image...');
          }
          // Estimate overall progress roughly
          setProgress(Math.round((current / total) * 100));
        }
      };

      const imageBlob = await removeBackground(blobUrl, config);
      
      const newUrl = URL.createObjectURL(imageBlob);
      setProcessedUrl(newUrl);
      setProgressMessage('Complete!');
      setProgress(100);
      
    } catch (err) {
      console.error(err);
      alert("Error removing background. The image might be too large or complex.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl || !file) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = file.name.replace(/\.[^/.]+$/, "") + `_nobg.png`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setProcessedUrl(null);
    setProgress(0);
    setProgressMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Background Remover</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Remove backgrounds instantly using local AI.</p>
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
            onClick={() => onShare("Background Remover", "#/background-remover")}
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Processed 100% locally. No images are sent to any server.</p>
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
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Preview</h3>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 bg-black/50 text-white rounded uppercase backdrop-blur-sm z-10">Original</p>
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Original" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center min-h-[300px]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v10H0zm10 10h10v10H10z' fill='%23d4d4d8' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
                }}>
                  <p className="absolute top-2 left-2 text-[10px] font-bold px-2 py-1 bg-black/50 text-white rounded uppercase backdrop-blur-sm z-10">Result</p>
                  {processedUrl ? (
                    <img 
                      src={processedUrl} 
                      alt="Processed" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-400">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs">No background removed yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6 flex-grow flex flex-col justify-center">
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                <Wand2 className="relative w-12 h-12 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">AI Magic</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-[250px]">
                  Uses WebAssembly to isolate subjects from backgrounds directly in your browser.
                </p>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-zinc-500">
                  <span>{progressMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400 text-center mt-2">
                  First run requires downloading AI models (~40MB). This happens only once.
                </p>
              </div>
            )}
            
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
              {!processedUrl ? (
                <button
                  onClick={handleRemoveBackground}
                  disabled={!file || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5" />
                  )}
                  {isProcessing ? 'Processing...' : 'Remove Background'}
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download Transparent PNG
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
