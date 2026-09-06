import React, { useState, useRef } from 'react';
import { UploadCloud, File, Trash2, Share2, Download, RefreshCw, FileEdit } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfMetadataProps {
  onCopy: (text: string) => void;
  onShare: (title: string, path: string) => void;
}

export default function PdfMetadata({ onCopy, onShare }: PdfMetadataProps) {
  const [file, setFile] = useState<File | null>(null);
  
  // Metadata fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [creator, setCreator] = useState('');
  const [producer, setProducer] = useState('');
  const [keywords, setKeywords] = useState('');

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
    if (newFile.type !== 'application/pdf') {
      alert("Only PDF files are supported.");
      return;
    }
    
    setFile(newFile);
    try {
      const arrayBuffer = await newFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      setTitle(pdfDoc.getTitle() || '');
      setAuthor(pdfDoc.getAuthor() || '');
      setSubject(pdfDoc.getSubject() || '');
      setCreator(pdfDoc.getCreator() || '');
      setProducer(pdfDoc.getProducer() || '');
      setKeywords(pdfDoc.getKeywords() || '');

    } catch (err) {
      console.error(err);
      alert("Could not read PDF metadata.");
    }
  };

  const handleSave = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      pdfDoc.setTitle(title);
      pdfDoc.setAuthor(author);
      pdfDoc.setSubject(subject);
      pdfDoc.setCreator(creator);
      pdfDoc.setProducer(producer);
      pdfDoc.setKeywords(keywords.split(',').map(k => k.trim()));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yuitility_Metadata_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error saving PDF file. It might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTitle('');
    setAuthor('');
    setSubject('');
    setCreator('');
    setProducer('');
    setKeywords('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">PDF Metadata Editor</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View and modify hidden properties of your PDF documents.</p>
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
            onClick={() => onShare("PDF Metadata Editor", "pdf-metadata")}
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
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <div className="p-4 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 rounded-2xl text-purple-600 dark:text-purple-400 mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Upload PDF to Inspect</p>
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
                  <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Creator</label>
                    <input type="text" value={creator} onChange={(e) => setCreator(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Producer</label>
                    <input type="text" value={producer} onChange={(e) => setProducer(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Keywords</label>
                  <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Comma separated..." className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm outline-none focus:border-purple-500" />
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
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <FileEdit className="relative w-16 h-16 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Edit Metadata</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-[250px]">
                  Update hidden properties to organize or anonymize your PDF documents securely.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!file || isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl shadow-lg shadow-zinc-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isProcessing ? 'Saving...' : 'Save & Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
