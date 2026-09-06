import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, Share2, Download, RefreshCw, LayoutDashboard, Grid3X3, Columns, Rows } from 'lucide-react';
import html2canvas from 'html2canvas';

interface PhotoCollageMakerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

type LayoutType = 'grid' | 'row' | 'column' | 'masonry';

export default function PhotoCollageMaker({ onCopy, onShare }: PhotoCollageMakerProps) {
  const [images, setImages] = useState<{ id: string; url: string; file: File }[]>([]);
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [padding, setPadding] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);

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
      handleNewFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleNewFiles(Array.from(e.target.files));
    }
  };

  const handleNewFiles = (files: File[]) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Please upload image files only.');
      return;
    }
    
    if (images.length + validFiles.length > 20) {
      alert('You can only add up to 20 images max.');
      return;
    }

    const newImages = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleDownload = async () => {
    if (!collageRef.current || images.length === 0) return;
    setIsProcessing(true);
    
    try {
      const canvas = await html2canvas(collageRef.current, {
        useCORS: true,
        backgroundColor: bgColor,
        scale: 2 // High quality export
      });
      
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (!blob) throw new Error("Failed to generate blob");
      
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `collage_${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Error generating collage.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getGridClass = () => {
    const count = images.length;
    if (layout === 'row') return 'grid-flow-col auto-cols-fr';
    if (layout === 'column') return 'grid-flow-row auto-rows-fr';
    
    // Default Grid logic based on count
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2 md:grid-cols-3';
    if (count === 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (count <= 8) return 'grid-cols-2 md:grid-cols-4';
    return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">Photo Collage Maker</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Combine up to 20 photos into a beautiful layout instantly.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear All
          </button>
          <button
            onClick={() => onShare("Photo Collage Maker", "photo-collage-maker")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Pane */}
        <div className="lg:col-span-4 space-y-6">
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <UploadCloud className="w-6 h-6 text-indigo-500 mb-2" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Add More Photos</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{images.length}/20 images added</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          <div className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6 space-y-6">
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Layout Style</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setLayout('grid')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${layout === 'grid' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-300 text-zinc-500'}`}
                >
                  <Grid3X3 className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Grid</span>
                </button>
                <button
                  onClick={() => setLayout('row')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${layout === 'row' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-300 text-zinc-500'}`}
                >
                  <Columns className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Row</span>
                </button>
                <button
                  onClick={() => setLayout('column')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${layout === 'column' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-300 text-zinc-500'}`}
                >
                  <Rows className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Column</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Padding (Spacing)</label>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{padding}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                  />
                  <input 
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isProcessing || images.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Generating...' : 'Download Collage'}
            </button>
          </div>
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-8 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[500px] overflow-hidden relative">
          
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-zinc-400 space-y-4">
              <LayoutDashboard className="w-16 h-16 opacity-20" />
              <p className="text-sm">Add some images to start building your collage</p>
            </div>
          ) : (
            <div className="w-full h-full max-h-[70vh] overflow-y-auto overflow-x-hidden flex items-center justify-center custom-scrollbar">
              <div 
                ref={collageRef}
                className={`w-full h-auto grid ${getGridClass()} transition-all`}
                style={{ 
                  gap: `${padding}px`,
                  backgroundColor: bgColor,
                  padding: `${padding}px`
                }}
              >
                {images.map(img => (
                  <div key={img.id} className="relative group overflow-hidden rounded flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                    <img 
                      src={img.url} 
                      alt="collage item" 
                      className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
                      style={{ display: 'block' }} // important for html2canvas to not render weird gaps
                    />
                    
                    {/* Delete button (hidden from html2canvas automatically because we only hover) */}
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10"
                      data-html2canvas-ignore="true" // Ensure this button is never in the exported image
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
