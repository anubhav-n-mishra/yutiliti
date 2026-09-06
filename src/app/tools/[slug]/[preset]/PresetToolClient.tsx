"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Moon,
  ShieldCheck,
  Sun,
  ArrowRight,
  BookOpen,
  Award,
  ExternalLink,
  Sparkles,
  Code2,
  X,
} from "lucide-react";
import { Tool } from "@/src/types";
import { ToolPreset } from "@/src/lib/toolPresets";
import { getCategoryName, toolPath } from "@/src/lib/site";
import type { DeepContent } from "@/src/lib/toolDeepContent";
import ToolDeepDive from "@/src/components/ToolDeepDive";
import PwaInstallButton from "@/src/components/PwaInstallButton";
import HoverFooter from "@/src/components/ui/hover-footer";

import CgpaToPercentage from "@/src/components/tools/CgpaToPercentage";
import HomeLoanEmiCalculator from "@/src/components/tools/HomeLoanEmiCalculator";
import SipCalculator from "@/src/components/tools/SipCalculator";
import SalaryCalculator from "@/src/components/tools/SalaryCalculator";
import MortgageCalculator from "@/src/components/tools/MortgageCalculator";
import RetirementCalculator from "@/src/components/tools/RetirementCalculator";
import CompoundInterestCalculator from "@/src/components/tools/CompoundInterestCalculator";
import CarLoanEmiCalculator from "@/src/components/tools/CarLoanEmiCalculator";

interface PresetToolClientProps {
  tool: Tool;
  preset: ToolPreset;
  deep?: DeepContent;
  siblingPresets: ToolPreset[];
}

export default function PresetToolClient({
  tool,
  preset,
  deep,
  siblingPresets,
}: PresetToolClientProps) {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const embedSnippet = `<iframe src="https://www.yuitility.app/embed/${tool.id}" width="100%" height="700" frameborder="0" style="border:1px solid #e4e4e7; border-radius:16px; overflow:hidden;" title="${preset.h1}"></iframe>\n<p style="font-size:12px;text-align:right;margin-top:4px;font-family:sans-serif;"><a href="https://www.yuitility.app/tools/${tool.id}/${preset.presetSlug}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none;">⚡ Free ${preset.h1} by Yuitility</a></p>`;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(true);
    }
    const savedRating = localStorage.getItem(`rating_${tool.id}_${preset.presetSlug}`);
    if (savedRating) {
      setUserRating(parseInt(savedRating, 10));
    }
  }, [tool.id, preset.presetSlug]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new CustomEvent("theme-change", { detail: darkMode }));
  }, [darkMode]);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (customEvent.detail !== darkMode) {
        setDarkMode(customEvent.detail);
      }
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, [darkMode]);

  const showMessage = (val: string) => {
    setMessage(val);
    window.setTimeout(() => setMessage(""), 2400);
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showMessage("Copied to clipboard.");
    } catch {
      showMessage("Copy failed. Please select and copy manually.");
    }
  };

  const share = async (title: string, path: string) => {
    const url = `${window.location.origin}${path}`;
    await copy(url);
    showMessage(`Share link for ${title} copied.`);
  };

  const currentPath = `/tools/${tool.id}/${preset.presetSlug}`;

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-zinc-50 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100`}
    >
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yuitility home">
            <img
              src="/brand/yuitility-logo.png"
              alt="Yuitility logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-lg font-bold tracking-tight text-zinc-950 dark:text-white">
              Yuitility
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <PwaInstallButton />
            <Link
              href="/tools"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-cyan-300 sm:inline-flex"
            >
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
        {/* 5-Step Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-300">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300"
          >
            All tools
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/category/${tool.category}`}
            className="hover:text-blue-600 dark:hover:text-cyan-300"
          >
            {getCategoryName(tool.category)}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={toolPath(tool.id)}
            className="hover:text-blue-600 dark:hover:text-cyan-300"
          >
            {tool.title}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-100">
            {preset.badge}
          </span>
        </nav>

        {/* Header with Badges, H1, Subtitle, and Share Actions */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> {preset.badge}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Award className="w-3 h-3" /> Formula Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-3 h-3" /> 100% In-Browser Privacy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {preset.h1}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
              {preset.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}${currentPath}`;
                const text = encodeURIComponent(
                  `Check out this ${preset.h1} on Yuitility: ${url}`
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
              aria-label="Share via WhatsApp"
            >
              Share WhatsApp
            </button>
            <button
              type="button"
              onClick={() => share(preset.h1, currentPath)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              aria-label="Copy tool link"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </button>
            <button
              type="button"
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              aria-label="Embed this preset tool"
            >
              <Code2 className="w-3.5 h-3.5" /> Embed
            </button>
            <Link
              href={toolPath(tool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-all"
            >
              Base Calculator <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Pre-Populated Tool Workspace */}
        <section
          aria-label={`${preset.h1} workspace`}
          className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        >
          {tool.id === "cgpa-to-percentage-calculator" && (
            <CgpaToPercentage
              initialUniversity={preset.presetParams.initialUniversity}
              initialCgpa={preset.presetParams.initialCgpa}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "home-loan-emi-calculator" && (
            <HomeLoanEmiCalculator
              initialInterestRate={preset.presetParams.initialInterestRate}
              initialPropertyPrice={preset.presetParams.initialPropertyPrice}
              initialCurrency={preset.presetParams.initialCurrency}
              lenderName={preset.presetParams.lenderName}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "sip-calculator" && (
            <SipCalculator
              initialMonthlyInvestment={preset.presetParams.initialMonthlyInvestment}
              initialDuration={preset.presetParams.initialDuration}
              initialExpectedReturn={preset.presetParams.initialExpectedReturn}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "salary-calculator" && (
            <SalaryCalculator
              initialCtc={preset.presetParams.initialCtc}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "mortgage-calculator" && (
            <MortgageCalculator
              initialHomePrice={preset.presetParams.initialHomePrice}
              initialDownPaymentPercent={preset.presetParams.initialDownPaymentPercent}
              initialInterestRate={preset.presetParams.initialInterestRate}
              initialLoanTermYears={preset.presetParams.initialLoanTermYears}
              initialPropertyTaxAnnual={preset.presetParams.initialPropertyTaxAnnual}
              initialHomeInsuranceAnnual={preset.presetParams.initialHomeInsuranceAnnual}
              initialHoaFeesMonthly={preset.presetParams.initialHoaFeesMonthly}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "retirement-calculator" && (
            <RetirementCalculator
              initialCurrentAge={preset.presetParams.initialCurrentAge}
              initialRetirementAge={preset.presetParams.initialRetirementAge}
              initialLifeExpectancy={preset.presetParams.initialLifeExpectancy}
              initialCurrentSavings={preset.presetParams.initialCurrentSavings}
              initialMonthlyExpenses={preset.presetParams.initialMonthlyExpenses}
              initialExpectedReturn={preset.presetParams.initialExpectedReturn}
              initialInflationRate={preset.presetParams.initialInflationRate}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "compound-interest-calculator" && (
            <CompoundInterestCalculator
              initialPrincipal={preset.presetParams.initialPrincipal}
              initialMonthlyContribution={preset.presetParams.initialMonthlyContribution}
              initialAnnualRate={preset.presetParams.initialAnnualRate}
              initialYears={preset.presetParams.initialYears}
              initialCompoundFreq={preset.presetParams.initialCompoundFreq}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}

          {tool.id === "car-loan-emi-calculator" && (
            <CarLoanEmiCalculator
              initialCarPrice={preset.presetParams.initialCarPrice}
              initialDownPayment={preset.presetParams.initialDownPayment}
              initialTradeInValue={preset.presetParams.initialTradeInValue}
              initialInterestRate={preset.presetParams.initialInterestRate}
              initialTenureYears={preset.presetParams.initialTenureYears}
              initialCurrency={preset.presetParams.initialCurrency}
              onCopy={copy}
              onShare={share}
            />
          )}
        </section>

        {/* Embed Calculator Section for Bloggers & Webmasters */}
        <section aria-label="Embed preset widget" className="mb-8 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50 p-6 shadow-sm dark:border-blue-900/40 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-cyan-950/20 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3.5">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-2xl bg-blue-600 text-white dark:bg-cyan-500 dark:text-zinc-950 shrink-0 shadow-md">
                <Code2 className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-display font-bold text-zinc-950 dark:text-white">
                    Embed {preset.h1} On Your Website
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Free Embed
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 max-w-2xl">
                  Embed this verified, 100% private calculator widget into your articles, guides, or portal. Zero server tracking, instant in-browser execution.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  copy(embedSnippet);
                  showMessage("Embed snippet copied to clipboard! Paste directly into your CMS.");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Embed Code
              </button>
              <a
                href={`/embed/${tool.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all"
              >
                Preview Widget <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={2}
              value={embedSnippet}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              className="w-full rounded-xl border border-zinc-200 bg-white/90 dark:bg-zinc-950 p-2.5 text-[11px] font-mono text-zinc-700 select-all outline-none dark:border-zinc-800 dark:text-zinc-300 resize-none shadow-inner"
            />
          </div>
        </section>

        {/* Official Reference & Regulatory Citation Card */}
        {preset.officialReference && (
          <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {preset.officialReference.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-medium">
                    {preset.officialReference.authority}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                  Official Citation: {preset.officialReference.citation}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
                  This calculator automatically applies the exact formula and rounding rules
                  mandated by the authority above. Values calculated here are accepted for job
                  applications, university admissions, and statutory reporting.
                </p>
                {preset.officialReference.url && (
                  <div className="pt-2">
                    <a
                      href={preset.officialReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Visit Official Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Related Presets Grid for This Tool */}
        {siblingPresets.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Explore Other {tool.title} Presets
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Switch instantly to other supported institutions, benchmarks, and targets
                </p>
              </div>
              <Link
                href={toolPath(tool.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {siblingPresets.map((sib) => (
                <Link
                  key={sib.presetSlug}
                  href={`/tools/${tool.id}/${sib.presetSlug}`}
                  className="group p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {sib.badge}
                      </span>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                      {sib.h1}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {sib.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Dedicated Preset FAQs */}
        {preset.faqs && preset.faqs.length > 0 && (
          <section className="mb-10 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Frequently Asked Questions: {preset.h1}
            </h2>
            <div className="space-y-4 divide-y divide-zinc-200/60 dark:divide-zinc-800">
              {preset.faqs.map((faq, idx) => (
                <div key={idx} className={idx === 0 ? "" : "pt-4"}>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deep Dive Knowledge Content (if available for parent tool) */}
        {deep && <ToolDeepDive deep={deep} tool={tool} />}

        {/* Micro Poll */}
        <section className="mt-8 rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900/60 dark:border-zinc-800 p-5 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Was this {preset.badge} calculation accurate for your needs?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              1-click feedback to help us maintain verified compliance across all academic and financial formulas.
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center justify-center sm:justify-end gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setUserRating(star);
                  localStorage.setItem(`rating_${tool.id}_${preset.presetSlug}`, star.toString());
                  showMessage(`Thank you for rating ${preset.badge} ${star}/5 stars!`);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  (userRating || 0) >= star
                    ? "text-amber-400 hover:text-amber-500"
                    : "text-zinc-300 dark:text-zinc-700 hover:text-amber-400"
                }`}
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            {userRating && (
              <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Rated {userRating}/5 ★
              </span>
            )}
          </div>
        </section>

        {/* Embed Widget Modal */}
        {showEmbedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
              <button
                type="button"
                onClick={() => setShowEmbedModal(false)}
                className="absolute top-5 right-5 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition"
                aria-label="Close embed modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Code2 className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-white">
                  Embed &ldquo;{preset.h1}&rdquo;
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                Add this verified calculation engine to your site or educational resources. Zero server tracking, instant in-browser execution.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">HTML Embed Snippet</label>
                  <span className="text-[10px] text-zinc-400 font-mono">iframe responsive</span>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={embedSnippet}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-mono text-zinc-800 select-all outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 resize-none"
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    copy(embedSnippet);
                    showMessage("Embed snippet copied to clipboard!");
                  }}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 dark:bg-cyan-500 dark:text-zinc-950 dark:hover:bg-cyan-400 transition"
                >
                  <Copy className="w-4 h-4" />
                  Copy Embed Code
                </button>
                <a
                  href={`/embed/${tool.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
                >
                  Preview Widget <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Copy / Share Toast */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 rounded-xl bg-zinc-900 text-white px-4 py-3 shadow-2xl text-xs font-semibold flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {message}
        </div>
      )}

      <HoverFooter />
    </div>
  );
}
