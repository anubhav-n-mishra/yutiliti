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
    description: "Temporarily disabled for maintenance.",
    longDescription: "A powerful, 100% privacy-focused background removal tool that uses local machine learning models to perfectly isolate subjects without uploading your photos to any server.",
    category: "media",
    icon: "ImageOff",
    popular: true,
    recentlyAdded: true,
    cta: "Maintenance",
    disabled: true
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
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Tools" },
  { id: "finance", label: "Finance & Wealth" },
  { id: "utility", label: "Utilities & Media" },
  { id: "developer", label: "Developer & Design Tools" },
  { id: "pdf", label: "PDF Tools" }
];
