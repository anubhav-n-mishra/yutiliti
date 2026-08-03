import React, { useState, useRef } from 'react';
import { UploadCloud, FileArchive, Trash2, Share2, Download, RefreshCw, FileText, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import JSZip from 'jszip';

interface ZipExtractorProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

interface ZipEntry {
  name: string;
  size: number;
  dir: boolean;
  file: JSZip.JSZipObject;
}

export default function ZipExtractor({ onCopy, onShare }: ZipExtractorProps) {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [entries, setEntries] = useState<ZipEntry[]>([]);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processZip(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processZip(e.target.files[0]);
    }
  };

  const processZip = async (f: File) => {
    if (f.type !== 'application/zip' && f.type !== 'application/x-zip-compressed' && !f.name.endsWith('.zip')) {
      alert("Please upload a valid ZIP archive.");
      return;
    }

    const MAX_SIZE_MB = 300;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`File is too large! Please upload a ZIP file smaller than ${MAX_SIZE_MB}MB to prevent browser crashes.`);
      return;
    }
    
    setIsProcessing(true);
    setZipFile(f);
    
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(f);
      
      const fileEntries: ZipEntry[] = [];
      contents.forEach((relativePath, zipEntry) => {
        // Skip hidden macOS files like __MACOSX and .DS_Store if desired, but we'll list them for completeness
        if (!zipEntry.dir) {
          fileEntries.push({
            name: relativePath,
            size: (zipEntry as any)._data?.uncompressedSize || 0, // Approx size
            dir: zipEntry.dir,
            file: zipEntry
          });
        }
      });
      
      setEntries(fileEntries);
    } catch (err) {
      console.error(err);
      alert("Error reading ZIP file. It might be corrupted or encrypted.");
      setZipFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = async (entry: ZipEntry) => {
    try {
      const blob = await entry.file.async('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Extract just the filename from the path
      a.download = entry.name.split('/').pop() || 'extracted_file';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error extracting file.");
    }
  };

  const downloadAll = async () => {
    // Creating a multi-download is tricky in browser, usually we just prompt users to extract manually,
    // but we can trigger multiple downloads sequentially (might be blocked by popup blocker).
    alert("For security reasons, browsers limit multiple simultaneous downloads. Please click 'Extract' on the specific files you need.");
  };

  const handleReset = () => {
    setZipFile(null);
    setEntries([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) return <ImageIcon className="w-5 h-5 text-emerald-500" />;
    if (['txt', 'md', 'json', 'csv', 'js', 'ts', 'html', 'css'].includes(ext || '')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <FileIcon className="w-5 h-5 text-zinc-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">ZIP Extractor</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Open ZIP files instantly in your browser without desktop software.</p>
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
            onClick={() => onShare("ZIP Extractor", "#/zip-extractor")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {!zipFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
            }`}
          >
            <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Click to upload or drag and drop a ZIP</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">All extraction happens securely in your browser memory.</p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-500 mt-3 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/20">
              Warning: Max file size: 300MB. Very large ZIPs may crash the browser.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".zip,application/zip,application/x-zip-compressed"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Archive Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  <FileArchive className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{zipFile.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {(zipFile.size / 1024 / 1024).toFixed(2)} MB • {entries.length} files
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-3">
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Download Info
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Archive Contents</h3>
              </div>
              
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 max-h-[500px] overflow-y-auto">
                {isProcessing ? (
                  <div className="p-12 flex flex-col items-center justify-center text-zinc-500">
                    <RefreshCw className="w-6 h-6 animate-spin mb-4" />
                    <p>Reading archive contents...</p>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    No files found in this archive.
                  </div>
                ) : (
                  entries.map((entry, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <div className="flex items-center gap-3 truncate">
                        {getFileIcon(entry.name)}
                        <div className="truncate">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate" title={entry.name}>
                            {entry.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pl-8 sm:pl-0">
                        <span className="text-xs text-zinc-500 font-mono">
                          {entry.size > 0 ? (entry.size / 1024).toFixed(1) + ' KB' : 'Unknown'}
                        </span>
                        <button
                          onClick={() => downloadFile(entry)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-md transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Extract
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
