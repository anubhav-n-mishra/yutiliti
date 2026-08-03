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
    category: "utility",
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
    category: "developer",
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
    category: "utility",
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
    category: "utility",
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
    category: "utility",
    icon: "Heart",
    popular: false,
    recentlyAdded: true,
    cta: "Calculate Body Fat"
  }
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
