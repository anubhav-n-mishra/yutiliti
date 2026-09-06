import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, Scissors, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfPageRemoverProps {
  onCopy?: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfPageRemover({ onCopy, onShare }: PdfPageRemoverProps) {
  const [file, setFile] = useState<File | null>(null);
  const [pagesToDeleteInput, setPagesToDeleteInput] = useState<string>('');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
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
      const total = pdf.getPageCount();
      setPageCount(total);
      setSelectedPages(new Set());
      setPagesToDeleteInput('');
    } catch {
      setPageCount(null);
    }
  };

  const parsePagesString = (str: string, max: number): Set<number> => {
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

  const handleInputChange = (val: string) => {
    setPagesToDeleteInput(val);
    if (pageCount) {
      const parsed = parsePagesString(val, pageCount);
      setSelectedPages(parsed);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    const next = new Set(selectedPages);
    if (next.has(pageNum)) {
      next.delete(pageNum);
    } else {
      next.add(pageNum);
    }
    setSelectedPages(next);
    setPagesToDeleteInput([...next].sort((a, b) => a - b).join(', '));
  };

  const handleRemovePages = async () => {
    if (!file || !pageCount) return;

    if (selectedPages.size >= pageCount) {
      alert("You cannot delete all pages in the PDF. Keep at least one page.");
      return;
    }

    if (selectedPages.size === 0) {
      alert("Please select at least one page to delete.");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      const keepIndices: number[] = [];
      for (let i = 0; i < pageCount; i++) {
        if (!selectedPages.has(i + 1)) {
          keepIndices.push(i);
        }
      }

      const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cleaned_${file.name.replace(/\.pdf$/i, '')}_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error removing pages. Please ensure the PDF is not password protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPagesToDeleteInput('');
    setSelectedPages(new Set());
    setPageCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Remove PDF Pages
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Delete unwanted or blank pages from any PDF document and download the cleaned file — 100% locally.
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
            onClick={() => onShare("Remove PDF Pages", "pdf-page-remover")}
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
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload PDF to Remove Pages</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Processed 100% locally on your device. Zero file uploads.
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
                      {(file.size / 1024 / 1024).toFixed(2)} MB {pageCount ? `• ${pageCount} pages total` : ''}
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

              {/* Page deletion selector */}
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Pages to Delete (comma-separated or ranges)
                  </label>
                  <input
                    type="text"
                    value={pagesToDeleteInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="e.g. 2, 4-6, 9"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-mono text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <p className="text-xs text-zinc-500">
                    Click the page badges below or type page numbers to mark them for removal.
                  </p>
                </div>

                {/* Interactive Clickable Page Grid */}
                {pageCount && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs text-zinc-500">
                      <span>Click to toggle delete:</span>
                      <span>
                        Deleting <strong className="text-rose-600 font-semibold">{selectedPages.size}</strong> of {pageCount}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((pNum) => {
                        const isDeleted = selectedPages.has(pNum);
                        return (
                          <button
                            key={pNum}
                            type="button"
                            onClick={() => togglePageSelection(pNum)}
                            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                              isDeleted
                                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                            title={isDeleted ? `Page ${pNum} will be deleted` : `Page ${pNum} will be kept`}
                          >
                            {isDeleted ? `✕ ${pNum}` : pNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Summary Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-6">
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Document Summary</h3>
                  <p className="text-xs text-zinc-500">Client-side page removal</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-500">Original Pages:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{pageCount || '-'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-500">Pages to Remove:</span>
                  <span className="font-semibold text-rose-600">{selectedPages.size}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-500">Pages in New PDF:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {pageCount ? Math.max(0, pageCount - selectedPages.size) : '-'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRemovePages}
              disabled={!file || selectedPages.size === 0 || selectedPages.size >= (pageCount || 0) || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-rose-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Removing Pages...' : 'Delete Pages & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
