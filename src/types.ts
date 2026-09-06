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
    id: "standard-calculator",
    title: "Standard Calculator",
    description: "Fast, clean basic calculator for everyday calculations with memory and history.",
    longDescription: "A high-precision standard calculator designed for everyday math operations, percentage calculations, memory storage, and interactive calculation history.",
    category: "math",
    icon: "Calculator",
    popular: true,
    recentlyAdded: true,
    cta: "Open Calculator"
  },
  {
    id: "scientific-calculator",
    title: "Scientific Calculator",
    description: "Full scientific calculator with trig, logarithms, powers, roots, DEG/RAD, and memory.",
    longDescription: "A comprehensive, 100% browser-based scientific calculator. Includes full trigonometric functions, inverse & hyperbolic trig, natural & base-10 logarithms, exponents, powers, roots, factorials, constants (π, e), parentheses evaluation, and history.",
    category: "math",
    icon: "Calculator",
    popular: true,
    recentlyAdded: true,
    cta: "Open Scientific Calculator"
  },
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
    category: "media",
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
    id: "pdf-rotator",
    title: "Rotate PDF Pages",
    description: "Rotate all or specific pages in a PDF document clockwise or counter-clockwise.",
    longDescription: "Rotate PDF pages by 90, 180, or 270 degrees instantly in your browser. Rotate all pages, odd/even pages, or custom page ranges with zero server uploads.",
    category: "pdf",
    icon: "RotateCw",
    popular: true,
    recentlyAdded: true,
    cta: "Rotate PDF"
  },
  {
    id: "pdf-page-numbers",
    title: "Add Page Numbers to PDF",
    description: "Insert custom page numbers, headers, and footers across PDF documents.",
    longDescription: "Add clean, professional page numbering to any PDF file. Customize position, format, font size, color, and starting page number 100% locally.",
    category: "pdf",
    icon: "Hash",
    popular: true,
    recentlyAdded: true,
    cta: "Number Pages"
  },
  {
    id: "pdf-page-remover",
    title: "Remove PDF Pages",
    description: "Delete unwanted pages or blank sheets from PDF files and download clean documents.",
    longDescription: "Remove individual pages or custom page ranges from any PDF document. Fast, interactive, and completely private browser processing with zero file uploads.",
    category: "pdf",
    icon: "Trash2",
    popular: true,
    recentlyAdded: true,
    cta: "Remove Pages"
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
    category: "media",
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
    category: "media",
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
    category: "conversion",
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
    category: "media",
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
    category: "media",
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
    category: "media",
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
    category: "health",
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
    category: "math",
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
    category: "math",
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
    category: "math",
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
    category: "health",
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
    category: "health",
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
  },
  {
    id: "gold-loan-emi-calculator",
    title: "Gold Loan EMI Calculator",
    description: "Calculate monthly EMI repayments and total interest for gold-backed loans.",
    longDescription: "Calculate gold loan monthly EMIs, total interest charges, and tenure schedules for jewelry and gold coin collateral loans.",
    category: "finance",
    icon: "Coins",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Gold Loan EMI"
  },
  {
    id: "business-loan-emi-calculator",
    title: "Business Loan EMI Calculator",
    description: "Calculate monthly EMI and total borrowing costs for commercial and working capital loans.",
    longDescription: "Calculate commercial business loan EMI repayments, principal schedules, and interest overheads for business expansion.",
    category: "finance",
    icon: "Briefcase",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Business EMI"
  },
  {
    id: "swp-calculator",
    title: "SWP Calculator",
    description: "Calculate Systematic Withdrawal Plan monthly income payouts and remaining mutual fund corpus.",
    longDescription: "Project regular monthly cash payouts from mutual fund investments using a Systematic Withdrawal Plan (SWP).",
    category: "finance",
    icon: "BadgeDollarSign",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate SWP Payouts"
  },
  {
    id: "epf-calculator",
    title: "EPF Calculator",
    description: "Calculate Employee Provident Fund maturity wealth and accumulated retirement interest.",
    longDescription: "Forecast Employee Provident Fund (EPF) retirement corpus with monthly basic salary contributions and compounding interest.",
    category: "finance",
    icon: "Landmark",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate EPF Corpus"
  },
  {
    id: "nps-calculator",
    title: "NPS Calculator",
    description: "Calculate National Pension System retirement wealth, lump sum withdrawal, and monthly annuity.",
    longDescription: "Project National Pension System (NPS) retirement wealth, 60% tax-free lump sum payout, and 40% annuity reinvestment.",
    category: "finance",
    icon: "PiggyBank",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate NPS Wealth"
  },
  {
    id: "gratuity-calculator",
    title: "Gratuity Calculator",
    description: "Calculate lump sum gratuity benefit payable upon completing 5+ years of service.",
    longDescription: "Calculate tax-exempt gratuity payouts under the Payment of Gratuity Act 1972 based on last drawn basic salary and tenure.",
    category: "finance",
    icon: "Gift",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Gratuity"
  },
  {
    id: "hra-calculator",
    title: "HRA Exemption Calculator",
    description: "Calculate tax-exempt House Rent Allowance under Section 10(13A) of Income Tax Act.",
    longDescription: "Calculate tax-exempt House Rent Allowance (HRA) using metro/non-metro rules and actual rent paid.",
    category: "finance",
    icon: "Home",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate HRA Exemption"
  },
  {
    id: "income-tax-calculator",
    title: "Income Tax Calculator",
    description: "Estimate annual income tax liability, tax slabs, and net take-home salary.",
    longDescription: "Calculate progressive income tax liability, deduction savings, and net annual take-home pay.",
    category: "finance",
    icon: "Receipt",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Income Tax"
  },
  {
    id: "gst-calculator",
    title: "GST Calculator",
    description: "Calculate inclusive and exclusive GST tax amounts with CGST & SGST breakdown.",
    longDescription: "Calculate Goods and Services Tax (GST) additions and deductions with 5%, 12%, 18%, and 28% rate options.",
    category: "finance",
    icon: "Calculator",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate GST Tax"
  },
  {
    id: "credit-card-emi-calculator",
    title: "Credit Card EMI Calculator",
    description: "Calculate credit card purchase EMI conversion costs, interest rates, and processing fees.",
    longDescription: "Calculate monthly credit card EMI repayments, processing fee charges, and total borrowing costs.",
    category: "finance",
    icon: "CreditCard",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Credit Card EMI"
  },
  {
    id: "net-worth-calculator",
    title: "Net Worth Calculator",
    description: "Calculate total personal net worth by evaluating total assets minus total liabilities.",
    longDescription: "Calculate personal net worth by balancing total assets (cash, investments, real estate) against total debt liabilities.",
    category: "finance",
    icon: "TrendingUp",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Net Worth"
  },
  {
    id: "emergency-fund-calculator",
    title: "Emergency Fund Calculator",
    description: "Calculate 3 to 12 months of essential living expenses needed for financial security.",
    longDescription: "Determine exact emergency cash fund target sizes to cover essential monthly living expenses during job loss or emergencies.",
    category: "finance",
    icon: "ShieldAlert",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Emergency Fund"
  },
  {
    id: "roi-calculator",
    title: "ROI Calculator",
    description: "Calculate Return on Investment percentage and net monetary gain from capital investments.",
    longDescription: "Measure percentage Return on Investment (ROI) and net profit generated from capital investments.",
    category: "finance",
    icon: "Percent",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate ROI"
  },
  {
    id: "cagr-calculator",
    title: "CAGR Calculator",
    description: "Calculate Compound Annual Growth Rate for multi-year investments.",
    longDescription: "Calculate geometric mean Compound Annual Growth Rate (CAGR) for investment portfolios over multiple years.",
    category: "finance",
    icon: "BarChart3",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate CAGR"
  },
  {
    id: "irr-calculator",
    title: "IRR Calculator",
    description: "Calculate Internal Rate of Return for multi-year investment cash flows.",
    longDescription: "Calculate annual Internal Rate of Return (IRR) for multi-year project cash flows and investments.",
    category: "finance",
    icon: "LineChart",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate IRR"
  },
  {
    id: "break-even-calculator",
    title: "Break-even Analysis Calculator",
    description: "Calculate exact sales unit volume and revenue needed to cover fixed and variable costs.",
    longDescription: "Determine business break-even sales volume units and revenue required to reach zero net profit/loss.",
    category: "finance",
    icon: "Scale",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Break-even"
  },
  {
    id: "profit-margin-calculator",
    title: "Profit Margin Calculator",
    description: "Calculate gross profit margin percentage and cost price markup ratios.",
    longDescription: "Calculate gross profit margin percentage and markup on cost for product sales.",
    category: "finance",
    icon: "DollarSign",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Margin"
  },
  {
    id: "discount-calculator",
    title: "Discount & Sale Price Calculator",
    description: "Calculate final sale price and monetary savings from percentage discounts.",
    longDescription: "Calculate final discounted retail price and total monetary savings from promotional percentage discounts.",
    category: "utility",
    icon: "Tag",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Discount"
  },
  {
    id: "commission-calculator",
    title: "Commission Calculator",
    description: "Calculate sales commission earnings payout and net seller proceeds.",
    longDescription: "Calculate sales rep commission earnings payouts and net proceeds based on custom commission percentage rates.",
    category: "finance",
    icon: "BadgePercent",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Commission"
  },
  {
    id: "currency-converter",
    title: "Global Currency Converter",
    description: "Convert foreign exchange currencies instantly with live mid-market rate estimations.",
    longDescription: "Convert USD, EUR, GBP, INR, AUD, CAD, JPY, AED, and SGD exchange rates instantly in your browser.",
    category: "conversion",
    icon: "Coins",
    popular: false,
    recentlyAdded: true,
    cta: "Convert Currency"
  },
  {
    id: "mutual-fund-return-calculator",
    title: "Mutual Fund Return Calculator",
    description: "Calculate lump sum and SIP mutual fund growth and future maturity returns.",
    longDescription: "Forecast mutual fund wealth accumulation for both lump sum investments and monthly SIP plans.",
    category: "finance",
    icon: "TrendingUp",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate MF Returns"
  },
  {
    id: "dividend-calculator",
    title: "Dividend Yield & Income Calculator",
    description: "Calculate annual passive dividend payouts and dividend yield percentages.",
    longDescription: "Calculate passive annual and monthly dividend income streams based on share count and dividend per share.",
    category: "finance",
    icon: "Wallet",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Dividend"
  },
  {
    id: "stock-average-calculator",
    title: "Stock Average Calculator",
    description: "Calculate average buy price when purchasing additional stock shares.",
    longDescription: "Calculate weighted average share price across multiple stock purchase trades (dollar-cost averaging).",
    category: "finance",
    icon: "Layers",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Average Price"
  },
  {
    id: "bmr-calculator",
    title: "BMR Calculator",
    description: "Calculate baseline daily calories burned at rest using the Mifflin-St Jeor formula.",
    longDescription: "Calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) maintenance calories.",
    category: "health",
    icon: "Activity",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate BMR"
  },
  {
    id: "body-fat-calculator",
    title: "Body Fat Percentage Calculator",
    description: "Estimate body fat percentage, lean mass, and fat mass using US Navy formulas.",
    longDescription: "Estimate body fat percentage, lean body mass, and fat mass using US Navy waist and neck measurements.",
    category: "health",
    icon: "Heart",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Body Fat"
  },

  // --- NEW TOOLS FROM ROADMAP CHECKLIST ---
  // Health & Fitness
  { id: "lean-body-mass-calculator", title: "Lean Body Mass Calculator", description: "Calculate lean body mass (LBM) and body fat mass percentage.", longDescription: "Calculate lean body mass and fat mass using Boer and James formulas.", category: "health", icon: "Activity", popular: false, recentlyAdded: true, cta: "Calculate LBM" },
  { id: "ideal-body-weight-calculator", title: "Ideal Body Weight Calculator", description: "Estimate healthy body weight ranges based on height and frame.", longDescription: "Estimate ideal body weight range using Devine, Robinson, and Miller equations.", category: "health", icon: "Scale", popular: false, recentlyAdded: true, cta: "Calculate Weight" },
  { id: "daily-calorie-calculator", title: "Daily Calorie Intake Calculator", description: "Determine maintenance, weight loss, or bulking calorie targets.", longDescription: "Calculate daily calorie intake for weight loss, maintenance, or muscle gain.", category: "health", icon: "Zap", popular: true, recentlyAdded: true, cta: "Calculate Calories" },
  { id: "water-intake-calculator", title: "Daily Water Intake Calculator", description: "Calculate daily hydration and water intake requirements.", longDescription: "Calculate recommended daily water intake based on body weight and activity level.", category: "health", icon: "Smile", popular: false, recentlyAdded: true, cta: "Calculate Hydration" },
  { id: "macro-ratio-calculator", title: "Macronutrient Ratio Calculator", description: "Distribute daily calories across protein, carbs, and fats.", longDescription: "Calculate exact gram splits for protein, carbohydrates, and healthy fats.", category: "health", icon: "Grid3X3", popular: false, recentlyAdded: true, cta: "Calculate Macros" },
  { id: "protein-intake-calculator", title: "Daily Protein Intake Calculator", description: "Estimate target daily protein grams for muscle building and fitness.", longDescription: "Calculate daily protein requirements based on body weight and training intensity.", category: "health", icon: "Activity", popular: false, recentlyAdded: true, cta: "Calculate Protein" },
  { id: "tdee-calculator", title: "TDEE Calculator", description: "Calculate Total Daily Energy Expenditure and baseline metabolism.", longDescription: "Calculate TDEE and maintenance calorie requirements.", category: "health", icon: "Zap", popular: true, recentlyAdded: true, cta: "Calculate TDEE" },
  { id: "one-rep-max-calculator", title: "One Rep Max (1RM) Calculator", description: "Estimate maximum lift capacity for bench, squat, and deadlift.", longDescription: "Estimate 1RM strength using Epley and Brzycki powerlifting formulas.", category: "health", icon: "Activity", popular: false, recentlyAdded: true, cta: "Calculate 1RM" },
  { id: "ovulation-calculator", title: "Ovulation & Fertility Calculator", description: "Estimate ovulation dates and peak fertile windows.", longDescription: "Calculate ovulation dates and fertility windows based on cycle length.", category: "health", icon: "Calendar", popular: false, recentlyAdded: true, cta: "Calculate Fertility" },
  { id: "target-heart-rate-calculator", title: "Target Heart Rate Zone Calculator", description: "Determine cardio training heart rate zones for fat burn and peak endurance.", longDescription: "Calculate heart rate training zones using the Karvonen formula.", category: "health", icon: "Heart", popular: false, recentlyAdded: true, cta: "Calculate Zones" },
  { id: "waist-hip-ratio-calculator", title: "Waist-to-Hip Ratio Calculator", description: "Assess body fat distribution and cardiovascular health risk.", longDescription: "Calculate waist-to-hip ratio and evaluate WHO health risk categories.", category: "health", icon: "Scale", popular: false, recentlyAdded: true, cta: "Calculate Ratio" },
  { id: "sleep-cycle-calculator", title: "Sleep Cycle & Bedtime Planner", description: "Find optimal sleep cycles and bedtime wake-up windows.", longDescription: "Calculate 90-minute sleep cycle wake-up times to avoid grogginess.", category: "health", icon: "Sun", popular: true, recentlyAdded: true, cta: "Plan Sleep" },
  { id: "smoking-cost-calculator", title: "Smoking Lifetime Cost Calculator", description: "Calculate total money spent on cigarettes and future savings.", longDescription: "Calculate total expenditure and potential compound investment growth from quitting smoking.", category: "health", icon: "Coins", popular: false, recentlyAdded: true, cta: "Calculate Savings" },
  { id: "running-pace-calculator", title: "Running Pace & Finish Time Calculator", description: "Calculate target running pace per mile or kilometer.", longDescription: "Calculate pace, time, and distance for 5K, 10K, half marathon, and full marathon.", category: "health", icon: "TrendingUp", popular: false, recentlyAdded: true, cta: "Calculate Pace" },
  { id: "step-to-calorie-calculator", title: "Steps to Calories Converter", description: "Convert daily step counts to estimated calorie burn and miles walked.", longDescription: "Convert daily step count into distance walked and total energy expended.", category: "health", icon: "Activity", popular: false, recentlyAdded: true, cta: "Convert Steps" },

  // Education & Mathematics
  { id: "percentage-calculator", title: "Percentage Calculator", description: "Calculate percentage changes, differences, and fractions.", longDescription: "Calculate percentage increases, decreases, discounts, and relative proportions.", category: "math", icon: "Calculator", popular: true, recentlyAdded: true, cta: "Calculate Percentage" },
  { id: "cgpa-calculator", title: "CGPA Calculator", description: "Calculate Cumulative Grade Point Average across semesters.", longDescription: "Calculate semester CGPA and overall academic grade point average.", category: "math", icon: "Calculator", popular: false, recentlyAdded: true, cta: "Calculate CGPA" },
  { id: "cgpa-to-percentage-calculator", title: "CGPA to Percentage Converter", description: "Convert university CGPA scores to equivalent percentage marks.", longDescription: "Convert 10-point and 4-point CGPA scores into equivalent academic percentages.", category: "math", icon: "Repeat", popular: false, recentlyAdded: true, cta: "Convert Score" },
  { id: "gpa-calculator", title: "GPA Calculator (4.0 Scale)", description: "Calculate high school and college GPA with weighted credit hours.", longDescription: "Calculate unweighted and weighted GPA based on course grades and credits.", category: "math", icon: "Calculator", popular: false, recentlyAdded: true, cta: "Calculate GPA" },
  { id: "date-difference-calculator", title: "Date Difference Calculator", description: "Calculate exact days, weeks, months between two dates.", longDescription: "Calculate total days, business days, and time intervals between any two dates.", category: "math", icon: "Calendar", popular: true, recentlyAdded: true, cta: "Calculate Days" },
  { id: "mode-frequency-calculator", title: "Mode & Frequency Calculator", description: "Find statistical mode and value frequencies in data sets.", longDescription: "Find statistical mode, frequency distribution, and modal values.", category: "math", icon: "BarChart3", popular: false, recentlyAdded: true, cta: "Find Mode" },
  { id: "standard-deviation-calculator", title: "Standard Deviation Calculator", description: "Calculate population and sample standard deviation and variance.", longDescription: "Calculate sample standard deviation, population variance, and mean.", category: "math", icon: "Calculator", popular: false, recentlyAdded: true, cta: "Calculate Deviation" },
  { id: "probability-calculator", title: "Probability Calculator", description: "Calculate single event chances, joint probabilities, and odds.", longDescription: "Calculate probability of independent, dependent, and mutually exclusive events.", category: "math", icon: "HelpCircle", popular: false, recentlyAdded: true, cta: "Calculate Odds" },
  { id: "permutation-combination-calculator", title: "Permutations & Combinations (nPr / nCr)", description: "Calculate factorial permutations and combinations.", longDescription: "Compute nPr permutations and nCr combinations with or without repetition.", category: "math", icon: "Layers", popular: false, recentlyAdded: true, cta: "Calculate nCr" },
  { id: "factorial-calculator", title: "Factorial Calculator (n!)", description: "Compute exact factorials for large integer numbers.", longDescription: "Calculate exact factorials and Stirling approximations for large positive integers.", category: "math", icon: "Calculator", popular: false, recentlyAdded: true, cta: "Calculate Factorial" },
  { id: "matrix-calculator", title: "Matrix Arithmetic & Determinant Solver", description: "Perform matrix addition, multiplication, transpose, and determinant.", longDescription: "Compute matrix determinants, inverses, transpose, and matrix multiplication.", category: "math", icon: "Grid3X3", popular: false, recentlyAdded: true, cta: "Solve Matrix" },
  { id: "quadratic-solver", title: "Quadratic Formula Equation Solver", description: "Solve quadratic equations ax² + bx + c = 0 with step explanation.", longDescription: "Find real and complex roots for quadratic polynomial equations.", category: "math", icon: "Code", popular: false, recentlyAdded: true, cta: "Solve Quadratic" },
  { id: "fraction-to-decimal-converter", title: "Fraction to Decimal Converter", description: "Convert proper, improper, and mixed fractions to decimals.", longDescription: "Convert fractions to repeating decimals and simplified mixed numbers.", category: "math", icon: "Repeat", popular: false, recentlyAdded: true, cta: "Convert Fraction" },
  { id: "ratio-proportion-calculator", title: "Ratio & Proportion Calculator", description: "Solve missing proportions a:b = c:d and ratio splits.", longDescription: "Calculate ratio proportions and simplify multi-part numerical ratios.", category: "math", icon: "Scale", popular: false, recentlyAdded: true, cta: "Solve Ratio" },
  { id: "geometry-area-calculator", title: "Geometry Area & Perimeter Calculator", description: "Calculate area and perimeter for circles, triangles, rectangles.", longDescription: "Calculate geometric area and perimeter for standard 2D shapes.", category: "math", icon: "Crop", popular: false, recentlyAdded: true, cta: "Calculate Area" },

  // Home & Construction
  { id: "paint-volume-calculator", title: "Wall Paint Volume Calculator", description: "Estimate paint gallons/liters and coats required for rooms.", longDescription: "Calculate wall square footage and required paint volume for interior/exterior rooms.", category: "utility", icon: "Palette", popular: false, recentlyAdded: true, cta: "Calculate Paint" },
  { id: "cement-mortar-calculator", title: "Cement & Mortar Mix Calculator", description: "Estimate cement bags and sand ratio for masonry construction.", longDescription: "Calculate cement bags, sand volume, and water ratio for brickwork mortar.", category: "utility", icon: "Box", popular: false, recentlyAdded: true, cta: "Calculate Mix" },
  { id: "concrete-volume-calculator", title: "Concrete Volume & Slab Estimator", description: "Calculate cubic yards/meters of concrete for slabs and footings.", longDescription: "Calculate concrete volume in cubic yards or meters for foundation slabs.", category: "utility", icon: "Box", popular: true, recentlyAdded: true, cta: "Calculate Concrete" },
  { id: "brick-count-calculator", title: "Brick Count & Wall Estimator", description: "Calculate number of bricks needed for walls and masonry work.", longDescription: "Calculate total brick count considering wall dimensions and mortar joint thickness.", category: "utility", icon: "Layers", popular: false, recentlyAdded: true, cta: "Calculate Bricks" },
  { id: "tile-count-calculator", title: "Floor & Wall Tile Count Calculator", description: "Calculate tile count and grout quantity for bathroom/kitchen floors.", longDescription: "Calculate total tiles needed including 10% wastage margin for room dimensions.", category: "utility", icon: "Grid3X3", popular: false, recentlyAdded: true, cta: "Calculate Tiles" },
  { id: "flooring-calculator", title: "Laminate & Hardwood Flooring Calculator", description: "Estimate square feet of hardwood or laminate flooring required.", longDescription: "Calculate total flooring square footage, box count, and waste allowance.", category: "utility", icon: "Box", popular: false, recentlyAdded: true, cta: "Calculate Flooring" },
  { id: "room-square-footage-calculator", title: "Room Square Footage Calculator", description: "Calculate room area in sq ft, sq meters, and perimeter.", longDescription: "Calculate total room square footage and wall perimeter for home planning.", category: "utility", icon: "Crop", popular: true, recentlyAdded: true, cta: "Calculate Sq Ft" },
  { id: "ac-btu-calculator", title: "Air Conditioner BTU Cooling Calculator", description: "Determine required AC tonnage and BTU rating for room dimensions.", longDescription: "Calculate BTU cooling capacity required based on room size and sunlight exposure.", category: "utility", icon: "Zap", popular: false, recentlyAdded: true, cta: "Calculate BTU" },

  // Developer & Text Utilities
  { id: "time-zone-converter", title: "Time Zone Converter", description: "Convert meeting times across UTC, EST, PST, GMT, and IST.", longDescription: "Convert local times across global time zones and UTC offsets.", category: "conversion", icon: "Calendar", popular: false, recentlyAdded: true, cta: "Convert Time" },
  { id: "morse-code-translator", title: "Morse Code Encoder & Decoder", description: "Translate plain text to Morse code signals and audio simulation.", longDescription: "Encode text into Morse code dots/dashes and decode Morse code back to text.", category: "developer", icon: "Code", popular: false, recentlyAdded: true, cta: "Translate Morse" },
  { id: "lorem-ipsum-generator", title: "Lorem Ipsum Text Generator", description: "Generate placeholder text, paragraphs, and words for design mockups.", longDescription: "Generate customizable Lorem Ipsum text for UI mockups and web layouts.", category: "developer", icon: "FileText", popular: true, recentlyAdded: true, cta: "Generate Text" },
  { id: "base64-encoder-decoder", title: "Base64 Encoder & Decoder", description: "Encode text strings and decode Base64 data safely.", longDescription: "Encode raw text into Base64 format and decode Base64 back to plain string.", category: "developer", icon: "Lock", popular: false, recentlyAdded: true, cta: "Encode Base64" },
  { id: "url-encoder-decoder", title: "URL Encoder & Decoder", description: "Encode text to URI components and decode percent-encoded URLs.", longDescription: "Encode special characters into URL-safe percent encoding.", category: "developer", icon: "Code", popular: false, recentlyAdded: true, cta: "Encode URL" },
  { id: "regex-tester", title: "RegEx Pattern Tester & Matcher", description: "Test regular expressions against target text with regex flags.", longDescription: "Test JavaScript regular expression patterns against sample text strings.", category: "developer", icon: "Search", popular: false, recentlyAdded: true, cta: "Test RegEx" },
  { id: "hex-color-converter", title: "HEX to RGB & HSL Color Converter", description: "Convert color codes between HEX, RGB, HSL, and HSV formats.", longDescription: "Convert color formats between HEX codes, RGB tuples, and HSL values.", category: "developer", icon: "Palette", popular: false, recentlyAdded: true, cta: "Convert Color" },
  { id: "markdown-to-html", title: "Markdown to HTML Live Converter", description: "Convert Markdown syntax into clean HTML code in real time.", longDescription: "Convert Markdown headings, lists, links, and code blocks into HTML.", category: "developer", icon: "FileText", popular: false, recentlyAdded: true, cta: "Convert Markdown" },
  { id: "markdown-viewer", title: "Markdown File Viewer", description: "View and preview Markdown files live with split-screen rendering, client-side paste, and local file upload.", longDescription: "A fast, 100% private in-browser Markdown file viewer and editor. Drag-and-drop or upload .md files, paste Markdown text directly, inspect word and character statistics, and render GitHub Flavored Markdown (GFM) tables, checklists, code blocks, and math equations with live split-screen preview.", category: "developer", icon: "FileText", popular: true, recentlyAdded: true, cta: "Open Markdown Viewer" },
  { id: "uuid-v4-generator", title: "UUID v4 & GUID Generator", description: "Generate cryptographically secure random UUID v4 strings in batch.", longDescription: "Generate random UUID v4 identifiers for database keys and APIs.", category: "developer", icon: "KeyRound", popular: true, recentlyAdded: true, cta: "Generate UUIDs" },
  { id: "hash-generator-md5-sha", title: "MD5 & SHA256 Hash Generator", description: "Generate MD5, SHA-1, and SHA-256 cryptographic hashes.", longDescription: "Compute MD5 and SHA256 hashes from plain input strings.", category: "developer", icon: "Lock", popular: false, recentlyAdded: true, cta: "Generate Hash" },
  { id: "diff-checker", title: "Text Diff Checker", description: "Compare two text files or code snippets to find line differences.", longDescription: "Compare two text inputs side-by-side to highlight insertions and deletions.", category: "developer", icon: "Scissors", popular: false, recentlyAdded: true, cta: "Check Diff" }
];

export const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "math", label: "Calculators & Math" },
  { id: "finance", label: "Finance & Wealth" },
  { id: "developer", label: "Text & Developer Tools" },
  { id: "pdf", label: "PDF Tools" },
  { id: "media", label: "Image & Media" },
  { id: "conversion", label: "Units & Conversion" },
  { id: "health", label: "Health & Lifestyle" },
  { id: "utility", label: "Utilities & Everyday" }
];
