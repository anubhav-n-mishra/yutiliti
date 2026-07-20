import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, Stamp } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

interface PdfWatermarkerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfWatermarker({ onCopy, onShare }: PdfWatermarkerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [fontSize, setFontSize] = useState<number>(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleNewFile = (newFile: File) => {
    if (newFile.type !== 'application/pdf') {
      alert("Only PDF files are supported.");
      return;
    }
    setFile(newFile);
  };

  const handleWatermark = async () => {
    if (!file || !watermarkText) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (fontSize * watermarkText.length) / 4,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          color: rgb(0.8, 0.1, 0.1), // red
          opacity: opacity,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yutiliti_Watermarked_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error adding watermark. Ensure the PDF is not encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWatermarkText('CONFIDENTIAL');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">PDF Watermarker</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Stamp a custom text watermark on all pages of your PDF document.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={() => onShare("PDF Watermarker", "#/pdf-watermark")}
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
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/10'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-rose-600 dark:text-rose-400 mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload PDF to Watermark</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Processed 100% locally in your browser.</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Opacity</label>
                    <span className="text-xs font-medium text-zinc-500">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Font Size</label>
                    <span className="text-xs font-medium text-zinc-500">{fontSize}pt</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="150"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
                <Stamp className="relative w-16 h-16 text-rose-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Stamp PDF</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-[250px]">
                  Add a 45-degree angled text watermark across all pages in the PDF document.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleWatermark}
              disabled={!file || !watermarkText || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Watermarking...' : 'Stamp & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
