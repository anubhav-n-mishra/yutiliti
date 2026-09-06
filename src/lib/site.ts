import { Tool } from "@/src/types";

export const SITE_NAME = "Yuitility";
export const SITE_URL = "https://www.yuitility.app";
export const SITE_DESCRIPTION =
  "Use 82+ free browser tools for PDFs, images, calculators & code. 100% private - everything runs locally in your tab with zero file uploads. Try it free!";

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
          "Combine multiple PDF documents, rearrange page order, extract individual chapters, rotate pages, remove blank sheets, or compile batches of images.",
        toolIds: ["pdf-merger", "pdf-splitter", "pdf-rotator", "pdf-page-remover", "image-to-pdf"],
      },
      {
        name: "Optimize and protect",
        blurb:
          "Downsample embedded images to reduce file size, apply custom text watermarks, insert page numbers, and inspect or sanitize document author metadata.",
        toolIds: ["pdf-compressor", "pdf-watermark", "pdf-page-numbers", "pdf-metadata"],
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
          "markdown-to-html",
          "diff-checker",
          "lorem-ipsum-generator",
        ],
      },
      {
        name: "Security, encoding and regex",
        blurb:
          "Generate cryptographically secure passwords and UUIDs, encode Base64 and URLs, hash strings with Web Crypto, test regular expressions, and convert color codes.",
        toolIds: [
          "password-generator",
          "uuid-v4-generator",
          "hash-generator-md5-sha",
          "base64-encoder-decoder",
          "url-encoder-decoder",
          "regex-tester",
          "hex-color-converter",
          "morse-code-translator",
          "qr-code-generator",
          "color-palette",
        ],
      },
    ],
  },
  utility: {
    name: "Everyday Utilities",
    title: "Everyday Utility Tools & Construction Estimators | Yuitility",
    description:
      "Unit conversion, construction estimation, age and date maths, ZIP extraction. Practical zero-upload tools for home improvement, planning, and everyday life.",
    intro:
      "Everyday calculators designed for rapid, friction-free answers without paywalls, email capture, or popups. Calculate chronological age, plan building materials, or size cooling systems instantly.",
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
      {
        name: "Construction and home estimation",
        blurb:
          "Calculate flooring boxes, tile counts, wall paint gallons, brick quantities, concrete slabs, mortar mixtures, room square footage, and AC BTU tonnage.",
        toolIds: [
          "room-square-footage-calculator",
          "flooring-calculator",
          "tile-count-calculator",
          "paint-volume-calculator",
          "brick-count-calculator",
          "concrete-volume-calculator",
          "cement-mortar-calculator",
          "ac-btu-calculator",
        ],
      },
    ],
  },
  math: {
    name: "Calculators & Maths",
    title: "Maths, Algebra & Statistics Calculators | Yuitility",
    description:
      "Step-by-step math, algebra, geometry and statistics calculators that show the complete working and formulas behind the answer.",
    intro:
      "A calculation without documented steps cannot be audited. Yuitility math tools render transparent calculation histories, explicit arithmetic formulas, and intermediate mathematical steps directly on-screen.",
    groups: [
      {
        name: "Everyday and academic calculators",
        blurb:
          "Perform standard and scientific arithmetic, calculate percentages and fractions, compute college GPA, and convert university CGPA to percentages.",
        toolIds: [
          "standard-calculator",
          "scientific-calculator",
          "percentage-calculator",
          "cgpa-calculator",
          "cgpa-to-percentage-calculator",
          "gpa-calculator",
          "fraction-to-decimal-converter",
          "ratio-proportion-calculator",
        ],
      },
      {
        name: "Statistics, dates and probability",
        blurb:
          "Calculate mean, median, mode frequencies, standard deviations, probability events, permutations, combinations, factorials, and exact date differences.",
        toolIds: [
          "mean-calculator",
          "median-calculator",
          "mode-frequency-calculator",
          "standard-deviation-calculator",
          "probability-calculator",
          "permutation-combination-calculator",
          "factorial-calculator",
          "date-difference-calculator",
          "mod-calculator",
        ],
      },
      {
        name: "Algebra and geometry",
        blurb:
          "Solve quadratic equations with real and complex roots, perform matrix arithmetic and determinants, and calculate 2D geometric surface areas.",
        toolIds: [
          "quadratic-solver",
          "matrix-calculator",
          "geometry-area-calculator",
        ],
      },
    ],
  },
  health: {
    name: "Health & Lifestyle",
    title: "Health & Fitness Calculators: Calories, Macros & Vitals | Yuitility",
    description:
      "BMI, BMR, TDEE, calories, macros, protein, heart rate, and body composition estimates using validated scientific formulas with zero tracking.",
    intro:
      "Statistical health calculators based on established peer-reviewed physiological equations. We display the exact mathematical formulas used and highlight known clinical limitations so you can interpret results accurately.",
    groups: [
      {
        name: "Body composition and weight",
        blurb:
          "Assess body mass index, estimate lean body mass with Boer/James/Hume formulas, calculate ideal body weight, and measure waist-to-hip cardiovascular ratios.",
        toolIds: [
          "bmi-calculator",
          "body-fat-calculator",
          "lean-body-mass-calculator",
          "ideal-body-weight-calculator",
          "waist-hip-ratio-calculator",
        ],
      },
      {
        name: "Nutrition and energy expenditure",
        blurb:
          "Calculate basal metabolic rate (BMR), total daily energy expenditure (TDEE), daily calorie deficits, macronutrient splits, protein targets, and hydration goals.",
        toolIds: [
          "bmr-calculator",
          "tdee-calculator",
          "daily-calorie-calculator",
          "macro-ratio-calculator",
          "protein-intake-calculator",
          "water-intake-calculator",
        ],
      },
      {
        name: "Fitness, sleep and longevity",
        blurb:
          "Estimate one-rep max strength loads, determine target heart rate zones, calculate running paces, convert steps to calories, plan sleep cycles, and evaluate smoking costs.",
        toolIds: [
          "one-rep-max-calculator",
          "target-heart-rate-calculator",
          "running-pace-calculator",
          "step-to-calorie-calculator",
          "sleep-cycle-calculator",
          "ovulation-calculator",
          "smoking-cost-calculator",
          "death-calculator",
        ],
      },
    ],
  },
  conversion: {
    name: "Units & Conversion",
    title: "Unit, Time Zone & Currency Converters | Yuitility",
    description:
      "Convert length, mass, temperature, area, world time zones and currency. Exact conversion factors, shown alongside the result so you can verify the maths.",
    intro:
      "Unit conversion errors often go unnoticed because results seem plausible. Our converters display the exact multiplication factors and base SI units used, ensuring transparent and verifiable calculations.",
    groups: [
      {
        name: "Measurement and exchange",
        blurb:
          "Convert across imperial and metric physical units (length, weight, temperature, area), compare global time zones for meetings, and check live currency valuations.",
        toolIds: ["unit-converter", "currency-converter", "time-zone-converter"],
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
  "pdf-rotator": "Rotate PDF Pages 90, 180 or 270 Degrees",
  "pdf-page-numbers": "Add Page Numbers and Footers to a PDF",
  "pdf-page-remover": "Remove or Delete Pages from a PDF",
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

  // --- Developer additions ---------------------------------------------
  "uuid-v4-generator": "UUID v4 & GUID Generator: Bulk Random IDs",
  "base64-encoder-decoder": "Base64 Encoder & Decoder for Text and Files",
  "url-encoder-decoder": "URL Encoder & Decoder: RFC 3986 Safe Encoding",
  "lorem-ipsum-generator": "Lorem Ipsum Generator: Dummy Text & Filler",
  "hash-generator-md5-sha": "MD5 & SHA256 Hash Generator in Browser",
  "hex-color-converter": "HEX to RGB & HSL Color Code Converter",
  "morse-code-translator": "Morse Code Translator: Text to Audio & Beeps",
  "regex-tester": "RegEx Tester and Matcher with Explanations",
  "markdown-to-html": "Markdown to HTML Converter with Live Preview",
  "diff-checker": "Text Diff Checker: Compare Two Texts Online",

  // --- Math additions --------------------------------------------------
  "percentage-calculator": "Percentage Calculator: 4 Common Modes & Steps",
  "cgpa-calculator": "CGPA Calculator with Semester Credits & Target",
  "cgpa-to-percentage-calculator": "CGPA to Percentage Converter (CBSE & Engineering)",
  "gpa-calculator": "GPA Calculator: 4.0 College Grade Scale",
  "date-difference-calculator": "Date Difference Calculator: Days, Weeks, Months",
  "mode-frequency-calculator": "Mode & Frequency Calculator with Sorted Table",
  "standard-deviation-calculator": "Standard Deviation Calculator (Sample & Pop)",
  "probability-calculator": "Probability Calculator: Single & Compound Events",
  "permutation-combination-calculator": "Permutations and Combinations (nPr & nCr)",
  "factorial-calculator": "Factorial Calculator (n! & n!!) with Digits",
  "matrix-calculator": "Matrix Calculator: Determinant, Inverse, Add",
  "quadratic-solver": "Quadratic Equation Solver with Step-by-Step",
  "fraction-to-decimal-converter": "Fraction to Decimal and Mixed Number Converter",
  "ratio-proportion-calculator": "Ratio & Proportion Calculator: Solve for X",
  "geometry-area-calculator": "Geometry Area and Perimeter Calculator",

  // --- Health additions ------------------------------------------------
  "lean-body-mass-calculator": "Lean Body Mass Calculator (Boer & James)",
  "ideal-body-weight-calculator": "Ideal Body Weight Calculator: Devine & Hamwi",
  "daily-calorie-calculator": "Daily Calorie Calculator for Deficit & Bulk",
  "water-intake-calculator": "Daily Water Intake Calculator by Weight",
  "macro-ratio-calculator": "Macronutrient Ratio Calculator: Carbs & Protein",
  "protein-intake-calculator": "Daily Protein Intake Calculator by Goal",
  "tdee-calculator": "TDEE Calculator: Total Daily Energy Expenditure",
  "one-rep-max-calculator": "One Rep Max (1RM) Calculator: Epley & Brzycki",
  "ovulation-calculator": "Ovulation & Fertile Window Calculator",
  "target-heart-rate-calculator": "Target Heart Rate Zone Calculator (Karvonen)",
  "waist-hip-ratio-calculator": "Waist-to-Hip Ratio Calculator (WHO Standards)",
  "sleep-cycle-calculator": "Sleep Cycle Calculator: Optimal Bedtimes",
  "smoking-cost-calculator": "Smoking Cost Calculator: Expense & S&P 500",
  "running-pace-calculator": "Running Pace & Finish Time Calculator",
  "step-to-calorie-calculator": "Steps to Calories Burned Calculator",

  // --- Utility additions -----------------------------------------------
  "room-square-footage-calculator": "Room Square Footage & Material Cost Estimator",
  "flooring-calculator": "Flooring Calculator: Boxes & Waste Included",
  "tile-count-calculator": "Tile Count Calculator for Floors and Walls",
  "paint-volume-calculator": "Paint Volume Calculator: Gallons and Liters",
  "brick-count-calculator": "Brick Count Calculator for Single & Double Walls",
  "concrete-volume-calculator": "Concrete Volume Calculator: Yards & Pre-Mix",
  "cement-mortar-calculator": "Cement Mortar Calculator: Mix Ratios & Sand",
  "ac-btu-calculator": "Air Conditioner BTU Sizing Calculator",

  // --- Conversion additions --------------------------------------------
  "time-zone-converter": "World Time Zone Converter & Meeting Planner",
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
  "pdf-rotator":
    "Rotate all pages or specific page ranges in a PDF document by 90, 180 or 270 degrees. Runs 100% locally in your browser so confidential files never leave your device.",
  "pdf-page-numbers":
    "Insert clean page numbers, headers or footers across your PDF with custom format, position and font sizing. Fast client-side processing with zero server uploads.",
  "pdf-page-remover":
    "Delete unwanted pages or blank sheets from any PDF file and download a clean document. Processed entirely in browser memory with zero file uploads and complete privacy.",
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

  // --- Developer additions ---------------------------------------------
  "uuid-v4-generator":
    "Generate cryptographically random UUID v4 and GUID identifiers in bulk. Choose uppercase, hyphens, or braces with instant zero-upload browser generation.",
  "base64-encoder-decoder":
    "Encode text or binary data into Base64 or decode Base64 back to plain UTF-8. Fast client-side conversion ensures your sensitive payloads never touch remote servers.",
  "url-encoder-decoder":
    "Encode text into percentage-encoded RFC 3986 format or decode encoded URLs and query parameters safely in your browser tab without transmitting data.",
  "lorem-ipsum-generator":
    "Generate placeholder Lorem Ipsum text by paragraphs, sentences, or words with optional HTML tags. Clean, instant dummy copy for typography and web design.",
  "hash-generator-md5-sha":
    "Compute cryptographic MD5, SHA-1, SHA-256, and SHA-512 hashes from plain text using browser Web Crypto APIs. Fast, private hashing with zero server calls.",
  "hex-color-converter":
    "Convert HEX color codes to RGB, HSL, HSV, and CSS formats with live preview swatches. Check alpha transparency and copy color formulas in one click.",
  "morse-code-translator":
    "Translate text into International Morse Code and play realistic audio beeps using Web Audio API, or decode Morse back to English text locally in your browser.",
  "regex-tester":
    "Test regular expression patterns against sample text with real-time match highlighting, capture group extraction, and regex syntax error debugging.",
  "markdown-to-html":
    "Convert Markdown to clean semantic HTML in real-time with split-pane live preview. Supports headings, tables, code fences, and checklists with instant copy.",
  "diff-checker":
    "Compare two text files or code snippets side-by-side or inline to spot line additions and deletions with character-level accuracy. 100% private in-browser diff.",

  // --- Math additions --------------------------------------------------
  "percentage-calculator":
    "Calculate percentage increase, decrease, fractional proportions, and sales tax adjustments across four intuitive modes with complete step-by-step arithmetic shown.",
  "cgpa-calculator":
    "Compute semester-wise and cumulative CGPA from credits and grade points. Plan future semester requirements with the built-in target CGPA goal simulator.",
  "cgpa-to-percentage-calculator":
    "Convert 10-point CGPA to equivalent percentage using CBSE (x9.5), Mumbai University, or linear formulas, complete with honors division classifications.",
  "gpa-calculator":
    "Calculate college GPA on a standard 4.0 weighted scale. Add course credits and letter grades to view cumulative grade points, honors standing, and transcript summary.",
  "date-difference-calculator":
    "Calculate exact duration between two dates in years, months, days, hours, and business working days, or add/subtract time with complete calendar accuracy.",
  "mode-frequency-calculator":
    "Find the statistical mode, calculate frequency distribution tables, and visualize relative percentages for any numeric or categorical data set with zero server lag.",
  "standard-deviation-calculator":
    "Calculate sample and population standard deviation, variance, and mean with complete step-by-step deviation tables and standard error of the mean.",
  "probability-calculator":
    "Compute single-event odds and compound independent probabilities (union, intersection, and complement) with clear fractional, decimal, and odds representations.",
  "permutation-combination-calculator":
    "Calculate permutations (nPr) and combinations (nCr) with or without repetition using high-precision BigInt arithmetic and clear combinatorial explanations.",
  "factorial-calculator":
    "Compute single (n!) and double (n!!) factorials for large numbers up to 1000 using BigInt precision, with exact digit counts and trailing zeros breakdown.",
  "matrix-calculator":
    "Solve 2x2 and 3x3 matrix addition, subtraction, multiplication, determinants, and matrix inverses with transparent step-by-step cellular arithmetic.",
  "quadratic-solver":
    "Solve quadratic equations (ax² + bx + c = 0) with real or complex roots, discriminant analysis, parabola vertex coordinates, and step-by-step formula derivations.",
  "fraction-to-decimal-converter":
    "Convert proper, improper, and mixed fractions to decimals and percentages, or convert decimals back to simplified fractions using greatest common divisors.",
  "ratio-proportion-calculator":
    "Solve missing terms in proportions (A:B = C:D), simplify ratios to lowest terms, and divide total amounts into proportional shares with instant calculation.",
  "geometry-area-calculator":
    "Calculate area and perimeter for circles, rectangles, triangles, trapezoids, ellipses, and regular polygons with exact mathematical geometric formulas.",

  // --- Health additions ------------------------------------------------
  "lean-body-mass-calculator":
    "Estimate lean body mass and body fat percentage using peer-reviewed Boer, James, and Hume formulas with visual body composition distribution bars.",
  "ideal-body-weight-calculator":
    "Find your clinically ideal body weight using Devine, Robinson, Miller, and Hamwi equations alongside healthy WHO Body Mass Index ranges for your height.",
  "daily-calorie-calculator":
    "Calculate daily maintenance calories, cutting deficits, and lean bulking targets based on the Mifflin-St Jeor equation and physical activity multipliers.",
  "water-intake-calculator":
    "Determine optimal daily hydration based on body weight, workout duration, and environmental climate, with an hourly 250ml glass checklist schedule.",
  "macro-ratio-calculator":
    "Break daily calories into optimal protein, carb, and fat targets in grams across balanced, keto, or bodybuilding splits with per-meal portion estimates.",
  "protein-intake-calculator":
    "Calculate daily protein requirements tailored to your fitness goal (fat loss, hypertrophy, or maintenance) with whole-food portion equivalent guides.",
  "tdee-calculator":
    "Calculate Total Daily Energy Expenditure by comparing Mifflin-St Jeor, Katch-McArdle, and Harris-Benedict formulas with detailed metabolic component breakdowns.",
  "one-rep-max-calculator":
    "Estimate your one-rep max (1RM) from working sets using Epley, Brzycki, and Lombardi formulas, complete with a percentage-based strength training load table.",
  "ovulation-calculator":
    "Calculate your most fertile days, estimated ovulation date, and next cycle start from your last menstrual period and average cycle length.",
  "target-heart-rate-calculator":
    "Find your target training heart rate zones using the Karvonen formula and resting heart rate for fat burn, aerobic endurance, and anaerobic threshold.",
  "waist-hip-ratio-calculator":
    "Evaluate abdominal body fat distribution and cardiovascular risk levels against World Health Organization waist-to-hip ratio guidelines.",
  "sleep-cycle-calculator":
    "Plan bedtimes or wake-up times around 90-minute sleep cycles and natural fall-asleep latency to wake up alert and avoid sleep inertia.",
  "smoking-cost-calculator":
    "Calculate the true financial and health cost of smoking over time, including opportunity cost if invested at 8% in the S&P 500 and estimated days of life lost.",
  "running-pace-calculator":
    "Calculate running pace, estimated finish times, or distances for 5K, 10K, half marathon, and marathon races with metric and imperial split tables.",
  "step-to-calorie-calculator":
    "Convert daily steps into calories burned and distance walked based on body weight, height-derived stride length, and walking pace intensity.",

  // --- Utility additions -----------------------------------------------
  "room-square-footage-calculator":
    "Calculate total square footage and square meters across multiple rooms with optional price-per-square-foot material cost estimation.",
  "flooring-calculator":
    "Estimate hardwood, laminate, or vinyl plank flooring requirements with standard cutting waste factors, box coverage sizes, and total project cost.",
  "tile-count-calculator":
    "Calculate the exact number of floor or wall tiles and boxes needed for any room dimensions, factoring in waste percentage and popular tile sizes.",
  "paint-volume-calculator":
    "Calculate how many gallons or liters of paint you need based on room dimensions, ceiling height, doors and windows deductions, and coat counts.",
  "brick-count-calculator":
    "Estimate bricks and mortar bags for single and double wythe masonry walls, factoring in door and window openings and standard cutting waste.",
  "concrete-volume-calculator":
    "Calculate cubic yards and cubic meters of concrete needed for slabs, footings, and cylindrical columns, with 80 lb and 60 lb pre-mix bag conversions.",
  "cement-mortar-calculator":
    "Calculate cement bags, sand volume, and mixing water required for brickwork and plastering across standard mix ratios with dry void expansion factors.",
  "ac-btu-calculator":
    "Determine the exact air conditioner cooling capacity (BTU/hr and tonnage) needed based on room area, ceiling height, sunlight, and occupant count.",

  // --- Conversion additions --------------------------------------------
  "time-zone-converter":
    "Compare current local times across major global cities, view color-coded business hour overlaps, and schedule cross-timezone meetings seamlessly.",
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
