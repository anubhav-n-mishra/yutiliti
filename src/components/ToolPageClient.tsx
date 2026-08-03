"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Moon, ShieldCheck, Sun } from "lucide-react";
import { Tool, TOOLS } from "@/src/types";
import { getToolFaqs, getToolHowItWorks, getToolSteps, toolPath } from "@/src/lib/site";
import PwaInstallButton from "./PwaInstallButton";
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
import AgeCalculatorInMonths from "@/src/components/tools/AgeCalculatorInMonths";
import DogAgeCalculator from "@/src/components/tools/DogAgeCalculator";
import PregnancyDueDateCalculator from "@/src/components/tools/PregnancyDueDateCalculator";
import RetirementCalculator from "@/src/components/tools/RetirementCalculator";
import ZodiacAgeCalculator from "@/src/components/tools/ZodiacAgeCalculator";
import SchoolAgeEligibilityCalculator from "@/src/components/tools/SchoolAgeEligibilityCalculator";
import MedianCalculator from "@/src/components/tools/MedianCalculator";
import MeanCalculator from "@/src/components/tools/MeanCalculator";
import ModCalculator from "@/src/components/tools/ModCalculator";
import ZodiacSunMoonCalculator from "@/src/components/tools/ZodiacSunMoonCalculator";
import BmiCalculator from "@/src/components/tools/BmiCalculator";
import DeathCalculator from "@/src/components/tools/DeathCalculator";
import LoanCalculator from "@/src/components/tools/LoanCalculator";
import EducationLoanEmiCalculator from "@/src/components/tools/EducationLoanEmiCalculator";
import PersonalLoanEmiCalculator from "@/src/components/tools/PersonalLoanEmiCalculator";
import BikeLoanEmiCalculator from "@/src/components/tools/BikeLoanEmiCalculator";
import CarLoanEmiCalculator from "@/src/components/tools/CarLoanEmiCalculator";
import HomeLoanEmiCalculator from "@/src/components/tools/HomeLoanEmiCalculator";
import MortgageCalculator from "@/src/components/tools/MortgageCalculator";
import InterestCalculator from "@/src/components/tools/InterestCalculator";
import FdCalculator from "@/src/components/tools/FdCalculator";
import RdCalculator from "@/src/components/tools/RdCalculator";
import CompoundInterestCalculator from "@/src/components/tools/CompoundInterestCalculator";
import SimpleInterestCalculator from "@/src/components/tools/SimpleInterestCalculator";
import PpfCalculator from "@/src/components/tools/PpfCalculator";
import GoldLoanEmiCalculator from "@/src/components/tools/GoldLoanEmiCalculator";
import BusinessLoanEmiCalculator from "@/src/components/tools/BusinessLoanEmiCalculator";
import SwpCalculator from "@/src/components/tools/SwpCalculator";
import EpfCalculator from "@/src/components/tools/EpfCalculator";
import NpsCalculator from "@/src/components/tools/NpsCalculator";
import GratuityCalculator from "@/src/components/tools/GratuityCalculator";
import HraCalculator from "@/src/components/tools/HraCalculator";
import IncomeTaxCalculator from "@/src/components/tools/IncomeTaxCalculator";
import GstCalculator from "@/src/components/tools/GstCalculator";
import CreditCardEmiCalculator from "@/src/components/tools/CreditCardEmiCalculator";
import NetWorthCalculator from "@/src/components/tools/NetWorthCalculator";
import EmergencyFundCalculator from "@/src/components/tools/EmergencyFundCalculator";
import RoiCalculator from "@/src/components/tools/RoiCalculator";
import CagrCalculator from "@/src/components/tools/CagrCalculator";
import IrrCalculator from "@/src/components/tools/IrrCalculator";
import BreakEvenCalculator from "@/src/components/tools/BreakEvenCalculator";
import ProfitMarginCalculator from "@/src/components/tools/ProfitMarginCalculator";
import DiscountCalculator from "@/src/components/tools/DiscountCalculator";
import CommissionCalculator from "@/src/components/tools/CommissionCalculator";
import CurrencyConverterTool from "@/src/components/tools/CurrencyConverterTool";
import MutualFundReturnCalculator from "@/src/components/tools/MutualFundReturnCalculator";
import DividendCalculator from "@/src/components/tools/DividendCalculator";
import StockAverageCalculator from "@/src/components/tools/StockAverageCalculator";
import BmrCalculator from "@/src/components/tools/BmrCalculator";
import BodyFatCalculator from "@/src/components/tools/BodyFatCalculator";

import StandardCalculator from "@/src/components/tools/StandardCalculator";
import ScientificCalculator from "@/src/components/tools/ScientificCalculator";
import ShareToast from "./ShareToast";

type ToolPageClientProps = {
  tool: Tool;
};

type ToolComponentProps = {
  onCopy: (value: string) => void;
  onShare: (title: string, path: string) => void;
  onTriggerShareToast?: () => void;
};

function ToolRenderer({ tool, onCopy, onShare, onTriggerShareToast }: ToolPageClientProps & ToolComponentProps) {
  const props = { onCopy, onShare, onTriggerShareToast };

  switch (tool.id) {
    case "standard-calculator": return <StandardCalculator {...props} />;
    case "scientific-calculator": return <ScientificCalculator {...props} />;
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
    case "age-calculator-in-months": return <AgeCalculatorInMonths {...props} />;
    case "dog-age-calculator": return <DogAgeCalculator {...props} />;
    case "pregnancy-due-date-calculator": return <PregnancyDueDateCalculator {...props} />;
    case "retirement-calculator": return <RetirementCalculator {...props} />;
    case "zodiac-age-calculator": return <ZodiacAgeCalculator {...props} />;
    case "school-age-eligibility-calculator": return <SchoolAgeEligibilityCalculator {...props} />;
    case "median-calculator": return <MedianCalculator {...props} />;
    case "mean-calculator": return <MeanCalculator {...props} />;
    case "mod-calculator": return <ModCalculator {...props} />;
    case "zodiac-sun-moon-calculator": return <ZodiacSunMoonCalculator {...props} />;
    case "bmi-calculator": return <BmiCalculator {...props} />;
    case "death-calculator": return <DeathCalculator {...props} />;
    case "loan-calculator": return <LoanCalculator {...props} />;
    case "education-loan-emi-calculator": return <EducationLoanEmiCalculator {...props} />;
    case "personal-loan-emi-calculator": return <PersonalLoanEmiCalculator {...props} />;
    case "bike-loan-emi-calculator": return <BikeLoanEmiCalculator {...props} />;
    case "car-loan-emi-calculator": return <CarLoanEmiCalculator {...props} />;
    case "home-loan-emi-calculator": return <HomeLoanEmiCalculator {...props} />;
    case "mortgage-calculator": return <MortgageCalculator {...props} />;
    case "interest-calculator": return <InterestCalculator {...props} />;
    case "fd-calculator": return <FdCalculator {...props} />;
    case "rd-calculator": return <RdCalculator {...props} />;
    case "compound-interest-calculator": return <CompoundInterestCalculator {...props} />;
    case "simple-interest-calculator": return <SimpleInterestCalculator {...props} />;
    case "ppf-calculator": return <PpfCalculator {...props} />;
    case "gold-loan-emi-calculator": return <GoldLoanEmiCalculator />;
    case "business-loan-emi-calculator": return <BusinessLoanEmiCalculator />;
    case "swp-calculator": return <SwpCalculator />;
    case "epf-calculator": return <EpfCalculator />;
    case "nps-calculator": return <NpsCalculator />;
    case "gratuity-calculator": return <GratuityCalculator />;
    case "hra-calculator": return <HraCalculator />;
    case "income-tax-calculator": return <IncomeTaxCalculator />;
    case "gst-calculator": return <GstCalculator />;
    case "credit-card-emi-calculator": return <CreditCardEmiCalculator />;
    case "net-worth-calculator": return <NetWorthCalculator />;
    case "emergency-fund-calculator": return <EmergencyFundCalculator />;
    case "roi-calculator": return <RoiCalculator />;
    case "cagr-calculator": return <CagrCalculator />;
    case "irr-calculator": return <IrrCalculator />;
    case "break-even-calculator": return <BreakEvenCalculator />;
    case "profit-margin-calculator": return <ProfitMarginCalculator />;
    case "discount-calculator": return <DiscountCalculator />;
    case "commission-calculator": return <CommissionCalculator />;
    case "currency-converter": return <CurrencyConverterTool />;
    case "mutual-fund-return-calculator": return <MutualFundReturnCalculator />;
    case "dividend-calculator": return <DividendCalculator />;
    case "stock-average-calculator": return <StockAverageCalculator />;
    case "bmr-calculator": return <BmrCalculator />;
    case "body-fat-calculator": return <BodyFatCalculator />;
    default: return null;
  }
}

export default function ToolPageClient({ tool }: ToolPageClientProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);
  const faqs = useMemo(() => getToolFaqs(tool), [tool]);
  const steps = useMemo(() => getToolSteps(tool), [tool]);
  const howItWorks = useMemo(() => getToolHowItWorks(tool), [tool]);
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
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">Yuitility</span>
          </Link>
          <div className="flex items-center gap-2">
            <PwaInstallButton />
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

        <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-cyan-950/30 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Free online {tool.category} tool</p>
              <h1 className="text-3xl font-display font-extrabold tracking-tight text-zinc-950 dark:text-white mb-2">{tool.title}</h1>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">{tool.longDescription}</p>
            </div>
          </div>

          <div className="border-t border-blue-200/60 pt-5 dark:border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-cyan-300 mb-1.5">How It Works</h2>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">{howItWorks}</p>
          </div>
        </div>

        <section aria-label={`${tool.title} workspace`} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <ToolRenderer tool={tool} onCopy={copy} onShare={share} onTriggerShareToast={() => setShowShareToast(true)} />
        </section>

        {/* Share Toast Modal */}
        <ShareToast
          toolTitle={tool.title}
          toolId={tool.id}
          show={showShareToast}
          onClose={() => setShowShareToast(false)}
        />

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
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{tool.title} FAQ</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Frequently asked questions about calculation formulas, privacy, and usage.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug">{faq.question}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{faq.answer}</p>
              </article>
            ))}
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
