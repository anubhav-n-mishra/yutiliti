import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, RotateCw, RotateCcw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

interface PdfRotatorProps {
  onCopy?: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfRotator({ onCopy, onShare }: PdfRotatorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageScope, setPageScope] = useState<'all' | 'odd' | 'even' | 'custom'>('all');
  const [customRange, setCustomRange] = useState<string>('');
  const [pageCount, setPageCount] = useState<number | null>(null);
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

  const handleNewFile = async (newFile: File) => {
    if (newFile.type !== 'application/pdf' && !newFile.name.toLowerCase().endsWith('.pdf')) {
      alert("Only PDF files are supported.");
      return;
    }
    setFile(newFile);
    try {
      const buffer = await newFile.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(null);
    }
  };

  const parsePageNumbers = (str: string, max: number): Set<number> => {
    const pages = new Set<number>();
    const parts = str.split(',').map((s) => s.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lower = Math.max(1, Math.min(start, end));
          const upper = Math.min(max, Math.max(start, end));
          for (let i = lower; i <= upper; i++) pages.add(i);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num);
        }
      }
    }
    return pages;
  };

  const handleRotate = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      let targetPageIndices: Set<number> = new Set();

      if (pageScope === 'all') {
        pages.forEach((_, idx) => targetPageIndices.add(idx));
      } else if (pageScope === 'odd') {
        pages.forEach((_, idx) => {
          if ((idx + 1) % 2 === 1) targetPageIndices.add(idx);
        });
      } else if (pageScope === 'even') {
        pages.forEach((_, idx) => {
          if ((idx + 1) % 2 === 0) targetPageIndices.add(idx);
        });
      } else if (pageScope === 'custom' && customRange.trim()) {
        const parsed = parsePageNumbers(customRange, totalPages);
        parsed.forEach((pageNum) => targetPageIndices.add(pageNum - 1));
      } else {
        pages.forEach((_, idx) => targetPageIndices.add(idx));
      }

      targetPageIndices.forEach((idx) => {
        if (idx >= 0 && idx < totalPages) {
          const page = pages[idx];
          const currentRotation = page.getRotation().angle;
          const newRotation = (currentRotation + rotationAngle + 360) % 360;
          page.setRotation(degrees(newRotation));
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rotated_${file.name.replace(/\.pdf$/i, '')}_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error rotating PDF. Please ensure the document is not password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRotationAngle(90);
    setPageScope('all');
    setCustomRange('');
    setPageCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Rotate PDF Pages
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Rotate all or specific pages by 90°, 180°, or 270° clockwise or counter-clockwise — entirely in your browser.
          </p>
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
            onClick={() => onShare("Rotate PDF Pages", "pdf-rotator")}
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
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload PDF to Rotate</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Processed 100% locally. Safe for confidential legal & personal documents.
              </p>
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
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB {pageCount ? `• ${pageCount} pages` : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Rotation Options Card */}
              <div className="space-y-5 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                {/* Angle selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Rotation Direction & Angle</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: '90° Right', angle: 90, icon: RotateCw },
                      { label: '180° Flip', angle: 180, icon: RotateCw },
                      { label: '90° Left', angle: 270, icon: RotateCcw },
                      { label: '270° Right', angle: 270, icon: RotateCw },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      const isSelected = rotationAngle === item.angle && (i !== 3 || rotationAngle === 270);
                      return (
                        <button
                          key={item.label + i}
                          type="button"
                          onClick={() => setRotationAngle(item.angle)}
                          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Page scope selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pages to Rotate</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'All Pages', scope: 'all' },
                      { label: 'Odd Pages Only', scope: 'odd' },
                      { label: 'Even Pages Only', scope: 'even' },
                      { label: 'Custom Range', scope: 'custom' },
                    ].map((item) => (
                      <button
                        key={item.scope}
                        type="button"
                        onClick={() => setPageScope(item.scope as any)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          pageScope === item.scope
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {pageScope === 'custom' && (
                    <div className="pt-2">
                      <input
                        type="text"
                        value={customRange}
                        onChange={(e) => setCustomRange(e.target.value)}
                        placeholder="e.g. 1, 3, 5-8"
                        className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Specify comma-separated page numbers or ranges (e.g. 1-3, 5).</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Action Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-6">
          <div className="space-y-6">
            <div className="text-center py-6 space-y-3">
              <div className="inline-flex p-4 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl mb-2">
                <RotateCw
                  className="w-10 h-10 transition-transform duration-300"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Rotating {rotationAngle}° Clockwise
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                {pageScope === 'all'
                  ? 'All pages in your PDF will be rotated.'
                  : pageScope === 'odd'
                  ? 'Only odd numbered pages (1, 3, 5...) will be rotated.'
                  : pageScope === 'even'
                  ? 'Only even numbered pages (2, 4, 6...) will be rotated.'
                  : `Pages: ${customRange || 'Custom range specified'}`}
              </p>
            </div>

            <button
              onClick={handleRotate}
              disabled={!file || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-rose-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Rotating Document...' : 'Rotate & Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
