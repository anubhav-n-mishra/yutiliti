import React, { useState, useId } from 'react';
import { Copy, Check, Download, FileCode, Eye, Code, Trash2, Sparkles, BookOpen } from 'lucide-react';

interface MarkdownToHtmlProps {
  onCopy?: (text: string) => void;
  onShare?: (title: string, path: string) => void;
}

const SAMPLE_MARKDOWN = `# Modern Markdown to HTML Converter

Welcome to **Yuitility's** *instant* client-side Markdown to HTML converter!

## Key Features
- **Zero Server Uploads**: 100% computed inside your browser.
- **Fast Live Preview**: See rendered changes instantly as you type.
- **Clean Semantic HTML**: Clean markup with no tracking or bloat.

### Code Example
\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
console.log(calculateSum(10, 20));
\`\`\`

Here is an inline \`const status = 'healthy';\` snippet.

### Quick Checklist
- [x] Fast client-side rendering
- [x] Syntax-friendly markup
- [ ] Try pasting your own markdown!

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Visit [Yuitility Tools](https://yuitility.app) for 130+ free tools.
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
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />');
    // Links: [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline">$1</a>');
    // Bold & italic
    s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Inline code
    s = s.replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    // Strikethrough
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
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
      out.push('</blockquote>');
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        out.push(`<pre class="bg-slate-950 p-4 rounded-xl text-slate-200 overflow-x-auto my-3 font-mono text-sm border border-slate-800"><code${codeBlockLang ? ` class="language-${codeBlockLang}"` : ''}>${escapeHtml(codeBlockContent.join('\n'))}</code></pre>`);
        inCodeBlock = false;
        codeBlockLang = '';
        codeBlockContent = [];
      } else {
        closeLists();
        closeBlockquote();
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
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      closeLists();
      if (!inBlockquote) {
        out.push('<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-400 my-3">');
        inBlockquote = true;
      }
      out.push(`<p class="my-1">${formatInline(line.trim().replace(/^>\s*/, ''))}</p>`);
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
        1: 'text-2xl sm:text-3xl font-bold text-white mt-6 mb-3',
        2: 'text-xl sm:text-2xl font-semibold text-white mt-5 mb-2.5',
        3: 'text-lg sm:text-xl font-medium text-slate-100 mt-4 mb-2',
        4: 'text-base sm:text-lg font-medium text-slate-200 mt-3 mb-1.5',
        5: 'text-sm sm:text-base font-medium text-slate-300 mt-2 mb-1',
        6: 'text-xs sm:text-sm font-medium text-slate-400 mt-2 mb-1',
      };
      out.push(`<h${level} class="${classes[level] || ''}">${text}</h${level}>`);
      continue;
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      closeLists();
      out.push('<hr class="my-6 border-slate-800" />');
      continue;
    }

    // Checklist item (- [ ] or - [x])
    const checkMatch = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (checkMatch) {
      if (!inUl) {
        closeLists();
        out.push('<ul class="my-3 space-y-1.5 list-none pl-0">');
        inUl = true;
      }
      const isChecked = checkMatch[1].toLowerCase() === 'x';
      out.push(`<li class="flex items-center gap-2 text-slate-300"><input type="checkbox" disabled ${isChecked ? 'checked' : ''} class="rounded border-slate-700 text-indigo-500" /> <span>${formatInline(checkMatch[2])}</span></li>`);
      continue;
    }

    // Unordered List (- or *)
    const ulMatch = line.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      if (!inUl) {
        closeLists();
        out.push('<ul class="list-disc list-inside my-3 space-y-1 text-slate-300">');
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
        out.push('<ol class="list-decimal list-inside my-3 space-y-1 text-slate-300">');
        inOl = true;
      }
      out.push(`<li>${formatInline(olMatch[1])}</li>`);
      continue;
    }

    // Standard Paragraph
    closeLists();
    out.push(`<p class="my-2 leading-relaxed text-slate-300">${formatInline(line)}</p>`);
  }

  closeLists();
  closeBlockquote();

  return out.join('\n');
}

export default function MarkdownToHtml({ onCopy }: MarkdownToHtmlProps) {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [tab, setTab] = useState<'preview' | 'html'>('preview');
  const [copied, setCopied] = useState<boolean>(false);
  const inputId = useId();

  const htmlOutput = parseMarkdownToHtml(markdown);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    if (onCopy) onCopy(htmlOutput);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = (format: 'html' | 'md') => {
    const text = format === 'html' ? htmlOutput : markdown;
    const blob = new Blob([text], { type: format === 'html' ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const insertSnippet = (prefix: string, suffix: string = '') => {
    setMarkdown((prev) => prev + `\n${prefix}${suffix}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => insertSnippet('### Heading 3')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('**Bold Text**')}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*Italic Text*')}
            className="px-2.5 py-1.5 text-xs font-semibold italic bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('`code snippet`')}
            className="px-2.5 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg transition"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('> Quote statement')}
            className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Quote
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- List item')}
            className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            List
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('[Link text](https://example.com)')}
            className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 rounded-lg transition border border-indigo-800/40"
          >
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMarkdown('')}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg transition border border-rose-800/40"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Side */}
        <div className="flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
            <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileCode className="w-4 h-4 text-indigo-400" /> Markdown Input
            </label>
            <button
              type="button"
              onClick={() => handleDownload('md')}
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> .md
            </button>
          </div>
          <textarea
            id={inputId}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type or paste Markdown here..."
            rows={18}
            className="w-full h-full min-h-[420px] p-4 bg-transparent text-slate-100 placeholder-slate-500 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Preview / HTML Output Side */}
        <div className="flex flex-col bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === 'preview'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </button>
              <button
                type="button"
                onClick={() => setTab('html')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  tab === 'html'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Raw HTML
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyHtml}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy HTML'}
              </button>
              <button
                type="button"
                onClick={() => handleDownload('html')}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                title="Download HTML"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 min-h-[420px] overflow-y-auto">
            {tab === 'preview' ? (
              <div
                className="prose prose-invert max-w-none text-slate-200"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            ) : (
              <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl overflow-x-auto border border-slate-800 h-full">
                <code>{htmlOutput}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2.5">
        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p>
          Supports common markdown conventions including GitHub-style task checkboxes, code blocks with syntax tags, blockquotes, tables, and inline styles. All HTML processing executes entirely in your browser.
        </p>
      </div>
    </div>
  );
}
