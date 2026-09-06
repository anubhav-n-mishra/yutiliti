/**
 * Yuitility Google Search Console (GSC) Priority URL Inspection Trigger
 * 
 * Run with: node scripts/gsc-priority-urls.mjs
 * 
 * Google Search Console permits ~10-15 "Request Indexing" submissions per day via
 * the URL Inspection tool. Submitting these priority URLs forces Googlebot to re-render
 * the page, evaluate the updated title/meta tags, deep-dive content, and interactive
 * widgets, moving pages from Position ~80 onto Page 1 within 48-72 hours.
 */

const PRIORITY_URLS = [
  // --- Tier 1 High-CPC US / UK / CA Presets (New Rank Opportunities) ---
  {
    category: "High-CPC US Mortgage & Real Estate",
    url: "https://www.yuitility.app/tools/mortgage-calculator/30-year-fixed",
    intent: "US 30-Year Fixed Mortgage calculations (Avg CPC $12 - $18)",
    targetRank: "Page 1 (Target: 800 clicks/day)",
  },
  {
    category: "High-CPC US Mortgage & Real Estate",
    url: "https://www.yuitility.app/tools/mortgage-calculator/15-year-fixed",
    intent: "15-Year Fixed Home Loan comparison ($10+ CPC)",
    targetRank: "Page 1 (Target: 500 clicks/day)",
  },
  {
    category: "High-CPC US Mortgage & Real Estate",
    url: "https://www.yuitility.app/tools/mortgage-calculator/fha-loan",
    intent: "FHA Loan 3.5% down payment & MIP calculations",
    targetRank: "Page 1 (Target: 700 clicks/day)",
  },
  {
    category: "High-CPC US Mortgage & Real Estate",
    url: "https://www.yuitility.app/tools/mortgage-calculator/va-loan",
    intent: "0% down VA military loan with funding fee exemption",
    targetRank: "Page 1 (Target: 450 clicks/day)",
  },
  {
    category: "Canada & UK Wealth Presets",
    url: "https://www.yuitility.app/tools/mortgage-calculator/canada-cmhc",
    intent: "Canada CMHC default insurance mortgage schedule ($8+ CPC)",
    targetRank: "Page 1 (Target: 400 clicks/day)",
  },
  {
    category: "Canada & UK Wealth Presets",
    url: "https://www.yuitility.app/tools/mortgage-calculator/uk-repayment",
    intent: "UK Capital & Interest repayment mortgage schedule (£7+ CPC)",
    targetRank: "Page 1 (Target: 500 clicks/day)",
  },
  {
    category: "US Retirement & Wealth Building",
    url: "https://www.yuitility.app/tools/retirement-calculator/401k-growth",
    intent: "Employer 401(k) match and long-term nest egg forecast",
    targetRank: "Page 1 (Target: 600 clicks/day)",
  },
  {
    category: "US Retirement & Wealth Building",
    url: "https://www.yuitility.app/tools/retirement-calculator/roth-ira",
    intent: "Tax-free Roth IRA compound growth model",
    targetRank: "Page 1 (Target: 650 clicks/day)",
  },
  {
    category: "US Retirement & Wealth Building",
    url: "https://www.yuitility.app/tools/retirement-calculator/fire-movement",
    intent: "Financial Independence Retire Early (FIRE) 25x Rule",
    targetRank: "Page 1 (Target: 550 clicks/day)",
  },
  {
    category: "Compound Growth & Auto",
    url: "https://www.yuitility.app/tools/compound-interest-calculator/sp500-index",
    intent: "Historical 10% S&P 500 dollar-cost averaging simulator",
    targetRank: "Page 1 (Target: 700 clicks/day)",
  },
  {
    category: "Compound Growth & Auto",
    url: "https://www.yuitility.app/tools/car-loan-emi-calculator/60-month-auto-loan",
    intent: "US 5-year auto financing with trade-in allowance",
    targetRank: "Page 1 (Target: 500 clicks/day)",
  },

  // --- Top Impression Keywords From Search Console (Pos 70-85 Climbing Candidates) ---
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/death-calculator",
    intent: "Top impressions in GSC CSV; retitled and optimized for life expectancy",
    targetRank: "Move from Pos 82 -> Top 10 (2,000+ clicks/day potential)",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/mortgage-calculator",
    intent: "Core US mortgage calculator with new CSV export and stateful URLs",
    targetRank: "Move from Pos 78 -> Top 10",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/sip-calculator",
    intent: "SIP & Mutual Fund returns with annual Step-Up increments",
    targetRank: "Move from Pos 75 -> Top 10",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/car-loan-emi-calculator",
    intent: "Auto loan monthly payments with down payment & trade-in",
    targetRank: "Move from Pos 80 -> Top 10",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/compound-interest-calculator",
    intent: "Compound interest growth calculator with annual breakdown table",
    targetRank: "Move from Pos 84 -> Top 10",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/retirement-calculator",
    intent: "Retirement corpus & monthly SIP calculation with lifetime roadmap",
    targetRank: "Move from Pos 79 -> Top 10",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/markdown-viewer",
    intent: "Target #1 query: open md file (44k), markdown viewer (33k), md to pdf (23k), md to word (6.4k)",
    targetRank: "Move from Pos 78 -> Top 5 (10,000+ clicks/day target)",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/tools/markdown-viewer/github-readme",
    intent: "GitHub README.md viewer, badge renderer, and GFM editor",
    targetRank: "Page 1 (Target: 850 clicks/day)",
  },
  {
    category: "GSC High-Impression Climbers",
    url: "https://www.yuitility.app/blog/how-to-open-and-view-md-files-online",
    intent: "Comprehensive guide to opening, viewing, and converting MD to PDF/Word",
    targetRank: "Page 1 (Target: 1,200 clicks/day)",
  },

  // --- High Impression Expanded Guides (NavBoost Dwell Time Anchors) ---
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/resizing-images-without-quality-loss",
    intent: "Top impression query; expanded with Bicubic interpolation math & tables",
    targetRank: "Move from Pos 74 -> Top 5",
  },
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/extracting-zip-files-directly-in-browser",
    intent: "In-browser JSZip zero-upload security walkthrough",
    targetRank: "Move from Pos 77 -> Top 5",
  },
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/how-to-extract-specific-pdf-pages",
    intent: "Step-by-step local pdf-lib extraction tutorial",
    targetRank: "Move from Pos 81 -> Top 5",
  },
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/checking-wcag-color-contrast-accessibility",
    intent: "WCAG 2.1 AA/AAA relative luminance mathematical formula guide",
    targetRank: "Move from Pos 85 -> Top 5",
  },
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/editing-pdf-metadata-for-privacy",
    intent: "Redacting EXIF & PDF author metadata before emailing documents",
    targetRank: "Move from Pos 80 -> Top 5",
  },
  {
    category: "Comprehensive Educational Guides",
    url: "https://www.yuitility.app/blog/converting-images-to-pdf-locally",
    intent: "Lossless local image-to-PDF compilation guide",
    targetRank: "Move from Pos 83 -> Top 5",
  },
];

console.log("================================================================================");
console.log("             YUITILITY GOOGLE SEARCH CONSOLE PRIORITY RE-INDEXING LIST          ");
console.log("================================================================================\n");
console.log("Google allows ~10-15 manual 'Request Indexing' submissions per day via GSC.");
console.log("Submitting these exact URLs forces Googlebot to re-crawl within 24-48 hours,");
console.log("registering the title/meta optimization, interactive widgets, and deep content.\n");

console.log("--- BATCH 1: DAY 1 PRIORITY (Submit First 12 URLs in GSC Today) ---\n");
PRIORITY_URLS.slice(0, 12).forEach((item, index) => {
  console.log(`[${index + 1}] ${item.url}`);
  console.log(`    Target: ${item.intent}`);
  console.log(`    Goal  : ${item.targetRank}\n`);
});

console.log("--------------------------------------------------------------------------------");
console.log("--- BATCH 2: DAY 2 PRIORITY (Submit Next 11 URLs in GSC Tomorrow) ---\n");
PRIORITY_URLS.slice(12).forEach((item, index) => {
  console.log(`[${index + 13}] ${item.url}`);
  console.log(`    Target: ${item.intent}`);
  console.log(`    Goal  : ${item.targetRank}\n`);
});

console.log("================================================================================");
console.log("                        PLAIN COPY-PASTE LIST FOR GSC                           ");
console.log("================================================================================\n");
PRIORITY_URLS.forEach((item) => {
  console.log(item.url);
});
console.log("\n================================================================================");
console.log("How to submit:");
console.log("1. Open https://search.google.com/search-console");
console.log("2. Paste URL into the top search bar ('Inspect any URL in yuitility.app')");
console.log("3. Click 'TEST LIVE URL'");
console.log("4. Click 'REQUEST INDEXING'");
console.log("================================================================================\n");
