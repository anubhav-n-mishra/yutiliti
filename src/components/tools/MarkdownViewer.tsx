import React, { useState, useRef, useId, useMemo } from 'react';
import {
  Upload,
  Clipboard,
  Download,
  Copy,
  Check,
  Eye,
  Columns,
  Edit3,
  Trash2,
  Sparkles,
  FileText,
  Printer,
  ShieldCheck,
  BookOpen,
  Maximize2
} from 'lucide-react';

interface MarkdownViewerProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const SAMPLE_MARKDOWN = `# 📝 GitHub Flavored Markdown (GFM) Sample

Welcome to **Yuitility's In-Browser Markdown File Viewer**! This tool runs **100% locally in your browser**. Your files, pastes, and documents never touch a remote server.

> [!NOTE]
> This viewer supports GitHub alerts, GFM tables, interactive checkboxes, code fences, and client-side drag-and-drop upload.

> [!TIP]
> You can drop any \`.md\`, \`.markdown\`, or \`.txt\` file straight onto the editor!

---

## 📊 Live Tables Support

| Feature | In-Browser Execution | Server Upload Needed | Privacy Level |
| :--- | :---: | :---: | :--- |
| **Markdown Preview** | ✅ Yes | ❌ None | **100% Private (RAM only)** |
| **File Reading** | ✅ FileReader API | ❌ None | **Zero Data Leakage** |
| **HTML Export** | ✅ Instant | ❌ None | **Client-side Blob** |

---

## ⚡ Task Checklist
- [x] Read markdown file using local browser APIs
- [x] Real-time split-screen rendering
- [x] Word, line, and reading time metrics
- [ ] Upload your own \`.md\` file to preview!

---

## 💻 Code Blocks with Syntax Tags

\`\`\`typescript
interface DocumentMetrics {
  words: number;
  chars: number;
  lines: number;
  readingMinutes: number;
}

function computeStats(markdown: string): DocumentMetrics {
  const words = markdown.trim() ? markdown.trim().split(/\\s+/).length : 0;
  return {
    words,
    chars: markdown.length,
    lines: markdown.split('\\n').length,
    readingMinutes: Math.ceil(words / 200)
  };
}
\`\`\`

Here is some inline code: \`const privacy = true;\` and a strikethrough: ~~old unrendered markdown~~.

Visit [Yuitility Free Tools](https://www.yuitility.app) for over 130+ privacy-first utilities.
`;

function parseMarkdownToHtml(md: string): string {
  if (!md) return '';

  const lines = md.split(/\r?\n/);
  const out: string[] = [];

  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];

  let inUl = false;
  let inOl = false;
  let inBlockquote = false;
  let alertType: 'note' | 'tip' | 'important' | 'warning' | 'caution' | null = null;

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableAlignments: Array<'left' | 'center' | 'right'> = [];

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const formatInline = (text: string) => {
    let s = escapeHtml(text);
    // Images: ![alt](url)
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl my-3 shadow-sm border border-zinc-200 dark:border-zinc-800" />');
    // Links: [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-cyan-400 hover:underline font-medium">$1</a>');
    // Bold & italic
    s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-zinc-950 dark:text-zinc-100">$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
    s = s.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
    s = s.replace(/__([^_]+)__/g, '<strong class="font-bold text-zinc-950 dark:text-zinc-100">$1</strong>');
    s = s.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');
    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 text-blue-700 dark:text-cyan-300 px-1.5 py-0.5 rounded text-[13px] font-mono border border-zinc-200 dark:border-zinc-700">$1</code>');
    // Strikethrough
    s = s.replace(/~~([^~]+)~~/g, '<del class="line-through text-zinc-400">$1</del>');
    return s;
  };

  const closeLists = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      out.push('</div></blockquote>');
      inBlockquote = false;
      alertType = null;
    }
  };

  const closeTable = () => {
    if (inTable) {
      out.push('</tbody></table></div>');
      inTable = false;
      tableHeaders = [];
      tableAlignments = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        const langClass = codeBlockLang ? ` language-${escapeHtml(codeBlockLang)}` : '';
        const codeText = escapeHtml(codeBlockContent.join('\n'));
        out.push(
          `<div class="relative group my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-100"><div class="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400 font-mono"><span>${codeBlockLang || 'code'}</span></div><pre class="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed"><code class="${langClass}">${codeText}</code></pre></div>`
        );
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockContent = [];
      } else {
        closeLists();
        closeBlockquote();
        closeTable();
        inCodeBlock = true;
        codeBlockLang = line.trim().replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      closeLists();
      closeBlockquote();
      closeTable();
      continue;
    }

    // Table Row Detection: starts and ends with |
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeLists();
      closeBlockquote();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if next line or current line is table delimiter: | --- | :---: |
      const isDelimiter = cells.every((c) => /^:?-+:?$/.test(c));

      if (isDelimiter && tableHeaders.length > 0) {
        tableAlignments = cells.map((c) => {
          if (c.startsWith(':') && c.endsWith(':')) return 'center';
          if (c.endsWith(':')) return 'right';
          return 'left';
        });
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
        out.push('<div class="my-4 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"><table class="w-full text-left border-collapse text-sm">');
        out.push('<thead class="bg-zinc-100/80 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold border-b border-zinc-200 dark:border-zinc-800"><tr>');
        cells.forEach((headerText) => {
          out.push(`<th class="p-3 font-semibold">${formatInline(headerText)}</th>`);
        });
        out.push('</tr></thead><tbody class="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">');
        continue;
      }

      // Standard table row
      out.push('<tr class="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">');
      cells.forEach((cellText, idx) => {
        const align = tableAlignments[idx] || 'left';
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
        out.push(`<td class="p-3 text-zinc-700 dark:text-zinc-300 ${alignClass}">${formatInline(cellText)}</td>`);
      });
      out.push('</tr>');
      continue;
    } else {
      closeTable();
    }

    // GitHub Alerts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const alertMatch = line.trim().match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (alertMatch) {
      closeLists();
      closeBlockquote();
      const type = alertMatch[1].toLowerCase() as 'note' | 'tip' | 'important' | 'warning' | 'caution';
      alertType = type;
      inBlockquote = true;

      const styles = {
        note: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/25 text-blue-900 dark:text-blue-200',
        tip: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200',
        important: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/25 text-purple-900 dark:text-purple-200',
        warning: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/25 text-amber-900 dark:text-amber-200',
        caution: 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/25 text-rose-900 dark:text-rose-200',
      };

      out.push(
        `<blockquote class="my-4 rounded-xl border-l-4 p-4 shadow-sm ${styles[type]}"><div class="font-bold text-xs uppercase tracking-wider mb-1">${type}</div><div class="text-sm leading-relaxed">`
      );
      continue;
    }

    // Standard Blockquote
    if (line.trim().startsWith('>')) {
      closeLists();
      const content = line.trim().replace(/^>\s*/, '');
      if (!inBlockquote) {
        out.push(
          '<blockquote class="my-4 rounded-r-xl border-l-4 border-blue-600 dark:border-cyan-500 bg-zinc-50 dark:bg-zinc-900/60 p-4 italic text-zinc-700 dark:text-zinc-300 shadow-sm"><div class="text-sm leading-relaxed">'
        );
        inBlockquote = true;
      }
      out.push(`<p class="my-1">${formatInline(content)}</p>`);
      continue;
    } else {
      closeBlockquote();
    }

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      closeLists();
      const level = hMatch[1].length;
      const text = formatInline(hMatch[2]);
      const classes: Record<number, string> = {
        1: 'text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 dark:text-zinc-50 mt-7 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800 tracking-tight',
        2: 'text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2.5 pb-1 border-b border-zinc-100 dark:border-zinc-800/60 tracking-tight',
        3: 'text-lg sm:text-xl font-display font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-2',
        4: 'text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-1.5',
        5: 'text-sm sm:text-base font-medium text-zinc-700 dark:text-zinc-300 mt-3 mb-1',
        6: 'text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-2 mb-1',
      };
      out.push(`<h${level} class="${classes[level] || ''}">${text}</h${level}>`);
      continue;
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      closeLists();
      out.push('<hr class="my-6 border-zinc-200 dark:border-zinc-800" />');
      continue;
    }

    // Interactive Checklist item (- [ ] or - [x])
    const checkMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (checkMatch) {
      if (!inUl) {
        closeLists();
        out.push('<ul class="my-3 space-y-1.5 list-none pl-1">');
        inUl = true;
      }
      const isChecked = checkMatch[1].toLowerCase() === 'x';
      out.push(
        `<li class="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300"><input type="checkbox" disabled ${
          isChecked ? 'checked' : ''
        } class="rounded border-zinc-300 text-blue-600 accent-blue-600 h-4 w-4" /> <span>${formatInline(checkMatch[2])}</span></li>`
      );
      continue;
    }

    // Unordered List (- or *)
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inUl) {
        closeLists();
        out.push('<ul class="list-disc list-outside my-3 pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">');
        inUl = true;
      }
      out.push(`<li>${formatInline(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered List (1. 2.)
    const olMatch = line.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (!inOl) {
        closeLists();
        out.push('<ol class="list-decimal list-outside my-3 pl-5 space-y-1 text-sm text-zinc-700 dark:text-zinc-300">');
        inOl = true;
      }
      out.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    // Standard Paragraph
    closeLists();
    out.push(`<p class="my-2.5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">${formatInline(line)}</p>`);
  }

  closeLists();
  closeBlockquote();
  closeTable();

  return out.join('\n');
}

export default function MarkdownViewer({ onCopy, onShare }: MarkdownViewerProps) {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [copied, setCopied] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('sample.md');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Metrics computation
  const stats = useMemo(() => {
    const trimmed = markdown.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = markdown.length;
    const charsNoSpaces = markdown.replace(/\s/g, '').length;
    const lines = markdown ? markdown.split(/\r?\n/).length : 0;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));
    const kb = (new Blob([markdown]).size / 1024).toFixed(1);

    return { words, chars, charsNoSpaces, lines, readingMinutes, kb };
  }, [markdown]);

  const htmlOutput = useMemo(() => parseMarkdownToHtml(markdown), [markdown]);

  // Handle local file upload
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (typeof content === 'string') {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Clipboard paste support
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMarkdown(text);
        setFileName('clipboard.md');
      }
    } catch {
      alert('Clipboard access denied or unavailable in this browser.');
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    if (onCopy) onCopy(markdown);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    if (onCopy) onCopy(htmlOutput);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = (format: 'md' | 'html') => {
    const text = format === 'html' ? htmlOutput : markdown;
    const base = fileName.replace(/\.[^/.]+$/, '') || 'document';
    const blob = new Blob([text], {
      type: format === 'html' ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${base}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* File Upload & Paste Bar */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {fileName}
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  {stats.kb} KB
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Drop your <code className="font-mono text-[11px]">.md</code> file here, or click to upload. 100% computed in browser memory.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              accept=".md,.markdown,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" /> Upload .md
            </button>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition active:scale-95"
            >
              <Clipboard className="w-3.5 h-3.5" /> Paste Clipboard
            </button>
            <button
              type="button"
              onClick={() => {
                setMarkdown(SAMPLE_MARKDOWN);
                setFileName('sample.md');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition"
              title="Load full GFM markdown demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sample
            </button>
            <button
              type="button"
              onClick={() => {
                setMarkdown('');
                setFileName('untitled.md');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="Clear editor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bar & View Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-100/70 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 text-xs">
        {/* Document Stats */}
        <div className="flex flex-wrap items-center gap-4 text-zinc-600 dark:text-zinc-400 font-mono">
          <span>
            <strong className="text-zinc-900 dark:text-zinc-100">{stats.words}</strong> words
          </span>
          <span>
            <strong className="text-zinc-900 dark:text-zinc-100">{stats.chars}</strong> chars
          </span>
          <span>
            <strong className="text-zinc-900 dark:text-zinc-100">{stats.lines}</strong> lines
          </span>
          <span className="font-sans">
            ⏱ ~{stats.readingMinutes} min read
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              viewMode === 'split'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Split
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              viewMode === 'preview'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              viewMode === 'editor'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editor Only
          </button>
        </div>
      </div>

      {/* Main Workspace: Split or Single View */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <label htmlFor={inputId} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Markdown Input
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                  title="Copy raw markdown"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy MD'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('md')}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                  title="Download .md file"
                >
                  <Download className="w-3 h-3" /> .md
                </button>
              </div>
            </div>
            <textarea
              id={inputId}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste or write Markdown content here..."
              rows={22}
              className="w-full h-full min-h-[500px] p-4 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 font-mono text-xs sm:text-sm resize-none focus:outline-none"
            />
          </div>
        )}

        {/* Rendered Live Preview Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <span className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Live HTML Preview
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                  title="Copy rendered HTML"
                >
                  <Copy className="w-3 h-3" /> Copy HTML
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('html')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                  title="Download HTML"
                >
                  <Download className="w-3 h-3" /> .html
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg transition"
                  title="Print or export as PDF"
                >
                  <Printer className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 min-h-[500px] max-h-[800px] overflow-y-auto">
              <div
                className="prose prose-zinc dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Privacy & Feature Footer Callout */}
      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30 flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-900 dark:text-zinc-200 font-semibold block mb-0.5">
            100% In-Browser Privacy &amp; Zero Server Uploads
          </strong>
          When you upload or paste markdown files, the contents are parsed in RAM using HTML5 FileReader and client-side JavaScript. No document content, filenames, or metrics are ever sent across the network.
        </div>
      </div>
    </div>
  );
}
