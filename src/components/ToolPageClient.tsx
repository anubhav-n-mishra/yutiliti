"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Moon, ShieldCheck, Sun } from "lucide-react";
import { Tool, TOOLS } from "@/src/types";
import { getToolFaqs, getToolSteps, toolPath } from "@/src/lib/site";
import EmiCalculator from "@/src/components/tools/EmiCalculator";
import SipCalculator from "@/src/components/tools/SipCalculator";
import AgeCalculator from "@/src/components/tools/AgeCalculator";
import PasswordGenerator from "@/src/components/tools/PasswordGenerator";
import QrCodeGenerator from "@/src/components/tools/QrCodeGenerator";
import WordCounter from "@/src/components/tools/WordCounter";
import ImageCompressor from "@/src/components/tools/ImageCompressor";
import SalaryCalculator from "@/src/components/tools/SalaryCalculator";
import JsonFormatter from "@/src/components/tools/JsonFormatter";
import ColorPalette from "@/src/components/tools/ColorPalette";
import PdfMerger from "@/src/components/tools/PdfMerger";
import PdfSplitter from "@/src/components/tools/PdfSplitter";
import ImageToPdf from "@/src/components/tools/ImageToPdf";
import PdfWatermarker from "@/src/components/tools/PdfWatermarker";
import PdfMetadata from "@/src/components/tools/PdfMetadata";
import BackgroundRemover from "@/src/components/tools/BackgroundRemover";
import ImageResizer from "@/src/components/tools/ImageResizer";
import FormatConverter from "@/src/components/tools/FormatConverter";
import PdfCompressor from "@/src/components/tools/PdfCompressor";
import ZipExtractor from "@/src/components/tools/ZipExtractor";
import UnitConverter from "@/src/components/tools/UnitConverter";
import MemeMaker from "@/src/components/tools/MemeMaker";
import FaviconGenerator from "@/src/components/tools/FaviconGenerator";
import OgImageGenerator from "@/src/components/tools/OgImageGenerator";
import SocialMediaResizer from "@/src/components/tools/SocialMediaResizer";
import FakeDataGenerator from "@/src/components/tools/FakeDataGenerator";
import PhotoCollageMaker from "@/src/components/tools/PhotoCollageMaker";

type ToolPageClientProps = {
  tool: Tool;
};

type ToolComponentProps = {
  onCopy: (value: string) => void;
  onShare: (title: string, path: string) => void;
};

function ToolRenderer({ tool, onCopy, onShare }: ToolPageClientProps & ToolComponentProps) {
  const props = { onCopy, onShare };

  switch (tool.id) {
    case "emi-calculator": return <EmiCalculator {...props} />;
    case "sip-calculator": return <SipCalculator {...props} />;
    case "age-calculator": return <AgeCalculator {...props} />;
    case "password-generator": return <PasswordGenerator {...props} />;
    case "qr-code-generator": return <QrCodeGenerator {...props} />;
    case "word-counter": return <WordCounter {...props} />;
    case "image-compressor": return <ImageCompressor {...props} />;
    case "salary-calculator": return <SalaryCalculator {...props} />;
    case "json-formatter": return <JsonFormatter {...props} />;
    case "color-palette": return <ColorPalette {...props} />;
    case "pdf-merger": return <PdfMerger {...props} />;
    case "pdf-splitter": return <PdfSplitter {...props} />;
    case "image-to-pdf": return <ImageToPdf {...props} />;
    case "pdf-watermark": return <PdfWatermarker {...props} />;
    case "pdf-metadata": return <PdfMetadata {...props} />;
    case "background-remover": return <BackgroundRemover {...props} />;
    case "image-resizer": return <ImageResizer {...props} />;
    case "format-converter": return <FormatConverter {...props} />;
    case "pdf-compressor": return <PdfCompressor {...props} />;
    case "zip-extractor": return <ZipExtractor {...props} />;
    case "unit-converter": return <UnitConverter {...props} />;
    case "meme-maker": return <MemeMaker {...props} />;
    case "favicon-generator": return <FaviconGenerator {...props} />;
    case "og-image-generator": return <OgImageGenerator {...props} />;
    case "social-media-resizer": return <SocialMediaResizer {...props} />;
    case "fake-data-generator": return <FakeDataGenerator {...props} />;
    case "photo-collage-maker": return <PhotoCollageMaker {...props} />;
    default: return null;
  }
}

export default function ToolPageClient({ tool }: ToolPageClientProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const faqs = useMemo(() => getToolFaqs(tool), [tool]);
  const steps = useMemo(() => getToolSteps(tool), [tool]);
  const relatedTools = useMemo(
    () => TOOLS.filter((candidate) => candidate.category === tool.category && candidate.id !== tool.id && !candidate.disabled).slice(0, 3),
    [tool],
  );

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2400);
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showMessage("Copied to clipboard.");
    } catch {
      showMessage("Copy failed. Please select and copy the value manually.");
    }
  };

  const share = async (title: string, legacyPath: string) => {
    const slug = legacyPath.replace(/^#\//, "").replace(/^\//, "") || tool.id;
    const url = `${window.location.origin}${toolPath(slug)}`;
    await copy(url);
    showMessage(`Share link for ${title} copied.`);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-zinc-50 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100`}>
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yuitility home">
            <img src="/brand/yuitility-logo.png" alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Yuitility</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-cyan-300 sm:inline-flex">
              All tools
            </Link>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              aria-label="Toggle color theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300"><ArrowLeft className="h-3.5 w-3.5" /> All tools</Link>
          <span aria-hidden="true">/</span>
          <span className="capitalize">{tool.category}</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-100">{tool.title}</span>
        </nav>

        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-cyan-950/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Free online {tool.category} tool</p>
            <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">{tool.longDescription}</p>
          </div>
          <button type="button" onClick={() => share(tool.title, `#/${tool.id}`)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-cyan-200">
            <Copy className="h-4 w-4" /> Copy link
          </button>
        </div>

        <section aria-label={`${tool.title} workspace`} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <ToolRenderer tool={tool} onCopy={copy} onShare={share} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <article className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">How to use the {tool.title}</h2>
            <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-300">{tool.description} Yuitility keeps the workflow fast and focused, so you can complete the job without creating an account.</p>
            <ol className="mt-6 space-y-4">
              {steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300">{index + 1}</span><span>{step}</span></li>)}
            </ol>
          </article>
          <aside className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-cyan-300" />
            <h2 className="mt-4 font-display text-xl font-bold text-zinc-950 dark:text-white">Local-first by design</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">Use this tool directly in your browser. Yuitility is built to make practical everyday tasks simpler without a Yuitility file-processing backend.</p>
          </aside>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{tool.title} FAQ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => <details key={faq.question} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><summary className="cursor-pointer font-semibold text-zinc-900 dark:text-white">{faq.question}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{faq.answer}</p></details>)}
          </div>
        </section>

        {relatedTools.length > 0 && <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">More {tool.category} tools</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relatedTools.map((related) => <Link key={related.id} href={toolPath(related.id)} className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60"><h3 className="font-display font-bold text-zinc-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300">{related.title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{related.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-cyan-300">Open tool <span aria-hidden="true">→</span></span></Link>)}
          </div>
        </section>}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">© {new Date().getFullYear()} Yuitility · Private, practical browser tools.</footer>
      {message && <div role="status" className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-zinc-950"><CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />{message}</div>}
    </div>
  );
}
