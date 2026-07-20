import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, Share2, Plus, Download, RefreshCw, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfMergerProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfMerger({ onCopy, onShare }: PdfMergerProps) {
  const [files, setFiles] = useState<File[]>([]);
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
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter((f) => f.type === 'application/pdf');
    if (pdfFiles.length < newFiles.length) {
      alert("Only PDF files are supported.");
    }
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === files.length - 1)
    ) return;
    
    setFiles((prev) => {
      const newFiles = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yutiliti_Merged_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error merging PDF files. Some files might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">PDF Merger</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Combine multiple PDF documents effortlessly and securely.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            title="Clear all files"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={() => onShare("PDF Merger", "#/pdf-merger")}
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
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-blue-600 dark:text-blue-400 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Click to upload or drag and drop</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">Only PDF files are supported. Processed entirely locally.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              multiple
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Files to Merge ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{file.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === files.length - 1}
                        className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Output Dashboard Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <Layers className="relative w-16 h-16 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Merge PDFs Instantly</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-[250px]">
                  Combine multiple documents exactly in the order you specify. 100% private.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Merging...' : 'Merge & Download'}
            </button>

            {files.length > 0 && files.length < 2 && (
              <p className="text-xs text-center text-amber-600 dark:text-amber-400 font-medium">
                Please add at least 2 files to merge.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
