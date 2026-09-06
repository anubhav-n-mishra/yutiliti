import { Tool, TOOLS } from "@/src/types";

/**
 * Single source of truth for which tools actually have a working implementation.
 *
 * Every id in this set MUST have a matching `case` in ToolPageClient's ToolRenderer.
 * Anything not in this set falls through to a placeholder and is therefore:
 *   - excluded from the XML sitemap
 *   - served with `noindex, follow`
 *   - hidden from the homepage grid, /tools hub and category listings
 *
 * Rationale: shipping a page that promises "Standard Deviation Calculator" and
 * renders a generic X x Y multiplier is a broken promise to the searcher. Google
 * trialled ~50 such pages in Aug 2026 and withdrew them (see SEO_GROWTH_AUDIT.md).
 * They stay out of the index until they are genuinely built.
 *
 * See scripts/seo-audit.mjs — CI fails if this set and the renderer switch drift.
 */
export const IMPLEMENTED_TOOL_IDS: ReadonlySet<string> = new Set([
  "standard-calculator",
  "scientific-calculator",
  "emi-calculator",
  "sip-calculator",
  "age-calculator",
  "password-generator",
  "qr-code-generator",
  "word-counter",
  "image-compressor",
  "salary-calculator",
  "json-formatter",
  "color-palette",
  "pdf-merger",
  "pdf-splitter",
  "image-to-pdf",
  "pdf-watermark",
  "pdf-metadata",
  "pdf-rotator",
  "pdf-page-numbers",
  "pdf-page-remover",
  "background-remover",
  "image-resizer",
  "format-converter",
  "pdf-compressor",
  "zip-extractor",
  "unit-converter",
  "meme-maker",
  "favicon-generator",
  "og-image-generator",
  "social-media-resizer",
  "fake-data-generator",
  "photo-collage-maker",
  "age-calculator-in-months",
  "dog-age-calculator",
  "pregnancy-due-date-calculator",
  "retirement-calculator",
  "zodiac-age-calculator",
  "school-age-eligibility-calculator",
  "median-calculator",
  "mean-calculator",
  "mod-calculator",
  "zodiac-sun-moon-calculator",
  "bmi-calculator",
  "death-calculator",
  "loan-calculator",
  "education-loan-emi-calculator",
  "personal-loan-emi-calculator",
  "bike-loan-emi-calculator",
  "car-loan-emi-calculator",
  "home-loan-emi-calculator",
  "mortgage-calculator",
  "interest-calculator",
  "fd-calculator",
  "rd-calculator",
  "compound-interest-calculator",
  "simple-interest-calculator",
  "ppf-calculator",
  "gold-loan-emi-calculator",
  "business-loan-emi-calculator",
  "swp-calculator",
  "epf-calculator",
  "nps-calculator",
  "gratuity-calculator",
  "hra-calculator",
  "income-tax-calculator",
  "gst-calculator",
  "credit-card-emi-calculator",
  "net-worth-calculator",
  "emergency-fund-calculator",
  "roi-calculator",
  "cagr-calculator",
  "irr-calculator",
  "break-even-calculator",
  "profit-margin-calculator",
  "discount-calculator",
  "commission-calculator",
  "currency-converter",
  "mutual-fund-return-calculator",
  "dividend-calculator",
  "stock-average-calculator",
  "bmr-calculator",
  "body-fat-calculator",

  // Developer additions (10)
  "uuid-v4-generator",
  "base64-encoder-decoder",
  "url-encoder-decoder",
  "lorem-ipsum-generator",
  "hash-generator-md5-sha",
  "hex-color-converter",
  "morse-code-translator",
  "regex-tester",
  "markdown-to-html",
  "diff-checker",

  // Math additions (15)
  "percentage-calculator",
  "cgpa-calculator",
  "cgpa-to-percentage-calculator",
  "gpa-calculator",
  "date-difference-calculator",
  "mode-frequency-calculator",
  "standard-deviation-calculator",
  "probability-calculator",
  "permutation-combination-calculator",
  "factorial-calculator",
  "matrix-calculator",
  "quadratic-solver",
  "fraction-to-decimal-converter",
  "ratio-proportion-calculator",
  "geometry-area-calculator",

  // Health additions (15)
  "lean-body-mass-calculator",
  "ideal-body-weight-calculator",
  "daily-calorie-calculator",
  "water-intake-calculator",
  "macro-ratio-calculator",
  "protein-intake-calculator",
  "tdee-calculator",
  "one-rep-max-calculator",
  "ovulation-calculator",
  "target-heart-rate-calculator",
  "waist-hip-ratio-calculator",
  "sleep-cycle-calculator",
  "smoking-cost-calculator",
  "running-pace-calculator",
  "step-to-calorie-calculator",

  // Utility additions (8)
  "room-square-footage-calculator",
  "flooring-calculator",
  "tile-count-calculator",
  "paint-volume-calculator",
  "brick-count-calculator",
  "concrete-volume-calculator",
  "cement-mortar-calculator",
  "ac-btu-calculator",

  // Conversion additions (1)
  "time-zone-converter",
]);

export const isToolLive = (id: string): boolean =>
  IMPLEMENTED_TOOL_IDS.has(id);

/** De-duplicated tool list. TOOLS may contain repeated ids; first entry wins. */
export const UNIQUE_TOOLS: Tool[] = TOOLS.filter(
  (tool, index) => TOOLS.findIndex((t) => t.id === tool.id) === index,
);

/** Tools that are built, working and safe to index. */
export const LIVE_TOOLS: Tool[] = UNIQUE_TOOLS.filter(
  (tool) => !tool.disabled && isToolLive(tool.id),
);

/** Declared in TOOLS but not yet implemented. Reachable, but never indexed. */
export const PLANNED_TOOLS: Tool[] = UNIQUE_TOOLS.filter(
  (tool) => !isToolLive(tool.id),
);

export const getToolById = (id: string): Tool | undefined =>
  UNIQUE_TOOLS.find((tool) => tool.id === id);

export const liveToolsInCategory = (category: string): Tool[] =>
  LIVE_TOOLS.filter((tool) => tool.category === category);

/**
 * Curated contextual relationships.
 *
 * These are the "someone doing X very often needs Y next" pairings, not
 * "same category, first three alphabetically". Contextual links carry the
 * topical signal; arbitrary sibling links do not.
 *
 * Only live tool ids belong here — validated by scripts/seo-audit.mjs.
 */
export const RELATED_TOOLS: Record<string, string[]> = {
  // Loan cluster: the decision chain is amount -> EMI -> affordability -> total cost
  "emi-calculator": ["loan-calculator", "home-loan-emi-calculator", "car-loan-emi-calculator", "interest-calculator"],
  "loan-calculator": ["emi-calculator", "interest-calculator", "personal-loan-emi-calculator"],
  "home-loan-emi-calculator": ["mortgage-calculator", "emi-calculator", "hra-calculator", "net-worth-calculator"],
  "mortgage-calculator": ["home-loan-emi-calculator", "emi-calculator", "net-worth-calculator"],
  "car-loan-emi-calculator": ["bike-loan-emi-calculator", "emi-calculator", "loan-calculator"],
  "bike-loan-emi-calculator": ["car-loan-emi-calculator", "emi-calculator", "personal-loan-emi-calculator"],
  "personal-loan-emi-calculator": ["credit-card-emi-calculator", "emi-calculator", "gold-loan-emi-calculator"],
  "education-loan-emi-calculator": ["emi-calculator", "personal-loan-emi-calculator", "salary-calculator"],
  "gold-loan-emi-calculator": ["personal-loan-emi-calculator", "emi-calculator", "interest-calculator"],
  "business-loan-emi-calculator": ["emi-calculator", "break-even-calculator", "profit-margin-calculator"],
  "credit-card-emi-calculator": ["personal-loan-emi-calculator", "emi-calculator", "discount-calculator"],

  // Investing cluster
  "sip-calculator": ["mutual-fund-return-calculator", "swp-calculator", "cagr-calculator", "retirement-calculator"],
  "mutual-fund-return-calculator": ["sip-calculator", "cagr-calculator", "swp-calculator"],
  "swp-calculator": ["sip-calculator", "mutual-fund-return-calculator", "retirement-calculator"],
  "cagr-calculator": ["roi-calculator", "irr-calculator", "mutual-fund-return-calculator"],
  "irr-calculator": ["cagr-calculator", "roi-calculator", "break-even-calculator"],
  "roi-calculator": ["cagr-calculator", "irr-calculator", "profit-margin-calculator"],
  "dividend-calculator": ["stock-average-calculator", "roi-calculator", "sip-calculator"],
  "stock-average-calculator": ["dividend-calculator", "roi-calculator", "cagr-calculator"],
  "compound-interest-calculator": ["simple-interest-calculator", "interest-calculator", "sip-calculator", "fd-calculator"],
  "simple-interest-calculator": ["compound-interest-calculator", "interest-calculator", "emi-calculator"],
  "interest-calculator": ["compound-interest-calculator", "simple-interest-calculator", "fd-calculator"],

  // Deposits & retirement
  "fd-calculator": ["rd-calculator", "compound-interest-calculator", "ppf-calculator"],
  "rd-calculator": ["fd-calculator", "sip-calculator", "compound-interest-calculator"],
  "ppf-calculator": ["epf-calculator", "fd-calculator", "retirement-calculator"],
  "epf-calculator": ["ppf-calculator", "nps-calculator", "gratuity-calculator", "salary-calculator"],
  "nps-calculator": ["epf-calculator", "retirement-calculator", "ppf-calculator"],
  "retirement-calculator": ["nps-calculator", "sip-calculator", "swp-calculator", "emergency-fund-calculator"],
  "gratuity-calculator": ["epf-calculator", "salary-calculator", "hra-calculator"],

  // Salary & tax
  "salary-calculator": ["income-tax-calculator", "hra-calculator", "epf-calculator", "gratuity-calculator"],
  "income-tax-calculator": ["salary-calculator", "hra-calculator", "gst-calculator"],
  "hra-calculator": ["salary-calculator", "income-tax-calculator", "epf-calculator"],
  "gst-calculator": ["discount-calculator", "profit-margin-calculator", "income-tax-calculator"],

  // Business maths
  "break-even-calculator": ["profit-margin-calculator", "commission-calculator", "business-loan-emi-calculator"],
  "profit-margin-calculator": ["break-even-calculator", "discount-calculator", "commission-calculator"],
  "commission-calculator": ["profit-margin-calculator", "discount-calculator", "break-even-calculator"],
  "discount-calculator": ["gst-calculator", "profit-margin-calculator", "commission-calculator"],
  "currency-converter": ["unit-converter", "gst-calculator", "discount-calculator"],
  "net-worth-calculator": ["emergency-fund-calculator", "retirement-calculator", "home-loan-emi-calculator"],
  "emergency-fund-calculator": ["net-worth-calculator", "retirement-calculator", "salary-calculator"],

  // PDF cluster: the real workflow is split -> merge -> compress -> watermark
  "pdf-splitter": ["pdf-merger", "pdf-compressor", "image-to-pdf", "pdf-metadata"],
  "pdf-merger": ["pdf-splitter", "pdf-compressor", "image-to-pdf", "pdf-watermark"],
  "pdf-compressor": ["pdf-merger", "pdf-splitter", "image-compressor"],
  "pdf-watermark": ["pdf-metadata", "pdf-merger", "pdf-splitter", "pdf-page-numbers"],
  "pdf-metadata": ["pdf-watermark", "pdf-merger", "pdf-splitter"],
  "image-to-pdf": ["pdf-merger", "pdf-compressor", "image-compressor", "format-converter"],
  "pdf-rotator": ["pdf-splitter", "pdf-merger", "pdf-page-remover", "pdf-page-numbers"],
  "pdf-page-numbers": ["pdf-watermark", "pdf-merger", "pdf-splitter", "pdf-rotator"],
  "pdf-page-remover": ["pdf-splitter", "pdf-rotator", "pdf-merger", "pdf-compressor"],

  // Image cluster
  "image-compressor": ["image-resizer", "format-converter", "social-media-resizer", "pdf-compressor"],
  "image-resizer": ["image-compressor", "social-media-resizer", "format-converter"],
  "format-converter": ["image-compressor", "image-resizer", "favicon-generator"],
  "social-media-resizer": ["image-resizer", "og-image-generator", "photo-collage-maker"],
  "background-remover": ["image-resizer", "photo-collage-maker", "format-converter"],
  "photo-collage-maker": ["social-media-resizer", "meme-maker", "image-resizer"],
  "meme-maker": ["photo-collage-maker", "social-media-resizer", "image-resizer"],
  "og-image-generator": ["social-media-resizer", "favicon-generator", "color-palette"],
  "favicon-generator": ["og-image-generator", "format-converter", "color-palette"],

  // Developer cluster
  "json-formatter": ["fake-data-generator", "word-counter", "password-generator"],
  "password-generator": ["json-formatter", "fake-data-generator", "qr-code-generator"],
  "fake-data-generator": ["json-formatter", "password-generator", "word-counter"],
  "qr-code-generator": ["favicon-generator", "password-generator", "og-image-generator"],
  "color-palette": ["og-image-generator", "favicon-generator", "format-converter"],
  "zip-extractor": ["pdf-compressor", "image-compressor", "format-converter"],
  "word-counter": ["json-formatter", "fake-data-generator", "median-calculator"],

  // Everyday / date / health
  "age-calculator": ["age-calculator-in-months", "zodiac-age-calculator", "school-age-eligibility-calculator", "date-difference-calculator"],
  "age-calculator-in-months": ["age-calculator", "school-age-eligibility-calculator", "pregnancy-due-date-calculator", "date-difference-calculator"],
  "school-age-eligibility-calculator": ["age-calculator", "age-calculator-in-months", "date-difference-calculator"],
  "zodiac-age-calculator": ["zodiac-sun-moon-calculator", "age-calculator", "date-difference-calculator"],
  "zodiac-sun-moon-calculator": ["zodiac-age-calculator", "age-calculator", "date-difference-calculator"],
  "dog-age-calculator": ["age-calculator", "age-calculator-in-months", "date-difference-calculator"],
  "pregnancy-due-date-calculator": ["age-calculator-in-months", "age-calculator", "bmi-calculator", "ovulation-calculator"],
  "bmi-calculator": ["bmr-calculator", "body-fat-calculator", "death-calculator", "ideal-body-weight-calculator"],
  "bmr-calculator": ["bmi-calculator", "body-fat-calculator", "tdee-calculator", "daily-calorie-calculator"],
  "body-fat-calculator": ["bmi-calculator", "bmr-calculator", "ideal-body-weight-calculator", "lean-body-mass-calculator"],
  "death-calculator": ["bmi-calculator", "retirement-calculator", "age-calculator"],

  // Maths / conversion
  "mean-calculator": ["median-calculator", "mod-calculator", "standard-deviation-calculator", "word-counter"],
  "median-calculator": ["mean-calculator", "mod-calculator", "standard-deviation-calculator", "mode-frequency-calculator"],
  "mod-calculator": ["mean-calculator", "median-calculator", "scientific-calculator"],
  "standard-calculator": ["scientific-calculator", "unit-converter", "discount-calculator"],
  "scientific-calculator": ["standard-calculator", "mod-calculator", "unit-converter"],
  "unit-converter": ["currency-converter", "standard-calculator", "scientific-calculator", "time-zone-converter"],

  // Developer additions
  "uuid-v4-generator": ["hash-generator-md5-sha", "password-generator", "fake-data-generator"],
  "base64-encoder-decoder": ["url-encoder-decoder", "hash-generator-md5-sha", "json-formatter"],
  "url-encoder-decoder": ["base64-encoder-decoder", "qr-code-generator", "json-formatter"],
  "lorem-ipsum-generator": ["word-counter", "fake-data-generator", "markdown-to-html"],
  "hash-generator-md5-sha": ["uuid-v4-generator", "base64-encoder-decoder", "password-generator"],
  "hex-color-converter": ["color-palette", "og-image-generator", "favicon-generator"],
  "morse-code-translator": ["base64-encoder-decoder", "url-encoder-decoder", "word-counter"],
  "regex-tester": ["diff-checker", "word-counter", "json-formatter"],
  "markdown-to-html": ["diff-checker", "word-counter", "lorem-ipsum-generator"],
  "diff-checker": ["markdown-to-html", "regex-tester", "word-counter"],

  // Math cluster
  "percentage-calculator": ["discount-calculator", "cagr-calculator", "ratio-proportion-calculator", "fraction-to-decimal-converter"],
  "cgpa-calculator": ["cgpa-to-percentage-calculator", "gpa-calculator", "percentage-calculator"],
  "cgpa-to-percentage-calculator": ["cgpa-calculator", "gpa-calculator", "percentage-calculator"],
  "gpa-calculator": ["cgpa-calculator", "cgpa-to-percentage-calculator", "percentage-calculator"],
  "date-difference-calculator": ["age-calculator", "time-zone-converter", "pregnancy-due-date-calculator"],
  "mode-frequency-calculator": ["mean-calculator", "median-calculator", "standard-deviation-calculator"],
  "standard-deviation-calculator": ["mean-calculator", "median-calculator", "mode-frequency-calculator"],
  "probability-calculator": ["permutation-combination-calculator", "factorial-calculator", "percentage-calculator"],
  "permutation-combination-calculator": ["probability-calculator", "factorial-calculator", "scientific-calculator"],
  "factorial-calculator": ["permutation-combination-calculator", "probability-calculator", "scientific-calculator"],
  "matrix-calculator": ["quadratic-solver", "scientific-calculator", "standard-calculator"],
  "quadratic-solver": ["matrix-calculator", "scientific-calculator", "geometry-area-calculator"],
  "fraction-to-decimal-converter": ["percentage-calculator", "ratio-proportion-calculator", "unit-converter"],
  "ratio-proportion-calculator": ["percentage-calculator", "fraction-to-decimal-converter", "unit-converter"],
  "geometry-area-calculator": ["room-square-footage-calculator", "tile-count-calculator", "flooring-calculator"],

  // Health cluster
  "lean-body-mass-calculator": ["body-fat-calculator", "ideal-body-weight-calculator", "bmr-calculator", "tdee-calculator"],
  "ideal-body-weight-calculator": ["bmi-calculator", "lean-body-mass-calculator", "daily-calorie-calculator"],
  "daily-calorie-calculator": ["tdee-calculator", "bmr-calculator", "macro-ratio-calculator", "protein-intake-calculator"],
  "tdee-calculator": ["daily-calorie-calculator", "bmr-calculator", "macro-ratio-calculator", "step-to-calorie-calculator"],
  "water-intake-calculator": ["daily-calorie-calculator", "running-pace-calculator", "step-to-calorie-calculator"],
  "macro-ratio-calculator": ["daily-calorie-calculator", "protein-intake-calculator", "tdee-calculator"],
  "protein-intake-calculator": ["macro-ratio-calculator", "daily-calorie-calculator", "one-rep-max-calculator"],
  "one-rep-max-calculator": ["protein-intake-calculator", "target-heart-rate-calculator", "daily-calorie-calculator"],
  "ovulation-calculator": ["pregnancy-due-date-calculator", "date-difference-calculator", "sleep-cycle-calculator"],
  "target-heart-rate-calculator": ["running-pace-calculator", "step-to-calorie-calculator", "tdee-calculator"],
  "waist-hip-ratio-calculator": ["bmi-calculator", "body-fat-calculator", "lean-body-mass-calculator"],
  "sleep-cycle-calculator": ["tdee-calculator", "target-heart-rate-calculator", "daily-calorie-calculator"],
  "smoking-cost-calculator": ["death-calculator", "retirement-calculator", "emergency-fund-calculator", "sip-calculator"],
  "running-pace-calculator": ["step-to-calorie-calculator", "target-heart-rate-calculator", "unit-converter"],
  "step-to-calorie-calculator": ["running-pace-calculator", "tdee-calculator", "daily-calorie-calculator"],

  // Utility cluster
  "room-square-footage-calculator": ["flooring-calculator", "tile-count-calculator", "paint-volume-calculator", "ac-btu-calculator"],
  "flooring-calculator": ["room-square-footage-calculator", "tile-count-calculator", "paint-volume-calculator"],
  "tile-count-calculator": ["flooring-calculator", "room-square-footage-calculator", "cement-mortar-calculator"],
  "paint-volume-calculator": ["room-square-footage-calculator", "flooring-calculator", "ac-btu-calculator"],
  "brick-count-calculator": ["cement-mortar-calculator", "concrete-volume-calculator", "room-square-footage-calculator"],
  "concrete-volume-calculator": ["cement-mortar-calculator", "brick-count-calculator", "room-square-footage-calculator"],
  "cement-mortar-calculator": ["concrete-volume-calculator", "brick-count-calculator", "tile-count-calculator"],
  "ac-btu-calculator": ["room-square-footage-calculator", "paint-volume-calculator", "flooring-calculator"],

  // Conversion cluster
  "time-zone-converter": ["date-difference-calculator", "unit-converter", "currency-converter"],
};

/**
 * Contextual related tools, falling back to same-category siblings so every
 * page has outbound links even before it gets a curated entry.
 */
export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  const curated = (RELATED_TOOLS[tool.id] ?? [])
    .map(getToolById)
    .filter((t): t is Tool => Boolean(t) && isToolLive(t!.id));

  if (curated.length >= limit) return curated.slice(0, limit);

  const fallback = liveToolsInCategory(tool.category).filter(
    (candidate) =>
      candidate.id !== tool.id && !curated.some((c) => c.id === candidate.id),
  );

  return [...curated, ...fallback].slice(0, limit);
}
