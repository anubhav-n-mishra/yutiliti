import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, Hash, Eye } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface PdfPageNumbererProps {
  onCopy?: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfPageNumberer({ onCopy, onShare }: PdfPageNumbererProps) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'page_x_of_y' | 'number_only' | 'page_x' | 'dash'>('page_x_of_y');
  const [position, setPosition] = useState<'bottom_center' | 'bottom_right' | 'bottom_left' | 'top_right' | 'top_center'>('bottom_center');
  const [fontSize, setFontSize] = useState<number>(10);
  const [startFrom, setStartFrom] = useState<number>(1);
  const [skipFirstPage, setSkipFirstPage] = useState<boolean>(false);
  const [fontColor, setFontColor] = useState<string>('#374151');
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(isNaN(r) ? 0.2 : r, isNaN(g) ? 0.2 : g, isNaN(b) ? 0.2 : b);
  };

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

  const getNumberString = (currentNum: number, total: number): string => {
    switch (format) {
      case 'page_x_of_y':
        return `Page ${currentNum} of ${total}`;
      case 'number_only':
        return `${currentNum}`;
      case 'page_x':
        return `Page ${currentNum}`;
      case 'dash':
        return `- ${currentNum} -`;
      default:
        return `${currentNum}`;
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;
      const color = hexToRgb(fontColor);

      let currentDisplayNum = startFrom;

      for (let i = 0; i < totalPages; i++) {
        if (i === 0 && skipFirstPage) {
          continue;
        }

        const page = pages[i];
        const { width, height } = page.getSize();
        const text = getNumberString(currentDisplayNum, totalPages);
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = width / 2 - textWidth / 2;
        let y = 30;

        switch (position) {
          case 'bottom_center':
            x = width / 2 - textWidth / 2;
            y = 30;
            break;
          case 'bottom_right':
            x = width - textWidth - 40;
            y = 30;
            break;
          case 'bottom_left':
            x = 40;
            y = 30;
            break;
          case 'top_right':
            x = width - textWidth - 40;
            y = height - 35;
            break;
          case 'top_center':
            x = width / 2 - textWidth / 2;
            y = height - 35;
            break;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color,
        });

        currentDisplayNum++;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Numbered_${file.name.replace(/\.pdf$/i, '')}_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error adding page numbers. Ensure the PDF is not password protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFormat('page_x_of_y');
    setPosition('bottom_center');
    setFontSize(10);
    setStartFrom(1);
    setSkipFirstPage(false);
    setFontColor('#374151');
    setPageCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Add Page Numbers to PDF
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Insert customizable page numbers, headers, and footers across your PDF documents — 100% locally in your browser.
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
            onClick={() => onShare("Add Page Numbers to PDF", "pdf-page-numbers")}
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
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload PDF to Add Numbers</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Processed 100% locally. Safe for academic papers & financial reports.
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

              {/* Numbering Controls */}
              <div className="space-y-5 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                {/* Number Format */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Number Format</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'Page 1 of N', val: 'page_x_of_y' },
                      { label: '1, 2, 3...', val: 'number_only' },
                      { label: 'Page 1', val: 'page_x' },
                      { label: '- 1 -', val: 'dash' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setFormat(item.val as any)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                          format === item.val
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Placement Position */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Position on Page</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Bottom Center', val: 'bottom_center' },
                      { label: 'Bottom Right', val: 'bottom_right' },
                      { label: 'Bottom Left', val: 'bottom_left' },
                      { label: 'Top Center', val: 'top_center' },
                      { label: 'Top Right', val: 'top_right' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setPosition(item.val as any)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          position === item.val
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options: Starting Number & Skip Cover */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Numbering At</label>
                    <input
                      type="number"
                      min="1"
                      value={startFrom}
                      onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={skipFirstPage}
                        onChange={(e) => setSkipFirstPage(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Skip First Page (Cover)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Preview Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Page Number Preview
                </span>
              </div>
              <span className="text-xs text-zinc-400">Position Mock</span>
            </div>

            {/* Simulated Page Box */}
            <div className="relative w-full aspect-[1/1.3] max-h-[260px] mx-auto bg-white dark:bg-zinc-950 rounded-lg shadow-md border border-zinc-300 dark:border-zinc-700 overflow-hidden flex flex-col justify-between p-4 select-none">
              <div
                className={`text-xs font-mono font-semibold transition-all ${
                  position === 'top_center'
                    ? 'text-center'
                    : position === 'top_right'
                    ? 'text-right'
                    : 'invisible'
                }`}
                style={{ color: fontColor }}
              >
                {getNumberString(startFrom, pageCount || 10)}
              </div>

              <div className="space-y-2 opacity-25 dark:opacity-20 pointer-events-none my-auto">
                <div className="h-2 w-3/4 bg-zinc-400 rounded"></div>
                <div className="h-2 w-full bg-zinc-300 rounded"></div>
                <div className="h-2 w-5/6 bg-zinc-300 rounded"></div>
              </div>

              <div
                className={`text-xs font-mono font-semibold transition-all ${
                  position === 'bottom_center'
                    ? 'text-center'
                    : position === 'bottom_right'
                    ? 'text-right'
                    : position === 'bottom_left'
                    ? 'text-left'
                    : 'invisible'
                }`}
                style={{ color: fontColor }}
              >
                {getNumberString(startFrom, pageCount || 10)}
              </div>
            </div>

            <button
              onClick={handleAddPageNumbers}
              disabled={!file || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-rose-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Numbering Document...' : 'Add Numbers & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
