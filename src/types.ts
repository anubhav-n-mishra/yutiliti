export interface Tool {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'finance' | 'utility' | 'developer' | 'pdf' | 'media' | string;
  icon: string; // Lucide icon name
  popular: boolean;
  recentlyAdded: boolean;
  cta: string;
  disabled?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const TOOLS: Tool[] = [
  {
    id: "emi-calculator",
    title: "EMI Calculator",
    description: "Calculate monthly loan repayments, total interest, and view a detailed amortization schedule.",
    longDescription: "A premium EMI (Equated Monthly Installment) calculator designed to help you analyze home, car, or personal loans. See your complete repayment lifecycle broken down year-by-year with an interactive breakdown chart and schedule.",
    category: "finance",
    icon: "Calculator",
    popular: true,
    recentlyAdded: false,
    cta: "Calculate EMI"
  },
  {
    id: "sip-calculator",
    title: "SIP Investment Calculator",
    description: "Forecast your mutual fund SIP wealth growth with expected annual returns over time.",
    longDescription: "Calculate the future value of your Systematic Investment Plan (SIP) investments. Visualize compound wealth growth with interactive charts comparing total invested capital versus accrued returns over your chosen tenure.",
    category: "finance",
    icon: "TrendingUp",
    popular: true,
    recentlyAdded: false,
    cta: "Calculate Wealth"
  },
  {
    id: "age-calculator",
    title: "Age Calculator & Birthday Count",
    description: "Get your exact age in years, months, days, down to the second, plus next birthday countdown.",
    longDescription: "Calculate your chronological age to the exact second. Learn your birth weekday, astronomical zodiac sign with element details, and watch a live-ticking countdown to your next birthday celebration.",
    category: "utility",
    icon: "Calendar",
    popular: false,
    recentlyAdded: true,
    cta: "Find Age"
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate highly secure random passwords with customizable parameters and strength analysis.",
    longDescription: "Generate secure, cryptographically random keys and passwords instantly. Customize length, toggle character pools, measure actual entropy bits, and perform safe batch generations with instant-copy.",
    category: "developer",
    icon: "KeyRound",
    popular: true,
    recentlyAdded: false,
    cta: "Generate Keys"
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Create custom QR codes for texts, URLs, WiFi networks, phone numbers, and emails.",
    longDescription: "A fully custom QR code generator with live preview. Encode URLs, credentials, WiFi setups, or standard text blocks. Supports real-time custom styling, color presets, and high-quality SVG/PNG exports.",
    category: "developer",
    icon: "QrCode",
    popular: true,
    recentlyAdded: false,
    cta: "Create QR Code"
  },
  {
    id: "word-counter",
    title: "Word & Character Counter",
    description: "Analyze writing structure, character counts, reading times, and keyword densities instantly.",
    longDescription: "An advanced real-time text analysis environment. Monitor word, char, sentence, and paragraph counts. Estimates both reading and speaking speed, and maps complete keyword frequency density live.",
    category: "utility",
    icon: "FileText",
    popular: false,
    recentlyAdded: false,
    cta: "Analyze Text"
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Reduce image file size instantly in your browser while preserving optimal visual quality.",
    longDescription: "A secure, 100% client-side image compression tool. Scale WebP, PNG, or JPEG formats using high-fidelity HTML5 rendering. Compare side-by-side file dimensions, saving percentages, and download directly.",
    category: "utility",
    icon: "Image",
    popular: true,
    recentlyAdded: true,
    cta: "Compress Image"
  },
  {
    id: "salary-calculator",
    title: "Salary In-Hand Calculator (India)",
    description: "Calculate in-hand monthly salary from annual CTC with tax and EPF breakdowns.",
    longDescription: "Estimate your monthly take-home salary from your Annual CTC based on the latest Indian tax regimes. Calculate EPF, Professional Tax, custom deductions, and compare tax structures visually.",
    category: "finance",
    icon: "Coins",
    popular: false,
    recentlyAdded: true,
    cta: "Estimate Salary"
  },
  {
    id: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Prettify, minify, validate, and explore complex JSON objects in an interactive node tree.",
    longDescription: "A professional playground for formatting and validating raw JSON data. Features precise syntax validation highlighting lines with parse errors, single-click formatting, minification, and an interactive tree inspector.",
    category: "developer",
    icon: "Code",
    popular: false,
    recentlyAdded: true,
    cta: "Format JSON"
  },
  {
    id: "color-palette",
    title: "Palette & Contrast Checker",
    description: "Generate color schemes and test text-to-background contrast using official WCAG guidelines.",
    longDescription: "Create gorgeous color schemes using mathematical harmonies, check shade steps, and calculate precise contrast ratios to meet WCAG AA/AAA accessibility standards for user interface design.",
    category: "developer",
    icon: "Palette",
    popular: false,
    recentlyAdded: true,
    cta: "Generate Palette"
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF files into a single document seamlessly.",
    longDescription: "A powerful, 100% secure client-side PDF merger. Drag and drop multiple PDF documents, rearrange their order, and combine them into one single file instantly without uploading anything to a server.",
    category: "pdf",
    icon: "FilePlus2",
    popular: true,
    recentlyAdded: true,
    cta: "Merge PDFs"
  },
  {
    id: "pdf-splitter",
    title: "PDF Splitter",
    description: "Extract specific pages from a PDF or split it into individual files.",
    longDescription: "Extract precisely the pages you need from any PDF document. Specify page ranges (e.g., 1-5, 8, 11-13) and generate a new, tailored PDF securely in your browser.",
    category: "pdf",
    icon: "Scissors",
    popular: true,
    recentlyAdded: true,
    cta: "Split PDF"
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert and compile multiple images into a single PDF document.",
    longDescription: "Easily turn your PNG or JPG images into a high-quality PDF document. Rearrange images, adjust page sizes, and export instantly with zero server latency.",
    category: "pdf",
    icon: "Image",
    popular: false,
    recentlyAdded: true,
    cta: "Convert to PDF"
  },
  {
    id: "pdf-watermark",
    title: "PDF Watermarker",
    description: "Add a custom text watermark to all pages of your PDF.",
    longDescription: "Stamp your documents with a custom watermark (e.g. 'CONFIDENTIAL' or 'DRAFT'). Adjust text, size, opacity, and rotation. Processed entirely locally for maximum privacy.",
    category: "pdf",
    icon: "Stamp",
    popular: false,
    recentlyAdded: true,
    cta: "Add Watermark"
  },
  {
    id: "pdf-metadata",
    title: "PDF Metadata Editor",
    description: "View and edit hidden PDF metadata like Author, Title, and Subject.",
    longDescription: "Reveal the hidden properties of your PDF files and modify them as needed. Update the document Title, Author, Subject, and Creator fields securely to maintain professional formatting.",
    category: "pdf",
    icon: "FileEdit",
    popular: false,
    recentlyAdded: true,
    cta: "Edit Metadata"
  },
  {
    id: "background-remover",
    title: "AI Background Remover",
    description: "Remove image backgrounds in your browser with a local AI model.",
    longDescription: "A powerful, 100% privacy-focused background removal tool that uses local machine learning models to perfectly isolate subjects without uploading your photos to any server.",
    category: "media",
    icon: "ImageOff",
    popular: true,
    recentlyAdded: true,
    cta: "Remove Background"
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize images to specific pixel dimensions or percentages natively.",
    longDescription: "Precisely crop and resize images using HTML5 canvas without uploading. Lock aspect ratios, define custom dimensions, and preview exact output sizes instantly.",
    category: "utility",
    icon: "Maximize",
    popular: false,
    recentlyAdded: true,
    cta: "Resize Image"
  },
  {
    id: "format-converter",
    title: "Image Format Converter",
    description: "Convert images between JPG, PNG, WEBP, and GIF formats instantly.",
    longDescription: "Convert high-quality images between all modern web formats. Export your photos to WebP for massive size reductions or to PNG for lossless transparency preservation.",
    category: "utility",
    icon: "Repeat",
    popular: true,
    recentlyAdded: true,
    cta: "Convert Format"
  },
  {
    id: "pdf-compressor",
    title: "PDF Compressor",
    description: "Reduce the file size of PDF documents securely in your browser.",
    longDescription: "Optimize PDF structures by rebuilding them natively in your browser to shave off unnecessary metadata and unreferenced streams, lowering overall file size.",
    category: "pdf",
    icon: "ArrowDownToLine",
    popular: true,
    recentlyAdded: true,
    cta: "Compress PDF"
  },
  {
    id: "zip-extractor",
    title: "ZIP File Extractor",
    description: "Open ZIP archives online, preview contents, and extract files locally.",
    longDescription: "Browse the contents of .zip archives directly in your browser. Preview images and text files, or extract specific files without needing desktop extraction software.",
    category: "utility",
    icon: "FileArchive",
    popular: true,
    recentlyAdded: true,
    cta: "Extract ZIP"
  },
  {
    id: "unit-converter",
    title: "Universal Unit Converter",
    description: "Quickly convert between standard length, weight, data, and temp units.",
    longDescription: "A fast, streamlined unit conversion tool for developers and professionals. Calculate exact metrics for dimensions, storage, temperatures, and weights effortlessly.",
    category: "utility",
    icon: "Scale",
    popular: false,
    recentlyAdded: true,
    cta: "Convert Units"
  },
  {
    id: "meme-maker",
    title: "Meme Maker",
    description: "Create classic image macros with custom top and bottom text.",
    longDescription: "Generate internet memes quickly. Upload any base image, add standard white-and-black Impact font text, and export directly from your browser.",
    category: "utility",
    icon: "Smile",
    popular: true,
    recentlyAdded: true,
    cta: "Make Meme"
  },
  {
    id: "favicon-generator",
    title: "Favicon Generator",
    description: "Generate standard web favicons and manifest files instantly.",
    longDescription: "Upload a square image to instantly generate a full ZIP package containing all modern favicon sizes (16x16 up to 512x512) and a web app manifest.json.",
    category: "developer",
    icon: "Box",
    popular: false,
    recentlyAdded: true,
    cta: "Generate Favicon"
  },
  {
    id: "og-image-generator",
    title: "Open Graph (OG) Generator",
    description: "Design beautiful Open Graph images for social media sharing.",
    longDescription: "Create stunning 1200x630 link preview images for Twitter, Facebook, and LinkedIn. Customize titles, subtitles, and gradient backgrounds with a visual editor.",
    category: "developer",
    icon: "ImagePlay",
    popular: true,
    recentlyAdded: true,
    cta: "Create OG Image"
  },
  {
    id: "social-media-resizer",
    title: "Social Media Resizer",
    description: "Instantly crop images to exact sizes for Instagram, X, LinkedIn, etc.",
    longDescription: "Never memorize aspect ratios again. Select your target platform (e.g. IG Story, X Post, YouTube Thumbnail) and auto-crop your images to pixel-perfect standards.",
    category: "utility",
    icon: "Crop",
    popular: true,
    recentlyAdded: true,
    cta: "Resize Post"
  },
  {
    id: "fake-data-generator",
    title: "Fake Data Generator",
    description: "Generate mock JSON, SQL, or CSV data for software testing.",
    longDescription: "Use industry-standard libraries to generate thousands of rows of realistic mock data including names, emails, phones, and addresses. Export in multiple formats.",
    category: "developer",
    icon: "Database",
    popular: true,
    recentlyAdded: true,
    cta: "Generate Data"
  },
  {
    id: "photo-collage-maker",
    title: "Photo Collage Maker",
    description: "Combine multiple photos into beautiful grid and story layouts.",
    longDescription: "Create stunning photo collages entirely in your browser. Choose from grid layouts, adjust border padding, apply CSS filters, and export high-quality combined images.",
    category: "utility",
    icon: "LayoutDashboard",
    popular: true,
    recentlyAdded: true,
    cta: "Create Collage"
  },
  {
    id: "age-calculator-in-months",
    title: "Age Calculator in Months",
    description: "Calculate your exact age directly in months, weeks, days, hours, and seconds.",
    longDescription: "A specialized chronological calculator that measures your exact lifetime in total completed months, total weeks, total days, hours, and minutes with instant date comparisons.",
    category: "utility",
    icon: "CalendarDays",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Months"
  },
  {
    id: "dog-age-calculator",
    title: "Dog Age Calculator",
    description: "Convert dog age to human years accurately based on breed weight and size.",
    longDescription: "Calculate your dog's true equivalent human age based on weight categories (Small, Medium, Large, Giant) with life stage insights and care advice.",
    category: "utility",
    icon: "Dog",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Dog Age"
  },
  {
    id: "pregnancy-due-date-calculator",
    title: "Pregnancy Due Date Calculator",
    description: "Calculate estimated due date, gestational age, trimester, and milestones.",
    longDescription: "Calculate your estimated baby due date using Last Menstrual Period (LMP), conception date, or ultrasound scan. Track trimesters, gestational weeks, and key milestones.",
    category: "utility",
    icon: "Baby",
    popular: true,
    recentlyAdded: true,
    cta: "Find Due Date"
  },
  {
    id: "retirement-calculator",
    title: "Retirement Age & Fund Calculator",
    description: "Plan your retirement nest egg, required monthly savings, and inflation impact.",
    longDescription: "Calculate how much money you need to retire comfortably based on current expenses, inflation rates, expected returns, and target retirement age.",
    category: "finance",
    icon: "PiggyBank",
    popular: true,
    recentlyAdded: true,
    cta: "Plan Retirement"
  },
  {
    id: "zodiac-age-calculator",
    title: "Zodiac Age & Planetary Calculator",
    description: "Discover your Western Zodiac, Chinese Zodiac, birthstone, and age on other planets.",
    longDescription: "Explore your chronological age alongside astrological profiles including Western Sun sign, Chinese Zodiac animal, birthstone, and your age in years on Mercury, Venus, Mars, and Jupiter.",
    category: "utility",
    icon: "Star",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Zodiac Age"
  },
  {
    id: "school-age-eligibility-calculator",
    title: "School Age Eligibility Calculator",
    description: "Determine grade level placement (Pre-K to 12th) based on birth date & cutoff rules.",
    longDescription: "Check what school grade or preschool class your child is eligible for based on their date of birth and district cutoff dates (e.g. Sept 1, Oct 1, Dec 31).",
    category: "utility",
    icon: "GraduationCap",
    popular: true,
    recentlyAdded: true,
    cta: "Check Eligibility"
  },
  {
    id: "median-calculator",
    title: "Median Calculator",
    description: "Calculate statistical median, sorted range, quartiles (Q1/Q3), and IQR.",
    longDescription: "Find the median value of any numerical dataset instantly. View sorted arrays, interquartile range (IQR), min, max, and clear mathematical step-by-step breakdowns.",
    category: "developer",
    icon: "Hash",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Median"
  },
  {
    id: "mean-calculator",
    title: "Mean Calculator",
    description: "Calculate Arithmetic, Geometric, and Harmonic Means along with standard deviation.",
    longDescription: "Compute exact Arithmetic Mean (average), Geometric Mean, Harmonic Mean, variance, and sample standard deviation for any set of numbers.",
    category: "developer",
    icon: "Calculator",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Mean"
  },
  {
    id: "mod-calculator",
    title: "Mod (Modulo & Mode) Calculator",
    description: "Calculate remainder (A mod B) or statistical mode frequency distribution.",
    longDescription: "Dual-purpose mathematical tool: perform integer modulo operations (remainder after division) and compute statistical modes (most frequent numbers in a dataset).",
    category: "developer",
    icon: "Percent",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Mod"
  },
  {
    id: "zodiac-sun-moon-calculator",
    title: "Zodiac Sun & Moon Sign Calculator",
    description: "Find your Big Three astrological signs: Sun, Moon, and Rising/Ascendant.",
    longDescription: "Discover your astrological Big Three (Sun, Moon, and Rising Sign) using your birth date and exact time of birth, with elemental balance and trait insights.",
    category: "utility",
    icon: "Compass",
    popular: true,
    recentlyAdded: true,
    cta: "Find Sun & Moon"
  },
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate Body Mass Index (Metric & Imperial), healthy weight range, and Prime index.",
    longDescription: "Check your Body Mass Index (BMI) in Metric or Imperial units. View official weight categories, target healthy weight ranges for your height, and BMI prime scores.",
    category: "utility",
    icon: "Scale",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate BMI"
  },
  {
    id: "death-calculator",
    title: "Life Expectancy & Longevity Calculator",
    description: "Estimate statistical lifespan based on age, gender, habits, and lifestyle factors.",
    longDescription: "Analyze statistical longevity and estimated life expectancy based on actuarial tables, diet, physical activity, stress levels, and personal health habits.",
    category: "utility",
    icon: "Activity",
    popular: true,
    recentlyAdded: true,
    cta: "Check Life Expectancy"
  },
  {
    id: "loan-calculator",
    title: "Universal Loan Repayment Calculator",
    description: "Calculate monthly payments, total interest, and total outlay for any loan.",
    longDescription: "Analyze monthly repayments, interest ratios, and total loan payback for any personal, business, or retail loan scenario.",
    category: "finance",
    icon: "DollarSign",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Loan"
  },
  {
    id: "education-loan-emi-calculator",
    title: "Educational Loan EMI Calculator",
    description: "Calculate student loan EMIs with moratorium/grace period & Section 80E tax benefits.",
    longDescription: "Estimate student loan monthly EMIs accounting for course duration, grace period simple interest, and annual income tax savings under Section 80E.",
    category: "finance",
    icon: "BookOpen",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Education Loan"
  },
  {
    id: "personal-loan-emi-calculator",
    title: "Personal Loan EMI Calculator",
    description: "Calculate monthly personal loan EMIs, processing fees, and net borrowing costs.",
    longDescription: "Calculate exact personal loan EMIs, processing fee additions, total interest payable, and overall loan outlay across your desired tenure.",
    category: "finance",
    icon: "User",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Personal Loan"
  },
  {
    id: "bike-loan-emi-calculator",
    title: "Bike & Two-Wheeler Loan EMI Calculator",
    description: "Calculate bike loan monthly EMI with ex-showroom price, down payment, and RTO fees.",
    longDescription: "Determine two-wheeler loan monthly payments with down payment adjustments, ex-showroom vs on-road price estimates, and loan-to-value (LTV) ratios.",
    category: "finance",
    icon: "Bike",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Bike EMI"
  },
  {
    id: "car-loan-emi-calculator",
    title: "Car Loan EMI Calculator",
    description: "Calculate auto loan monthly payments with down payment, trade-in, and interest.",
    longDescription: "Plan your car financing with monthly EMI breakdowns, trade-in allowances, down payment options, and total interest cost comparison.",
    category: "finance",
    icon: "Car",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Car EMI"
  },
  {
    id: "home-loan-emi-calculator",
    title: "Home Loan EMI Calculator",
    description: "Calculate home loan EMIs, down payment %, and tax benefits under Sec 24 & 80C.",
    longDescription: "Analyze housing loan EMIs, property down payments, total interest payable over 30 years, and tax savings under Indian tax sections 24 and 80C.",
    category: "finance",
    icon: "Home",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Home EMI"
  },
  {
    id: "mortgage-calculator",
    title: "Mortgage Calculator",
    description: "Calculate total monthly mortgage payment including PITI, PMI, and HOA fees.",
    longDescription: "Comprehensive home mortgage calculator that breaks down Principal, Interest, Property Tax, Home Insurance, PMI, and monthly HOA fees into total PITI.",
    category: "finance",
    icon: "Building",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Mortgage"
  },
  {
    id: "interest-calculator",
    title: "Interest Calculator (Simple vs Compound)",
    description: "Compare simple vs compound interest growth across various compounding frequencies.",
    longDescription: "Compare Simple Interest and Compound Interest side-by-side. Support daily, monthly, quarterly, semi-annual, and annual compounding periods.",
    category: "finance",
    icon: "Calculator",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Interest"
  },
  {
    id: "fd-calculator",
    title: "FD Return Calculator",
    description: "Calculate Fixed Deposit maturity returns, quarterly interest, and senior citizen boost.",
    longDescription: "Calculate bank Fixed Deposit (FD) maturity amounts with quarterly compounding, interest earned, and senior citizen interest rate boosts (+0.5%).",
    category: "finance",
    icon: "Landmark",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate FD Return"
  },
  {
    id: "rd-calculator",
    title: "RD Return Calculator",
    description: "Calculate Recurring Deposit maturity wealth with monthly contributions & compounding.",
    longDescription: "Forecast Recurring Deposit (RD) maturity wealth from monthly installments with quarterly compounding interest rules.",
    category: "finance",
    icon: "PiggyBank",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate RD Return"
  },
  {
    id: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    description: "Calculate long-term compound growth with initial principal and monthly additions.",
    longDescription: "Calculate compound wealth growth with initial principal investments, recurring monthly contributions, custom interest rates, and compounding schedules.",
    category: "finance",
    icon: "TrendingUp",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Compound Growth"
  },
  {
    id: "simple-interest-calculator",
    title: "Simple Interest Calculator",
    description: "Calculate simple interest (I = P*R*T/100) with tenure in years, months, or days.",
    longDescription: "Quick simple interest calculator for loans and investments. Specify tenure in years, months, or days with full mathematical formula steps.",
    category: "finance",
    icon: "Calculator",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate Simple Interest"
  },
  {
    id: "ppf-calculator",
    title: "PPF Calculator",
    description: "Calculate Public Provident Fund maturity corpus, interest, and EEE tax savings.",
    longDescription: "Calculate 15-year Public Provident Fund (PPF) maturity wealth, annual interest accrual, block extensions, and 100% tax-free EEE returns.",
    category: "finance",
    icon: "Landmark",
    popular: true,
    recentlyAdded: true,
    cta: "Calculate PPF Growth"
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "finance", label: "Finance & Wealth" },
  { id: "utility", label: "Utilities & Media" },
  { id: "developer", label: "Developer & Design Tools" },
  { id: "pdf", label: "PDF Tools" }
];
