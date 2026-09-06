import { Tool } from "@/src/types";

export const SITE_NAME = "Yuitility";
export const SITE_URL = "https://www.yuitility.app";
export const SITE_DESCRIPTION =
  "Use 79+ free browser tools for PDFs, images, calculators & code. 100% private - everything runs locally in your tab with zero file uploads. Try it free!";

export const toolPath = (toolId: string) => `/tools/${toolId}`;

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

// ----------------------------------------------------------------------
// Category metadata — must cover every id in CATEGORIES except "all".
// scripts/seo-audit.mjs fails the build if a category is missing an entry.
// ----------------------------------------------------------------------

export type CategoryMeta = {
  name: string;
  /** <title> for /category/<id>. Written for humans, no keyword pipes. */
  title: string;
  /** Meta description AND the visible intro paragraph. */
  description: string;
  /** Extra on-page context so the listing is not a bare grid of links. */
  intro: string;
  /**
   * Optional sub-clusters for large categories.
   *
   * A 38-item grid is a list, not a topic. Grouping turns the category page
   * into a genuine pillar: named sub-topics, each with a sentence explaining
   * when you would reach for that group, and the tools underneath.
   * Tools not named in any group fall into a trailing "Everything else" block,
   * so nothing is ever silently dropped from the listing.
   */
  groups?: { name: string; blurb: string; toolIds: string[] }[];
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  finance: {
    name: "Finance & Wealth",
    title: "Finance Calculators: Loans, Investments & Tax | Yuitility",
    description:
      "EMI, SIP, FD, EPF, tax and net-worth calculators that show the formula and the full breakdown, not just a number. Nothing you type is sent anywhere.",
    intro:
      "Every calculator here shows its working: the formula used, the intermediate values, and the assumptions baked into the result. Money maths is worth checking, so we make it checkable. All calculations execute client-side using IEEE 754 floating-point arithmetic with zero server calls.",
    groups: [
      {
        name: "Loans and EMI",
        blurb:
          "All of these solve the reducing-balance repayment equation; they differ in their specific parameters. Start with the calculator that matches your loan category for accurate default rates, processing fees, and amortization schedules.",
        toolIds: [
          "emi-calculator",
          "loan-calculator",
          "home-loan-emi-calculator",
          "mortgage-calculator",
          "car-loan-emi-calculator",
          "bike-loan-emi-calculator",
          "personal-loan-emi-calculator",
          "education-loan-emi-calculator",
          "gold-loan-emi-calculator",
          "business-loan-emi-calculator",
          "credit-card-emi-calculator",
        ],
      },
      {
        name: "Investing and returns",
        blurb:
          "Projection tools for future wealth accumulation and return verification for past investments. Compare SIP vs lump-sum allocations, measure true CAGR across volatile markets, or compute IRR for periodic cash flows.",
        toolIds: [
          "sip-calculator",
          "mutual-fund-return-calculator",
          "swp-calculator",
          "cagr-calculator",
          "irr-calculator",
          "roi-calculator",
          "dividend-calculator",
          "stock-average-calculator",
          "compound-interest-calculator",
          "simple-interest-calculator",
          "interest-calculator",
        ],
      },
      {
        name: "Deposits, provident funds and retirement",
        blurb:
          "Fixed-return instruments and long-horizon retirement planning. We account for statutory compounding rules including quarterly bank compounding, 15-year PPF lock-in schedules, and NPS annuity allocations.",
        toolIds: [
          "fd-calculator",
          "rd-calculator",
          "ppf-calculator",
          "epf-calculator",
          "nps-calculator",
          "gratuity-calculator",
          "retirement-calculator",
        ],
      },
      {
        name: "Salary and tax",
        blurb:
          "Deconstruct annual CTC packages into take-home pay, compare old vs new income tax slabs, and determine exact HRA exemptions under Section 10(13A).",
        toolIds: [
          "salary-calculator",
          "income-tax-calculator",
          "hra-calculator",
          "gst-calculator",
        ],
      },
      {
        name: "Business and pricing",
        blurb:
          "Unit economics and commercial calculations: determine break-even sales volume, compare gross profit margins against markups, and calculate tiered sales commissions.",
        toolIds: [
          "break-even-calculator",
          "profit-margin-calculator",
          "discount-calculator",
          "commission-calculator",
        ],
      },
      {
        name: "Personal balance sheet",
        blurb:
          "Track your financial health today before planning future goals: aggregate assets and liabilities for true net worth and calculate your emergency fund runway.",
        toolIds: ["net-worth-calculator", "emergency-fund-calculator"],
      },
    ],
  },
  pdf: {
    name: "PDF Tools",
    title: "PDF Tools: Merge, Split & Compress in Browser | Yuitility",
    description:
      "Merge, split, compress, watermark and edit PDF metadata. Files are read into browser memory and processed on your own CPU - nothing is uploaded to a server.",
    intro:
      "Most free PDF web tools upload your sensitive documents to remote third-party servers. Yuitility runs pdf-lib directly inside WebAssembly and Web Workers in your browser tab. Confidential bank statements, tax forms, and signed agreements never touch external storage or servers.",
    groups: [
      {
        name: "Organize and assemble",
        blurb:
          "Combine multiple PDF documents, rearrange page order, extract individual chapters, or compile batches of image files into a single unified PDF.",
        toolIds: ["pdf-merger", "pdf-splitter", "image-to-pdf"],
      },
      {
        name: "Optimize and protect",
        blurb:
          "Downsample embedded images to reduce file size for email, apply custom text or visual watermarks, and inspect or sanitize document author metadata.",
        toolIds: ["pdf-compressor", "pdf-watermark", "pdf-metadata"],
      },
    ],
  },
  media: {
    name: "Image & Media",
    title: "Image Tools: Compress, Resize & Convert in Browser | Yuitility",
    description:
      "Compress, resize, convert and edit images entirely in your browser. No uploads, no watermarks, no account, and no queue behind other people's files.",
    intro:
      "Every image operation runs on HTML5 Canvas and WebAssembly inside your browser sandbox. Enjoy instant client-side execution with zero file upload wait times, zero server storage liabilities, and zero compression queues.",
    groups: [
      {
        name: "Compression and conversion",
        blurb:
          "Optimize bitmap images, reduce file sizes with fine quality control, resize dimensions with locked aspect ratios, and convert between WebP, PNG, JPEG, and GIF formats.",
        toolIds: ["image-compressor", "format-converter", "image-resizer"],
      },
      {
        name: "Creative and social utilities",
        blurb:
          "Erase backgrounds with in-browser AI segmentation, crop social media graphics for Instagram and LinkedIn, generate 1200x630 OG cards, and compile multi-photo collages.",
        toolIds: [
          "background-remover",
          "social-media-resizer",
          "og-image-generator",
          "favicon-generator",
          "photo-collage-maker",
          "meme-maker",
        ],
      },
    ],
  },
  developer: {
    name: "Developer & Text Tools",
    title: "Developer Tools: JSON, Hashing & Test Data | Yuitility",
    description:
      "Format JSON, generate secure passwords and mock datasets, build QR codes and favicons. Safe for real payloads because nothing is transmitted off-device.",
    intro:
      "Pasting confidential production payloads or authentication tokens into random web formatters creates severe compliance vulnerabilities. Yuitility processes developer payloads entirely in client-side memory so your proprietary data never leaks.",
    groups: [
      {
        name: "Data and formatting",
        blurb:
          "Format and validate minified JSON payloads with line-numbered syntax alerts, synthesize mock datasets for local databases, compute word counts, and decompress ZIP archives.",
        toolIds: [
          "json-formatter",
          "fake-data-generator",
          "word-counter",
          "zip-extractor",
        ],
      },
      {
        name: "Security and design",
        blurb:
          "Generate cryptographically secure passwords measured against Shannon entropy, encode dynamic QR codes, and construct WCAG-compliant accessible color palettes.",
        toolIds: [
          "password-generator",
          "qr-code-generator",
          "color-palette",
        ],
      },
    ],
  },
  utility: {
    name: "Everyday Utilities",
    title: "Everyday Utility Tools & Age Calculators | Yuitility",
    description:
      "Unit conversion, word counts, age and date maths, ZIP extraction. Small tools for the jobs that interrupt the job you were actually doing.",
    intro:
      "Everyday calculators designed for rapid, friction-free answers without paywalls, email capture, or popups. Calculate chronological age down to the day, verify school admission eligibility, or estimate due dates instantly.",
    groups: [
      {
        name: "Age and milestones",
        blurb:
          "Calculate chronological age in years, months, and days, convert human years to canine life stages by breed weight, and verify school age intake cut-offs.",
        toolIds: [
          "age-calculator",
          "age-calculator-in-months",
          "school-age-eligibility-calculator",
          "dog-age-calculator",
        ],
      },
      {
        name: "Dates and astrology",
        blurb:
          "Track pregnancy milestones and trimester timelines, or compute Western zodiac signs and astrological positions based on exact birth dates.",
        toolIds: [
          "pregnancy-due-date-calculator",
          "zodiac-age-calculator",
          "zodiac-sun-moon-calculator",
        ],
      },
    ],
  },
  math: {
    name: "Calculators & Maths",
    title: "Maths & Statistics Calculators | Yuitility",
    description:
      "Mean, median, modulo and general-purpose calculators that show the steps behind the answer so you can check the working, not just copy it.",
    intro:
      "A calculation without documented steps cannot be audited. Yuitility math tools render transparent calculation histories, explicit arithmetic formulas, and intermediate mathematical steps directly on-screen.",
    groups: [
      {
        name: "Everyday calculators",
        blurb:
          "Perform standard four-function arithmetic with tape memory, or calculate advanced scientific operations including trigonometric functions, logarithms, and powers.",
        toolIds: ["standard-calculator", "scientific-calculator"],
      },
      {
        name: "Statistics and discrete math",
        blurb:
          "Calculate arithmetic means, find data-set medians with sorted arrays, and compute true mathematical modulo with negative operand support.",
        toolIds: ["mean-calculator", "median-calculator", "mod-calculator"],
      },
    ],
  },
  health: {
    name: "Health & Lifestyle",
    title: "Health Calculators: BMI, BMR & Body Fat | Yuitility",
    description:
      "BMI, BMR and body-fat estimates using the named published formulas (Mifflin-St Jeor, US Navy), with the equation shown and its limits stated plainly.",
    intro:
      "Statistical health calculators based on established peer-reviewed physiological equations. We display the exact mathematical formulas used and highlight known clinical limitations so you can interpret results accurately.",
    groups: [
      {
        name: "Body composition",
        blurb:
          "Assess body mass index against WHO categories and estimate body fat percentage using the US Navy circumference method with lean mass breakdowns.",
        toolIds: ["bmi-calculator", "body-fat-calculator"],
      },
      {
        name: "Metabolism and longevity",
        blurb:
          "Estimate basal metabolic rate and daily energy expenditure using the Mifflin-St Jeor equation, and explore lifestyle longevity projections.",
        toolIds: ["bmr-calculator", "death-calculator"],
      },
    ],
  },
  conversion: {
    name: "Units & Conversion",
    title: "Unit & Currency Converters | Yuitility",
    description:
      "Convert length, mass, temperature, area, speed and currency. Exact conversion factors, shown alongside the result so you can verify the maths.",
    intro:
      "Unit conversion errors often go unnoticed because results seem plausible. Our converters display the exact multiplication factors and base SI units used, ensuring transparent and verifiable calculations.",
    groups: [
      {
        name: "Measurement and exchange",
        blurb:
          "Convert across imperial and metric physical units (length, weight, temperature, area), and check live currency exchange valuations.",
        toolIds: ["unit-converter", "currency-converter"],
      },
    ],
  },
};

export function getCategoryName(category: string) {
  return CATEGORY_META[category]?.name ?? category;
}

// ----------------------------------------------------------------------
// Per-tool titles and descriptions.
//
// Rules (enforced by scripts/seo-audit.mjs):
//   - <= 60 characters, no repeated "Free Online X Tool | Brand" boilerplate
//   - lead with the entity a searcher typed, then the distinguishing detail
//   - never stack synonyms ("Best X | X Online | Cheap X")
//   - descriptions must be unique and say something the competitor's does not
// ----------------------------------------------------------------------

const TOOL_SEO_TITLES: Record<string, string> = {
  // --- Loans -----------------------------------------------------------
  "emi-calculator": "EMI Calculator with Full Amortization Schedule",
  "loan-calculator": "Loan Calculator: Interest vs Principal Breakdown",
  "home-loan-emi-calculator": "Home Loan EMI Calculator with Yearly Schedule",
  "mortgage-calculator": "Mortgage Calculator with Tax, Insurance and HOA",
  "car-loan-emi-calculator": "Car Loan EMI Calculator with Down Payment",
  "bike-loan-emi-calculator": "Bike Loan EMI Calculator (Two-Wheeler Finance)",
  "personal-loan-emi-calculator": "Personal Loan EMI Calculator with Fees",
  "education-loan-emi-calculator": "Education Loan EMI Calculator with Moratorium",
  "gold-loan-emi-calculator": "Gold Loan EMI and Interest Calculator",
  "business-loan-emi-calculator": "Business Loan EMI and Total Cost Calculator",
  "credit-card-emi-calculator": "Credit Card EMI Calculator with True Cost",

  // --- Investing -------------------------------------------------------
  "sip-calculator": "SIP Calculator: Invested vs Returns, Year by Year",
  "mutual-fund-return-calculator": "Mutual Fund Return Calculator: SIP or Lump Sum",
  "swp-calculator": "SWP Calculator: Payouts and Corpus Depletion",
  "cagr-calculator": "CAGR Calculator with Year-on-Year Comparison",
  "irr-calculator": "IRR Calculator for Uneven Cash Flows",
  "roi-calculator": "ROI Calculator: Net Profit and Return Percent",
  "dividend-calculator": "Dividend Calculator: Yield and Monthly Income",
  "stock-average-calculator": "Stock Average Calculator (Weighted Cost Basis)",
  "compound-interest-calculator": "Compound Interest Calculator with Contributions",
  "simple-interest-calculator": "Simple Interest Calculator (I = P x R x T)",
  "interest-calculator": "Interest Calculator: Simple vs Compound Compared",

  // --- Deposits & retirement -------------------------------------------
  "fd-calculator": "FD Calculator with Quarterly Compounding",
  "rd-calculator": "RD Calculator: Month-by-Month Maturity Value",
  "ppf-calculator": "PPF Calculator: 15-Year Maturity Projection",
  "epf-calculator": "EPF Calculator: Corpus at Retirement",
  "nps-calculator": "NPS Calculator: Lump Sum and Annuity Split",
  "retirement-calculator": "Retirement Calculator with Inflation Adjustment",
  "gratuity-calculator": "Gratuity Calculator (Payment of Gratuity Act)",

  // --- Salary & tax ----------------------------------------------------
  "salary-calculator": "Salary Calculator: CTC to In-Hand Breakdown",
  "income-tax-calculator": "Income Tax Calculator with Slab-by-Slab Working",
  "hra-calculator": "HRA Exemption Calculator (Section 10(13A))",
  "gst-calculator": "GST Calculator: Inclusive, Exclusive, CGST/SGST",

  // --- Business --------------------------------------------------------
  "break-even-calculator": "Break-Even Calculator: Units and Revenue Needed",
  "profit-margin-calculator": "Profit Margin vs Markup Calculator",
  "discount-calculator": "Discount Calculator: Final Price and Savings",
  "commission-calculator": "Commission Calculator: Payout and Net Proceeds",
  "currency-converter": "Currency Converter for Everyday Conversions",
  "net-worth-calculator": "Net Worth Calculator: Assets Minus Liabilities",
  "emergency-fund-calculator": "Emergency Fund Calculator: How Many Months",

  // --- PDF -------------------------------------------------------------
  "pdf-merger": "Merge PDF Files Without Uploading Them",
  "pdf-splitter": "Split a PDF or Extract Specific Pages",
  "pdf-compressor": "Compress a PDF in Your Browser",
  "pdf-watermark": "Add a Watermark to a PDF Privately",
  "pdf-metadata": "Edit PDF Metadata: Title, Author, Keywords",
  "image-to-pdf": "Convert Images to PDF Without Uploading",

  // --- Images ----------------------------------------------------------
  "image-compressor": "Compress Images Without Uploading Them",
  "image-resizer": "Resize an Image by Pixels or Percentage",
  "format-converter": "Convert Images: WebP, PNG, JPEG, GIF",
  "background-remover": "Remove an Image Background in Your Browser",
  "social-media-resizer": "Social Media Image Sizes: Crop and Export",
  "photo-collage-maker": "Photo Collage Maker (No Upload, No Watermark)",
  "meme-maker": "Meme Maker with Classic Impact Captions",
  "og-image-generator": "Open Graph Image Generator (1200x630)",
  "favicon-generator": "Favicon Generator: ICO, PNG and Web Manifest",

  // --- Developer -------------------------------------------------------
  "json-formatter": "JSON Formatter and Validator with Error Lines",
  "password-generator": "Password Generator with Entropy Measurement",
  "fake-data-generator": "Fake Data Generator: JSON, CSV and SQL",
  "qr-code-generator": "QR Code Generator: URL, WiFi, Text, Email",
  "color-palette": "Color Palette Generator with WCAG Contrast",
  "zip-extractor": "Open and Extract a ZIP File in Your Browser",
  "word-counter": "Word Counter with Reading Time and Density",

  // --- Everyday / dates ------------------------------------------------
  "age-calculator": "Age Calculator: Exact Years, Months and Days",
  "age-calculator-in-months": "Age in Months Calculator (Also Weeks and Days)",
  "school-age-eligibility-calculator": "School Age Cut-Off Eligibility Checker",
  "zodiac-age-calculator": "Zodiac Sign and Age Calculator",
  "zodiac-sun-moon-calculator": "Sun, Moon and Rising Sign Calculator",
  "dog-age-calculator": "Dog Age Calculator by Breed Size",
  "pregnancy-due-date-calculator": "Pregnancy Due Date Calculator and Timeline",
  "unit-converter": "Unit Converter: Length, Mass, Temperature, Area",
  "standard-calculator": "Online Calculator with Memory and History",
  "scientific-calculator": "Scientific Calculator: Trig, Logs, Factorials",

  // --- Health ----------------------------------------------------------
  "bmi-calculator": "BMI Calculator with Category and Its Limits",
  "bmr-calculator": "BMR Calculator (Mifflin-St Jeor) and TDEE",
  "body-fat-calculator": "Body Fat Calculator (US Navy Method)",
  "death-calculator": "Life Expectancy Estimator from Lifestyle Factors",

  // --- Maths -----------------------------------------------------------
  "mean-calculator": "Mean Calculator with Step-by-Step Working",
  "median-calculator": "Median Calculator for Odd and Even Data Sets",
  "mod-calculator": "Modulo Calculator (A mod B) with Negatives",
};

const TOOL_SEO_DESCRIPTIONS: Record<string, string> = {
  "emi-calculator":
    "Work out your monthly EMI and see the full amortization schedule - how much of each payment is interest, and how that flips over the life of the loan.",
  "loan-calculator":
    "See what a loan actually costs: monthly payment, total interest, and the split between principal and interest for every year of the term.",
  "home-loan-emi-calculator":
    "Calculate your home loan EMI and see the year-by-year schedule, including how little principal you repay in the early years of a long tenure.",
  "mortgage-calculator":
    "Full PITI monthly payment: principal, interest, property tax, insurance and HOA - not just the loan repayment portion most calculators show.",
  "car-loan-emi-calculator":
    "Enter on-road price, down payment, rate and tenure to get your monthly car loan EMI plus the total interest a longer tenure actually costs you.",
  "bike-loan-emi-calculator":
    "Calculate two-wheeler loan EMI from on-road price and down payment, and compare how the down payment changes both EMI and total interest.",
  "personal-loan-emi-calculator":
    "Personal loan EMI including processing fees, so you compare the real cost of two offers rather than the headline interest rate alone.",
  "education-loan-emi-calculator":
    "Education loan EMI with a moratorium period - see how interest accrued during your course gets capitalised into the principal before repayment starts.",
  "gold-loan-emi-calculator":
    "Calculate gold loan EMI and total interest, with the reducing-balance maths shown so you can check it against your lender's quote.",
  "business-loan-emi-calculator":
    "Commercial loan EMI and total borrowing cost, so working-capital finance can be compared on total outflow rather than advertised rate.",
  "credit-card-emi-calculator":
    "Convert a card purchase to EMI and see the true cost: interest plus processing fee, expressed against the original purchase price.",

  "sip-calculator":
    "Project a SIP year by year and see invested capital separated from returns - the point where growth starts outpacing contributions is usually later than expected.",
  "mutual-fund-return-calculator":
    "Compare a lump sum against a monthly SIP for the same total investment and return rate, and see why the two end up in very different places.",
  "swp-calculator":
    "Model a systematic withdrawal plan: monthly payout, remaining corpus, and the year your corpus runs out at a given withdrawal rate.",
  "cagr-calculator":
    "Calculate the compound annual growth rate between two values, and see why CAGR smooths away the volatility that actually happened in between.",
  "irr-calculator":
    "Find the internal rate of return for an uneven series of cash flows, solved numerically - useful where CAGR cannot handle the shape of the cash flows.",
  "roi-calculator":
    "Calculate return on investment as both an absolute profit and a percentage, with the annualised equivalent so you can compare holdings of different lengths.",
  "dividend-calculator":
    "Calculate annual dividend income, the monthly average, and the yield on your actual cost basis rather than on the current share price.",
  "stock-average-calculator":
    "Work out your weighted average cost per share after averaging down or up, and see the break-even price you now need.",
  "compound-interest-calculator":
    "Compound interest with regular contributions, at your chosen compounding frequency, showing how much of the final balance is growth rather than deposits.",
  "simple-interest-calculator":
    "Simple interest using I = P x R x T, with the substitution written out so you can verify each figure rather than trust the total.",
  "interest-calculator":
    "Put simple and compound interest side by side on the same principal and rate to see exactly where and when the two curves diverge.",

  "fd-calculator":
    "Fixed deposit maturity with quarterly compounding, the convention most banks actually use - annual compounding will understate your return.",
  "rd-calculator":
    "Recurring deposit maturity that accounts for each instalment earning interest for a different length of time, which is where most RD estimates go wrong.",
  "ppf-calculator":
    "Project a PPF balance across the full 15-year lock-in, showing the contribution and the compounded interest components separately.",
  "epf-calculator":
    "Project your EPF corpus to retirement from basic salary, contribution rate and expected interest, with the annual accrual shown.",
  "nps-calculator":
    "Project an NPS corpus at 60 and see the mandated split: the lump sum you can withdraw and the portion that must buy an annuity.",
  "retirement-calculator":
    "Work out the corpus you need in future rupees, not today's - the inflation adjustment is what makes most retirement targets look far too small.",
  "gratuity-calculator":
    "Calculate gratuity under the Payment of Gratuity Act formula, including how partial years past the five-year threshold are rounded.",

  "salary-calculator":
    "Break an annual CTC into basic, HRA, allowances, EPF, professional tax and income tax, to get the number that actually reaches your bank account.",
  "income-tax-calculator":
    "Estimate income tax with the working shown slab by slab, plus your effective rate - which is always lower than the slab you say you are 'in'.",
  "hra-calculator":
    "Apply all three Section 10(13A) limbs and see which one caps your exemption - the binding constraint is rarely the one people assume.",
  "gst-calculator":
    "Add or strip GST at 5, 12, 18 or 28 percent, with the CGST/SGST split, and see why removing 18 percent is not the same as subtracting 18 percent.",

  "break-even-calculator":
    "Find the unit volume and revenue where contribution margin covers fixed costs, and see how sensitive that point is to a small price change.",
  "profit-margin-calculator":
    "Margin and markup from the same cost and price, side by side - the two are routinely confused and a 50 percent markup is not a 50 percent margin.",
  "discount-calculator":
    "Final price and money saved from a percentage discount, including stacked discounts, which do not add the way people expect.",
  "commission-calculator":
    "Commission payable and net proceeds to the seller, at flat or tiered rates, from gross sale value.",
  "currency-converter":
    "Convert between major currencies for everyday estimates. Rates are indicative - check your bank's rate before an actual transaction.",
  "net-worth-calculator":
    "Total assets minus total liabilities, itemised, so you can see which line item is actually moving your net worth year to year.",
  "emergency-fund-calculator":
    "Size an emergency fund against your essential monthly outgoings, and see how many months of runway your current savings already buy.",

  "pdf-merger":
    "Combine PDFs into one document and reorder pages first. Files are processed in browser memory and never uploaded, so contracts stay secure on your machine.",
  "pdf-splitter":
    "Pull specific pages or a page range out of a PDF into a new file. Runs entirely in your tab, so the original document is never uploaded anywhere.",
  "pdf-compressor":
    "Reduce PDF file size in your browser. Nothing is uploaded, so there is no size cap set by someone else's server and no copy left behind.",
  "pdf-watermark":
    "Stamp text or an image watermark onto a PDF with control over opacity, rotation and position - processed locally, so the document never leaves your device.",
  "pdf-metadata":
    "View and edit the title, author, subject and keywords embedded in a PDF. Useful before sharing a file that quietly carries your name or software version.",
  "image-to-pdf":
    "Turn JPG, PNG or WebP images into a single PDF, one image per page, entirely in your browser with no upload step.",

  "image-compressor":
    "Cut image file size with a live before-and-after comparison, so you can find the quality setting where the saving stops being worth it.",
  "image-resizer":
    "Resize by exact pixel dimensions or by percentage, with optional aspect-ratio lock, processed on your own device.",
  "format-converter":
    "Convert between WebP, PNG, JPEG, and GIF in your browser. Fast local conversion with zero file uploads - your media never leaves your device.",
  "background-remover":
    "Remove an image background and export a transparent PNG. The segmentation model runs locally in your browser - the photo is never uploaded.",
  "social-media-resizer":
    "Crop and export to the current post, story, banner and thumbnail dimensions for the major platforms, with the safe area shown.",
  "photo-collage-maker":
    "Arrange photos into a grid with adjustable spacing and background, exported at full resolution with no watermark and no upload.",
  "meme-maker":
    "Add top and bottom Impact captions to any image and export it. Runs locally, so your source image is not stored on a meme site's servers.",
  "og-image-generator":
    "Design a 1200x630 Open Graph card for a post or page and export it as PNG, so link previews stop falling back to your logo.",
  "favicon-generator":
    "Generate the full favicon set: ICO, PNG sizes modern browsers request, and web manifest entries from a single source image.",

  "json-formatter":
    "Format, minify and validate JSON with the failing line and column reported, so a missing comma in a large payload is findable. Nothing is transmitted.",
  "password-generator":
    "Generate passwords from the browser's cryptographic RNG and see the actual entropy in bits, so length and character-set choices can be compared honestly.",
  "fake-data-generator":
    "Generate realistic test names, emails, addresses and companies, exportable as JSON, CSV or SQL inserts, for seeding a development database.",
  "qr-code-generator":
    "Encode a URL, WiFi network, email or plain text as a QR code with custom colours and error-correction level, exported as PNG or SVG.",
  "color-palette":
    "Build a harmonious palette and check every pair against WCAG AA and AAA contrast thresholds before the colours reach production.",
  "zip-extractor":
    "Look inside a ZIP archive and pull individual files out of it in your browser - handy on a machine where you cannot install an extractor.",
  "word-counter":
    "Word, character, sentence and paragraph counts with reading time and keyword density, updating as you type.",

  "age-calculator":
    "Exact age in years, months and days, plus your birth weekday and a live countdown to your next birthday.",
  "age-calculator-in-months":
    "Total age expressed in months, weeks, days and hours - the format paediatric forms and school registrations usually ask for.",
  "school-age-eligibility-calculator":
    "Check a child's age against a school's cut-off date to see which intake year they fall into.",
  "zodiac-age-calculator":
    "Your zodiac sign, its element and your exact age from one date of birth.",
  "zodiac-sun-moon-calculator":
    "Sun, Moon and Rising sign positions calculated from birth date, time and place.",
  "dog-age-calculator":
    "Convert dog years to human years by breed size, using current veterinary ageing curves rather than the discredited multiply-by-seven rule.",
  "pregnancy-due-date-calculator":
    "Estimated due date and trimester milestones from your last menstrual period or conception date, with the method used stated.",
  "unit-converter":
    "Convert length, mass, temperature, area, volume and speed, with the exact conversion factor shown next to the result.",
  "standard-calculator":
    "A fast everyday calculator with memory keys and a visible calculation history, so you can check a step rather than start again.",
  "scientific-calculator":
    "Trigonometric, inverse and hyperbolic functions, logarithms, powers, roots, factorials and constants, with DEG/RAD switching and full expression entry.",

  "bmi-calculator":
    "Calculate BMI and its category, with a plain statement of where BMI is misleading: muscle mass, age, and body composition are not in the formula.",
  "bmr-calculator":
    "Basal metabolic rate via Mifflin-St Jeor, plus TDEE at each activity multiplier, with the equation shown so you can see what drives the number.",
  "body-fat-calculator":
    "Estimate body fat percentage using the US Navy circumference method, with lean and fat mass, and the measurement error the method carries.",
  "death-calculator":
    "A statistical life expectancy estimate from age, sex and lifestyle factors. An actuarial estimate for planning, not a medical prediction.",

  "mean-calculator":
    "Arithmetic mean with the sum and count shown, so the result can be checked rather than copied.",
  "median-calculator":
    "Median with the sorted data set displayed, and the two-middle-value average handled explicitly for even-sized sets.",
  "mod-calculator":
    "Modulo (A mod B) including negative operands, where JavaScript's remainder and true mathematical modulo disagree.",
};

export function getToolSeoTitle(tool: Tool): string {
  const base = TOOL_SEO_TITLES[tool.id] ?? tool.title;
  return `${base} | ${SITE_NAME}`;
}

/** The title without the brand suffix — used for the visible H1 context line. */
export function getToolHeadline(tool: Tool): string {
  return TOOL_SEO_TITLES[tool.id] ?? tool.title;
}

export function getToolSeoDescription(tool: Tool): string {
  const custom = TOOL_SEO_DESCRIPTIONS[tool.id];
  if (custom) return custom;
  return `${tool.description} Runs entirely in your browser - nothing you enter is uploaded.`;
}

export function getToolSteps(tool: Tool) {
  if (tool.category === "finance" || tool.category === "math") {
    return [
      "Enter the values for your own situation rather than the defaults.",
      `Adjust one input at a time and watch which one moves the ${tool.title.toLowerCase()} result most.`,
      "Check the working shown below the result before you rely on the number.",
    ];
  }

  if (
    tool.category === "pdf" ||
    tool.category === "media" ||
    /image|pdf|zip|collage|meme|favicon/i.test(tool.id)
  ) {
    return [
      "Choose or drag in the file you want to work with. It stays on your device.",
      "Set the options that match the output you need.",
      "Preview the result, then download it straight from your browser.",
    ];
  }

  return [
    "Add the text, values, or data you want to work with.",
    "Adjust the available settings and review the live result.",
    "Copy, export, or save the finished result when you are ready.",
  ];
}

export { getToolFaqs, getToolHowItWorks, hasHandWrittenFaqs } from "@/src/lib/toolContent";
