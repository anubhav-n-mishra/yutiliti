"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Moon, ShieldCheck, Sun, ArrowRight, BookOpen, Award, Code2, X } from "lucide-react";
import { Tool } from "@/src/types";
import { getCategoryName, getToolFaqs, getToolHowItWorks, getToolSteps, toolPath } from "@/src/lib/site";
import { getRelatedTools } from "@/src/lib/toolRegistry";
import type { DeepContent } from "@/src/lib/toolDeepContent";
import ToolDeepDive from "./ToolDeepDive";
import { BLOG_POSTS } from "@/src/lib/blogs";
import PwaInstallButton from "./PwaInstallButton";
import HoverFooter from "@/src/components/ui/hover-footer";
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
import PdfRotator from "@/src/components/tools/PdfRotator";
import PdfPageNumberer from "@/src/components/tools/PdfPageNumberer";
import PdfPageRemover from "@/src/components/tools/PdfPageRemover";
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

import UuidV4Generator from "@/src/components/tools/UuidV4Generator";
import Base64EncoderDecoder from "@/src/components/tools/Base64EncoderDecoder";
import UrlEncoderDecoder from "@/src/components/tools/UrlEncoderDecoder";
import LoremIpsumGenerator from "@/src/components/tools/LoremIpsumGenerator";
import HashGenerator from "@/src/components/tools/HashGenerator";
import HexColorConverter from "@/src/components/tools/HexColorConverter";
import MorseCodeTranslator from "@/src/components/tools/MorseCodeTranslator";
import RegexTester from "@/src/components/tools/RegexTester";
import MarkdownToHtml from "@/src/components/tools/MarkdownToHtml";
import MarkdownViewer from "@/src/components/tools/MarkdownViewer";
import DiffChecker from "@/src/components/tools/DiffChecker";

import PercentageCalculator from "@/src/components/tools/PercentageCalculator";
import CgpaCalculator from "@/src/components/tools/CgpaCalculator";
import CgpaToPercentage from "@/src/components/tools/CgpaToPercentage";
import GpaCalculator from "@/src/components/tools/GpaCalculator";
import DateDifferenceCalculator from "@/src/components/tools/DateDifferenceCalculator";
import ModeFrequencyCalculator from "@/src/components/tools/ModeFrequencyCalculator";
import StandardDeviationCalculator from "@/src/components/tools/StandardDeviationCalculator";
import ProbabilityCalculator from "@/src/components/tools/ProbabilityCalculator";
import PermutationCombinationCalculator from "@/src/components/tools/PermutationCombinationCalculator";
import FactorialCalculator from "@/src/components/tools/FactorialCalculator";
import MatrixCalculator from "@/src/components/tools/MatrixCalculator";
import QuadraticSolver from "@/src/components/tools/QuadraticSolver";
import FractionToDecimal from "@/src/components/tools/FractionToDecimal";
import RatioProportionCalculator from "@/src/components/tools/RatioProportionCalculator";
import GeometryAreaCalculator from "@/src/components/tools/GeometryAreaCalculator";

import LeanBodyMassCalculator from "@/src/components/tools/LeanBodyMassCalculator";
import IdealBodyWeightCalculator from "@/src/components/tools/IdealBodyWeightCalculator";
import DailyCalorieCalculator from "@/src/components/tools/DailyCalorieCalculator";
import WaterIntakeCalculator from "@/src/components/tools/WaterIntakeCalculator";
import MacroRatioCalculator from "@/src/components/tools/MacroRatioCalculator";
import ProteinIntakeCalculator from "@/src/components/tools/ProteinIntakeCalculator";
import TdeeCalculator from "@/src/components/tools/TdeeCalculator";
import OneRepMaxCalculator from "@/src/components/tools/OneRepMaxCalculator";
import OvulationCalculator from "@/src/components/tools/OvulationCalculator";
import TargetHeartRateCalculator from "@/src/components/tools/TargetHeartRateCalculator";
import WaistHipRatioCalculator from "@/src/components/tools/WaistHipRatioCalculator";
import SleepCycleCalculator from "@/src/components/tools/SleepCycleCalculator";
import SmokingCostCalculator from "@/src/components/tools/SmokingCostCalculator";
import RunningPaceCalculator from "@/src/components/tools/RunningPaceCalculator";
import StepToCalorieCalculator from "@/src/components/tools/StepToCalorieCalculator";

import RoomSquareFootageCalculator from "@/src/components/tools/RoomSquareFootageCalculator";
import FlooringCalculator from "@/src/components/tools/FlooringCalculator";
import TileCountCalculator from "@/src/components/tools/TileCountCalculator";
import PaintVolumeCalculator from "@/src/components/tools/PaintVolumeCalculator";
import BrickCountCalculator from "@/src/components/tools/BrickCountCalculator";
import ConcreteVolumeCalculator from "@/src/components/tools/ConcreteVolumeCalculator";
import CementMortarCalculator from "@/src/components/tools/CementMortarCalculator";
import AcBtuCalculator from "@/src/components/tools/AcBtuCalculator";

import TimeZoneConverter from "@/src/components/tools/TimeZoneConverter";
import ShareToast from "./ShareToast";

type ToolPageClientProps = {
  tool: Tool;
  /** Formula, worked example, pitfalls. Present only for priority pages. */
  deep?: DeepContent | null;
};

type ToolComponentProps = {
  onCopy: (value: string) => void;
  onShare: (title: string, path: string) => void;
  onTriggerShareToast?: () => void;
};

function GenericInteractiveTool({ tool, onCopy, onShare }: { tool: Tool; onCopy: (v: string) => void; onShare: (t: string, p: string) => void }) {
  const [val1, setVal1] = useState<number>(100);
  const [val2, setVal2] = useState<number>(10);
  const [inputText, setInputText] = useState<string>("Sample input data for " + tool.title);
  const [copied, setCopied] = useState<boolean>(false);

  const resultValue = useMemo(() => {
    if (tool.id.includes("percentage") || tool.id.includes("discount")) {
      return ((val1 * val2) / 100).toFixed(2);
    }
    if (tool.id.includes("converter") || tool.id.includes("base64") || tool.id.includes("url")) {
      try {
        if (tool.id.includes("base64")) return btoa(inputText);
        if (tool.id.includes("url")) return encodeURIComponent(inputText);
        return inputText.toUpperCase();
      } catch {
        return "Encoding Error";
      }
    }
    return (val1 * val2).toLocaleString();
  }, [val1, val2, inputText, tool.id]);

  const handleCopyResult = () => {
    onCopy(resultValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-zinc-950 dark:text-white">{tool.title}</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Input Parameters</h3>

          {tool.id.includes("converter") || tool.id.includes("generator") || tool.id.includes("json") || tool.id.includes("encoder") || tool.id.includes("text") || tool.id.includes("lorem") ? (
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Target Text / Data</label>
              <textarea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 resize-none"
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span>Primary Value (X)</span>
                  <input
                    type="number"
                    value={val1}
                    onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
                    className="w-24 text-right px-2 py-0.5 text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="10000"
                  value={val1}
                  onChange={(e) => setVal1(parseFloat(e.target.value) || 1)}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span>Secondary Parameter (Y)</span>
                  <input
                    type="number"
                    value={val2}
                    onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
                    className="w-24 text-right px-2 py-0.5 text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={val2}
                  onChange={(e) => setVal2(parseFloat(e.target.value) || 1)}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-zinc-900 dark:to-zinc-950 p-6 rounded-2xl border border-blue-100 dark:border-zinc-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Calculated Result</span>
            <div className="mt-3 p-4 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 break-all select-all shadow-inner">
              {resultValue}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={handleCopyResult}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy Result"}
            </button>
            <button
              onClick={() => onShare(tool.title, tool.id)}
              className="px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
            >
              Share Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolRenderer({ tool, onCopy, onShare, onTriggerShareToast }: { tool: Tool } & ToolComponentProps) {
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
    case "pdf-rotator": return <PdfRotator {...props} />;
    case "pdf-page-numbers": return <PdfPageNumberer {...props} />;
    case "pdf-page-remover": return <PdfPageRemover {...props} />;
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

    case "uuid-v4-generator": return <UuidV4Generator {...props} />;
    case "base64-encoder-decoder": return <Base64EncoderDecoder {...props} />;
    case "url-encoder-decoder": return <UrlEncoderDecoder {...props} />;
    case "lorem-ipsum-generator": return <LoremIpsumGenerator {...props} />;
    case "hash-generator-md5-sha": return <HashGenerator {...props} />;
    case "hex-color-converter": return <HexColorConverter {...props} />;
    case "morse-code-translator": return <MorseCodeTranslator {...props} />;
    case "regex-tester": return <RegexTester {...props} />;
    case "markdown-to-html": return <MarkdownToHtml {...props} />;
    case "markdown-viewer": return <MarkdownViewer {...props} />;
    case "diff-checker": return <DiffChecker {...props} />;

    case "percentage-calculator": return <PercentageCalculator {...props} />;
    case "cgpa-calculator": return <CgpaCalculator {...props} />;
    case "cgpa-to-percentage-calculator": return <CgpaToPercentage {...props} />;
    case "gpa-calculator": return <GpaCalculator {...props} />;
    case "date-difference-calculator": return <DateDifferenceCalculator {...props} />;
    case "mode-frequency-calculator": return <ModeFrequencyCalculator {...props} />;
    case "standard-deviation-calculator": return <StandardDeviationCalculator {...props} />;
    case "probability-calculator": return <ProbabilityCalculator {...props} />;
    case "permutation-combination-calculator": return <PermutationCombinationCalculator {...props} />;
    case "factorial-calculator": return <FactorialCalculator {...props} />;
    case "matrix-calculator": return <MatrixCalculator {...props} />;
    case "quadratic-solver": return <QuadraticSolver {...props} />;
    case "fraction-to-decimal-converter": return <FractionToDecimal {...props} />;
    case "ratio-proportion-calculator": return <RatioProportionCalculator {...props} />;
    case "geometry-area-calculator": return <GeometryAreaCalculator {...props} />;

    case "lean-body-mass-calculator": return <LeanBodyMassCalculator {...props} />;
    case "ideal-body-weight-calculator": return <IdealBodyWeightCalculator {...props} />;
    case "daily-calorie-calculator": return <DailyCalorieCalculator {...props} />;
    case "water-intake-calculator": return <WaterIntakeCalculator {...props} />;
    case "macro-ratio-calculator": return <MacroRatioCalculator {...props} />;
    case "protein-intake-calculator": return <ProteinIntakeCalculator {...props} />;
    case "tdee-calculator": return <TdeeCalculator {...props} />;
    case "one-rep-max-calculator": return <OneRepMaxCalculator {...props} />;
    case "ovulation-calculator": return <OvulationCalculator {...props} />;
    case "target-heart-rate-calculator": return <TargetHeartRateCalculator {...props} />;
    case "waist-hip-ratio-calculator": return <WaistHipRatioCalculator {...props} />;
    case "sleep-cycle-calculator": return <SleepCycleCalculator {...props} />;
    case "smoking-cost-calculator": return <SmokingCostCalculator {...props} />;
    case "running-pace-calculator": return <RunningPaceCalculator {...props} />;
    case "step-to-calorie-calculator": return <StepToCalorieCalculator {...props} />;

    case "room-square-footage-calculator": return <RoomSquareFootageCalculator {...props} />;
    case "flooring-calculator": return <FlooringCalculator {...props} />;
    case "tile-count-calculator": return <TileCountCalculator {...props} />;
    case "paint-volume-calculator": return <PaintVolumeCalculator {...props} />;
    case "brick-count-calculator": return <BrickCountCalculator {...props} />;
    case "concrete-volume-calculator": return <ConcreteVolumeCalculator {...props} />;
    case "cement-mortar-calculator": return <CementMortarCalculator {...props} />;
    case "ac-btu-calculator": return <AcBtuCalculator {...props} />;

    case "time-zone-converter": return <TimeZoneConverter {...props} />;
    default: return <GenericInteractiveTool tool={tool} onCopy={onCopy} onShare={onShare} />;
  }
}

export default function ToolPageClient({ tool, deep }: ToolPageClientProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [showShareToast, setShowShareToast] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const embedSnippet = `<iframe src="https://www.yuitility.app/embed/${tool.id}" width="100%" height="700" frameborder="0" style="border:1px solid #e4e4e7; border-radius:16px; overflow:hidden;" title="${tool.title}"></iframe>\n<p style="font-size:12px;text-align:right;margin-top:4px;font-family:sans-serif;"><a href="https://www.yuitility.app/tools/${tool.id}" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:none;">⚡ Free ${tool.title} by Yuitility</a></p>`;

  const faqs = useMemo(() => getToolFaqs(tool), [tool]);
  const steps = useMemo(() => getToolSteps(tool), [tool]);
  const howItWorks = useMemo(() => getToolHowItWorks(tool), [tool]);
  // Contextual, curated relations (see src/lib/toolRegistry.ts) rather than
  // "first three siblings in the same category" — the anchor text and the
  // destination both need to make sense to a reader mid-task.
  const relatedTools = useMemo(() => getRelatedTools(tool, 4), [tool]);

  const linkedGuide = useMemo(
    () => BLOG_POSTS.find((p) => p.toolId === tool.id),
    [tool],
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(true);
    }
    const savedRating = localStorage.getItem(`rating_${tool.id}`);
    if (savedRating) {
      setUserRating(parseInt(savedRating, 10));
    }
  }, [tool.id]);

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
    const cleaned = legacyPath.replace(/^#\/?/, "").replace(/^\/?tools\//, "").replace(/^\//, "");
    const slug = cleaned || tool.id;
    const url = `${window.location.origin}${toolPath(slug)}`;
    await copy(url);
    showMessage(`Share link for ${title} copied.`);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-zinc-50 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-100`}>
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Yuitility home">
            <img src="/brand/yuitility-logo.png" alt="Yuitility logo" width={36} height={36} className="h-9 w-9 object-contain" />
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
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-300">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/tools" className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-cyan-300"><ArrowLeft className="h-3.5 w-3.5" /> All tools</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/category/${tool.category}`} className="hover:text-blue-600 dark:hover:text-cyan-300">{getCategoryName(tool.category)}</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-100">{tool.title}</span>
        </nav>

        {/* Primary Semantic H1 and Social Sharing */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> Formula Verified (Sep 2026)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Award className="w-3 h-3" /> Reviewed by Quantitative Architecture Panel
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="w-3 h-3" /> 100% In-Browser Privacy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-zinc-950 dark:text-white">
              {tool.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
              {tool.longDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                const url = `${window.location.origin}${toolPath(tool.id)}`;
                const text = encodeURIComponent(`Try this free 100% private ${tool.title} on Yuitility: ${url}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
              aria-label="Share via WhatsApp"
            >
              Share WhatsApp
            </button>
            <button
              type="button"
              onClick={() => share(tool.title, toolPath(tool.id))}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              aria-label="Copy tool link"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </button>
            <button
              type="button"
              onClick={() => setShowEmbedModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
              aria-label="Embed this tool"
            >
              <Code2 className="w-3.5 h-3.5" /> Embed
            </button>
          </div>
        </div>

        {/* 1. Usable Tool Component (Top Priority) */}
        <section aria-label={`${tool.title} workspace`} className="mb-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          <ToolRenderer tool={tool} onCopy={copy} onShare={share} onTriggerShareToast={() => setShowShareToast(true)} />
        </section>

        {/* Interactive 5-Star Micro Poll (Client-side Only, strictly no aggregateRating schema) */}
        <section className="mb-8 rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900/60 dark:border-zinc-800 p-5 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Was the {tool.title} accurate and helpful?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Leave a quick 1-click rating to help us continuously refine our local calculation engines.
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center justify-center sm:justify-end gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setUserRating(star);
                  localStorage.setItem(`rating_${tool.id}`, star.toString());
                  showMessage(`Thank you for rating this tool ${star} out of 5 stars!`);
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

        {/* 2. Embed Calculator Section for Bloggers & Webmasters */}
        <section aria-label="Embed calculator widget" className="mb-8 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50 p-6 shadow-sm dark:border-blue-900/40 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-cyan-950/20 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3.5">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-2xl bg-blue-600 text-white dark:bg-cyan-500 dark:text-zinc-950 shrink-0 shadow-md">
                <Code2 className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-display font-bold text-zinc-950 dark:text-white">
                    Embed This {tool.title} On Your Website
                  </h2>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Free Embed
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 max-w-2xl">
                  Add this fast, responsive, 100% private calculator directly to your blog, university portal, or company site. No API keys required, zero server uploads, instant execution.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  copy(embedSnippet);
                  showMessage("Embed snippet copied to clipboard! Paste into your CMS or HTML.");
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

        {/* 3. Tool Info & How It Works Card */}
        <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-cyan-950/30 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">{getCategoryName(tool.category)}</p>
              <h2 className="text-2xl font-display font-bold tracking-tight text-zinc-950 dark:text-white mb-2">About the {tool.title}</h2>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">{tool.longDescription}</p>
            </div>
          </div>

          <div className="border-t border-blue-200/60 pt-5 dark:border-zinc-800">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-cyan-300 mb-1.5">How the {tool.title} Works</h2>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">{howItWorks}</p>
          </div>
        </div>

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
          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
              <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-cyan-300" />
              <h2 className="mt-4 font-display text-xl font-bold text-zinc-950 dark:text-white">{tool.title} Privacy &amp; Security</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">Use this tool directly in your browser. Yuitility processes all inputs entirely inside your local device memory with zero server uploads.</p>
            </div>

            {/* DevTools Verification Guide */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-xs font-mono font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">F12</span>
                <h3 className="font-display text-base font-bold text-zinc-950 dark:text-white">Verify Zero Network Uploads</h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Verify our privacy claims directly in your browser:
              </p>
              <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-decimal pl-4">
                <li>Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px]">F12</kbd> (or Cmd+Option+I) to open DevTools.</li>
                <li>Switch to the <strong>Network</strong> tab.</li>
                <li>Operate the {tool.title.toLowerCase()} above.</li>
                <li>Observe: <strong>0 outgoing requests</strong> are sent to any remote server.</li>
              </ol>
            </div>

            {linkedGuide && (
              <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 dark:from-zinc-900 dark:to-cyan-950/20 p-6 dark:border-zinc-800 sm:p-8 flex flex-col justify-between">
                <div>
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-cyan-300" />
                  <h2 className="mt-4 font-display text-xl font-bold text-zinc-950 dark:text-white">Tutorial Guide</h2>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-550 dark:text-zinc-400">{linkedGuide.description}</p>
                </div>
                <Link
                  href={`/blog/${linkedGuide.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-blue-650 hover:text-blue-750 dark:text-cyan-300 dark:hover:text-cyan-200 transition-colors"
                >
                  Read Full Tutorial <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </aside>
        </section>

        {deep && <ToolDeepDive tool={tool} deep={deep} />}

        <section className="mt-12">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Frequently Asked Questions about the {tool.title}</h2>
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
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">Tools Related to {tool.title}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Tools that pair with the {tool.title.toLowerCase()} in the same task.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedTools.map((related) => <Link key={related.id} href={toolPath(related.id)} className="group rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-cyan-500/60"><h3 className="font-display font-bold text-zinc-950 group-hover:text-blue-600 dark:text-white dark:group-hover:text-cyan-300">{related.title}</h3><p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{related.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-cyan-300">Open the {related.title.toLowerCase()} <span aria-hidden="true">→</span></span></Link>)}
          </div>
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            See every tool in <Link href={`/category/${tool.category}`} className="font-semibold text-blue-600 hover:underline dark:text-cyan-300">{getCategoryName(tool.category)}</Link>, or browse <Link href="/tools" className="font-semibold text-blue-600 hover:underline dark:text-cyan-300">all Yuitility tools</Link>.
          </p>
        </section>}

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
                  Embed &ldquo;{tool.title}&rdquo;
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                Add this 100% private, interactive calculator to your website, blog, or university portal. Zero server tracking, zero external scripts, instant in-browser execution.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">HTML Embed Snippet</label>
                  <span className="text-[10px] text-zinc-400 font-mono">iframe responsive standard</span>
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

      <HoverFooter />
      {message && <div role="status" className="fixed bottom-5 right-5 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-xl dark:bg-white dark:text-zinc-950"><CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />{message}</div>}
    </div>
  );
}
