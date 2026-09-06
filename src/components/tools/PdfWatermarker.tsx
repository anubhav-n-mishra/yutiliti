import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, Stamp, Eye } from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

interface PdfWatermarkerProps {
  onCopy?: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Red', hex: '#dc2626' },
  { name: 'Dark Slate', hex: '#1f2937' },
  { name: 'Navy Blue', hex: '#1d4ed8' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Soft Gray', hex: '#6b7280' },
];

export default function PdfWatermarker({ onCopy, onShare }: PdfWatermarkerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkColor, setWatermarkColor] = useState<string>('#dc2626');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [fontSize, setFontSize] = useState<number>(54);
  const [rotationAngle, setRotationAngle] = useState<number>(45);
  const [position, setPosition] = useState<'center' | 'top' | 'bottom'>('center');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(isNaN(r) ? 0.8 : r, isNaN(g) ? 0.1 : g, isNaN(b) ? 0.1 : b);
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

  const handleWatermark = async () => {
    if (!file || !watermarkText) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const markColor = hexToRgb(watermarkColor);

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        let xPos = width / 2 - (fontSize * watermarkText.length) / 4.2;
        let yPos = height / 2 - fontSize / 2;

        if (position === 'top') {
          yPos = height - fontSize * 2;
        } else if (position === 'bottom') {
          yPos = fontSize * 1.5;
        }

        page.drawText(watermarkText, {
          x: Math.max(20, xPos),
          y: yPos,
          size: fontSize,
          color: markColor,
          opacity: opacity,
          rotate: degrees(rotationAngle),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Watermarked_${file.name.replace(/\.pdf$/i, '')}_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error applying watermark. Ensure the PDF is not password protected or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWatermarkText('CONFIDENTIAL');
    setWatermarkColor('#dc2626');
    setOpacity(0.3);
    setFontSize(54);
    setRotationAngle(45);
    setPosition('center');
    setPageCount(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            PDF Watermarker
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Stamp customizable text watermarks with precision color, opacity, angle, and position controls — 100% in your browser.
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
            onClick={() => onShare("PDF Watermarker", "pdf-watermark")}
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
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Processed 100% locally on your machine. Zero bytes uploaded.
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

              {/* Watermark Configuration Form */}
              <div className="space-y-5 bg-zinc-50 dark:bg-zinc-900/30 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                {/* Text input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold"
                  />
                </div>

                {/* Color Selection with Presets & Picker */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Watermark Color</label>
                    <span className="text-xs font-mono font-medium text-zinc-500 uppercase">{watermarkColor}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.hex}
                        type="button"
                        onClick={() => setWatermarkColor(p.hex)}
                        className={`w-7 h-7 rounded-full border transition-all ${
                          watermarkColor.toLowerCase() === p.hex.toLowerCase()
                            ? 'ring-2 ring-offset-2 ring-rose-500 scale-110'
                            : 'hover:scale-105 border-zinc-300 dark:border-zinc-700'
                        }`}
                        style={{ backgroundColor: p.hex }}
                        title={p.name}
                        aria-label={`Select ${p.name} color`}
                      />
                    ))}
                    <div className="relative flex items-center">
                      <input
                        type="color"
                        id="custom-watermark-color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-8 h-8 p-0 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer bg-transparent"
                        title="Custom Color"
                      />
                      <label htmlFor="custom-watermark-color" className="ml-1.5 text-xs text-zinc-500 cursor-pointer">
                        Custom
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sliders: Opacity & Font Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Opacity</label>
                      <span className="text-xs font-medium text-zinc-500">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
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
                      min="16"
                      max="120"
                      step="2"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>

                {/* Angle & Position Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Rotation Angle</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: '0° Flat', angle: 0 },
                        { label: '45° Diagonal', angle: 45 },
                        { label: '90° Vertical', angle: 90 },
                      ].map((item) => (
                        <button
                          key={item.angle}
                          type="button"
                          onClick={() => setRotationAngle(item.angle)}
                          className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                            rotationAngle === item.angle
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Position</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Top', val: 'top' },
                        { label: 'Center', val: 'center' },
                        { label: 'Bottom', val: 'bottom' },
                      ].map((pos) => (
                        <button
                          key={pos.val}
                          type="button"
                          onClick={() => setPosition(pos.val as any)}
                          className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                            position === pos.val
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 font-semibold'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Live Visual Preview Pane */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-50/70 dark:bg-zinc-900/30 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Live Watermark Preview
                </span>
              </div>
              <span className="text-xs text-zinc-400">Simulated Page</span>
            </div>

            {/* Simulated Document Preview Canvas */}
            <div className="relative w-full aspect-[1/1.35] max-h-[300px] mx-auto bg-white dark:bg-zinc-950 rounded-lg shadow-md border border-zinc-300 dark:border-zinc-700 overflow-hidden flex flex-col justify-between p-4 select-none">
              {/* Fake document skeleton lines */}
              <div className="space-y-2 opacity-25 dark:opacity-20 pointer-events-none">
                <div className="h-3 w-3/4 bg-zinc-400 rounded"></div>
                <div className="h-2 w-full bg-zinc-300 rounded"></div>
                <div className="h-2 w-5/6 bg-zinc-300 rounded"></div>
                <div className="h-2 w-4/5 bg-zinc-300 rounded"></div>
              </div>

              {/* Dynamic Watermark Stamp Overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                  position === 'top'
                    ? 'items-start pt-8'
                    : position === 'bottom'
                    ? 'items-end pb-8'
                    : 'items-center'
                }`}
              >
                <span
                  style={{
                    color: watermarkColor,
                    opacity: opacity,
                    fontSize: `${Math.min(36, Math.max(14, fontSize * 0.45))}px`,
                    transform: `rotate(-${rotationAngle}deg)`,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                  className="font-bold tracking-wider transition-all duration-150 drop-shadow-sm truncate max-w-[90%] text-center"
                >
                  {watermarkText || 'WATERMARK'}
                </span>
              </div>

              {/* Fake document footer */}
              <div className="space-y-1.5 opacity-25 dark:opacity-20 pointer-events-none pt-4">
                <div className="h-2 w-2/3 bg-zinc-300 rounded"></div>
                <div className="h-2 w-1/3 bg-zinc-300 rounded"></div>
              </div>
            </div>

            <div className="text-xs text-center text-zinc-500 dark:text-zinc-400">
              {pageCount ? `Will stamp across all ${pageCount} pages of your PDF.` : 'Upload a PDF to apply your custom watermark.'}
            </div>

            {/* Action button */}
            <button
              onClick={handleWatermark}
              disabled={!file || !watermarkText || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-rose-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Stamp className="w-5 h-5" />
              )}
              {isProcessing ? 'Watermarking PDF...' : 'Apply Watermark & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
