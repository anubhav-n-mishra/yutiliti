import { Tool } from "@/src/types";

export const SITE_NAME = "Yuitility";
export const SITE_URL = "https://www.yuitility.app";
export const SITE_DESCRIPTION =
  "Free, private browser tools for PDFs, images, finance calculators, developer workflows, and daily utilities with zero latency.";

export const toolPath = (toolId: string) => `/tools/${toolId}`;

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

const categoryKeywords: Record<string, string[]> = {
  finance: ["financial calculator", "calculator online", "free calculator"],
  utility: ["online utility", "browser tool", "free online tool"],
  developer: ["developer tool", "web tool", "free developer utility"],
  pdf: ["PDF tool online", "private PDF tool", "free PDF utility"],
  media: ["image tool online", "private image tool", "free media utility"],
};

export function getToolKeywords(tool: Tool) {
  return [
    tool.title,
    `${tool.title} online`,
    `free ${tool.title.toLowerCase()}`,
    `${tool.title.toLowerCase()} in browser`,
    ...(categoryKeywords[tool.category] ?? categoryKeywords.utility),
  ];
}

export function getToolSteps(tool: Tool) {
  if (tool.category === "finance") {
    return [
      "Enter the values for your scenario.",
      `Review the ${tool.title.toLowerCase()} result as you adjust the inputs.`,
      "Use the result to compare options or plan your next step.",
    ];
  }

  if (tool.category === "pdf" || tool.category === "media" || /image|pdf|zip|collage|meme|favicon/i.test(tool.id)) {
    return [
      "Choose or drag in the file you want to work with.",
      "Set the options that match your output.",
      "Preview, copy, or download the finished result directly from your browser.",
    ];
  }

  return [
    "Add the text, values, or data you want to work with.",
    "Adjust the available settings and review the live result.",
    "Copy, export, or save the finished result when you are ready.",
  ];
}

export function getToolFaqs(tool: Tool) {
  const toolName = tool.title;
  
  if (tool.id === "bmi-calculator") {
    return [
      {
        question: "How is BMI calculated?",
        answer: "BMI is calculated by dividing body weight in kilograms by height in meters squared (kg/m²). For imperial units, multiply weight in pounds by 703 and divide by height in inches squared."
      },
      {
        question: "What is a healthy BMI range?",
        answer: "A standard healthy BMI range for adults is between 18.5 and 24.9. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above indicates obesity."
      },
      {
        question: "Is BMI accurate for everyone?",
        answer: "BMI provides a helpful general assessment, but does not distinguish between muscle mass and fat tissue. Athletes or muscular individuals may have higher BMIs without excess fat."
      },
      {
        question: "Is this BMI calculator free and private?",
        answer: "Yes. Yuitility calculates your BMI 100% locally in your browser. No health data or personal inputs are uploaded to any server."
      }
    ];
  }

  if (tool.category === "finance") {
    return [
      {
        question: `How does the ${toolName} work?`,
        answer: `Our ${toolName} uses standard financial compound interest and amortization math to compute monthly values and totals instantly as you adjust input parameters.`
      },
      {
        question: `Can I change currencies in the ${toolName}?`,
        answer: `Yes. You can switch between USD ($), EUR (€), GBP (£), INR (₹), AUD (A$), CAD (C$), JPY (¥), AED, and SGD using the currency selector.`
      },
      {
        question: `Is my financial data saved or uploaded?`,
        answer: `No. All calculations run strictly client-side in your device memory. Yuitility does not store, collect, or transmit your financial inputs.`
      },
      {
        question: `Is the ${toolName} free to use?`,
        answer: `Yes, 100% free forever with no account creation, no limits, and no subscription fees required.`
      }
    ];
  }

  return [
    {
      question: `Is the ${toolName} free to use?`,
      answer: `Yes. Yuitility provides the ${toolName} as a free browser-based tool with no account or signup required.`,
    },
    {
      question: `Does the ${toolName} upload my data or files?`,
      answer:
        "No. Your inputs and files are processed locally within your browser. Data is never uploaded to any Yuitility server.",
    },
    {
      question: `How do I use the ${toolName}?`,
      answer: `Open the tool, enter your data or select your file, adjust settings as needed, and copy or download the output immediately.`,
    },
    {
      question: `Does the ${toolName} work offline?`,
      answer: `Yes. After loading the tool page, all execution scripts remain in your browser memory so you can use it even without an internet connection.`
    }
  ];
}

export function getCategoryName(category: string) {
  const categories: Record<string, string> = {
    finance: "Finance & Wealth",
    utility: "Utilities & Media",
    developer: "Developer & Design Tools",
    pdf: "PDF Tools",
    media: "Image & Media Tools",
  };
  return categories[category] || category;
}

// ----------------------------------------------------------------------
// SEO Custom Title & Meta Description Maps (Guaranteed < 60 chars title, 120-155 chars description)
// ----------------------------------------------------------------------

const TOOL_SEO_TITLES: Record<string, string> = {
  "bmi-calculator": "BMI Calculator – Free Online Health Tool | Yuitility",
  "emi-calculator": "EMI Calculator – Free Online Finance Tool | Yuitility",
  "sip-calculator": "SIP Calculator – Free Online Finance Tool | Yuitility",
  "age-calculator": "Age Calculator – Free Online Utility Tool | Yuitility",
  "password-generator": "Password Generator – Free Online Dev Tool | Yuitility",
  "qr-code-generator": "QR Code Generator – Free Online Dev Tool | Yuitility",
  "word-counter": "Word Counter – Free Online Utility Tool | Yuitility",
  "image-compressor": "Image Compressor – Free Online Media Tool | Yuitility",
  "salary-calculator": "Salary Calculator – Free Online Finance Tool | Yuitility",
  "json-formatter": "JSON Formatter – Free Online Developer Tool | Yuitility",
  "color-palette": "Color Palette Generator – Free Online Dev Tool | Yuitility",
  "pdf-merger": "PDF Merger – Free Online PDF Tool | Yuitility",
  "pdf-splitter": "PDF Splitter – Free Online PDF Tool | Yuitility",
  "image-to-pdf": "Image to PDF Converter – Free Online PDF Tool | Yuitility",
  "pdf-watermark": "PDF Watermark Tool – Free Online PDF Tool | Yuitility",
  "pdf-metadata": "PDF Metadata Editor – Free Online PDF Tool | Yuitility",
  "background-remover": "Background Remover – Free Online Media Tool | Yuitility",
  "image-resizer": "Image Resizer – Free Online Media Tool | Yuitility",
  "format-converter": "Image Format Converter – Free Media Tool | Yuitility",
  "pdf-compressor": "PDF Compressor – Free Online PDF Tool | Yuitility",
  "zip-extractor": "ZIP Extractor – Free Online Utility Tool | Yuitility",
  "unit-converter": "Unit Converter – Free Online Utility Tool | Yuitility",
  "meme-maker": "Meme Maker – Free Online Media Tool | Yuitility",
  "favicon-generator": "Favicon Generator – Free Online Dev Tool | Yuitility",
  "og-image-generator": "OG Image Generator – Free Online Dev Tool | Yuitility",
  "social-media-resizer": "Social Media Resizer – Free Online Media Tool | Yuitility",
  "fake-data-generator": "Fake Data Generator – Free Online Dev Tool | Yuitility",
  "photo-collage-maker": "Photo Collage Maker – Free Online Media Tool | Yuitility",
  "age-calculator-in-months": "Age in Months Calculator – Free Utility | Yuitility",
  "dog-age-calculator": "Dog Age Calculator – Free Online Utility | Yuitility",
  "pregnancy-due-date-calculator": "Pregnancy Calculator – Free Health Tool | Yuitility",
  "retirement-calculator": "Retirement Calculator – Free Finance Tool | Yuitility",
  "zodiac-age-calculator": "Zodiac Age Calculator – Free Astrology Tool | Yuitility",
  "school-age-eligibility-calculator": "School Age Calculator – Free Utility | Yuitility",
  "median-calculator": "Median Calculator – Free Online Math Tool | Yuitility",
  "mean-calculator": "Mean Calculator – Free Online Math Tool | Yuitility",
  "mod-calculator": "Mod Calculator – Free Online Math Tool | Yuitility",
  "zodiac-sun-moon-calculator": "Zodiac Sun Moon Calculator – Free Astrology | Yuitility",
  "death-calculator": "Life Expectancy Calculator – Free Health | Yuitility",
  "loan-calculator": "Loan Calculator – Free Online Finance Tool | Yuitility",
  "education-loan-emi-calculator": "Education Loan EMI – Free Finance Tool | Yuitility",
  "personal-loan-emi-calculator": "Personal Loan EMI – Free Finance Tool | Yuitility",
  "bike-loan-emi-calculator": "Bike Loan EMI – Free Online Finance Tool | Yuitility",
  "car-loan-emi-calculator": "Car Loan EMI – Free Online Finance Tool | Yuitility",
  "home-loan-emi-calculator": "Home Loan EMI – Free Online Finance Tool | Yuitility",
  "mortgage-calculator": "Mortgage Calculator – Free Finance Tool | Yuitility",
  "interest-calculator": "Interest Calculator – Free Finance Tool | Yuitility",
  "fd-calculator": "FD Calculator – Free Online Finance Tool | Yuitility",
  "rd-calculator": "RD Calculator – Free Online Finance Tool | Yuitility",
  "compound-interest-calculator": "Compound Interest – Free Finance Tool | Yuitility",
  "simple-interest-calculator": "Simple Interest – Free Finance Tool | Yuitility",
  "ppf-calculator": "PPF Calculator – Free Online Finance Tool | Yuitility",
};

const TOOL_SEO_DESCRIPTIONS: Record<string, string> = {
  "bmi-calculator": "Calculate your BMI instantly with our free online BMI calculator. Get accurate body mass index results and health category — no signup required.",
  "emi-calculator": "Calculate your monthly loan EMI, interest, and schedule instantly with our free EMI calculator online. Plan repayments now with no signup required.",
  "sip-calculator": "Forecast your mutual fund wealth growth with our free online SIP calculator. Calculate compound returns instantly and plan your investments now.",
  "age-calculator": "Calculate your exact age down to the second with our free online age calculator. Find next birthday countdown and zodiac sign — no sign up required.",
  "password-generator": "Generate secure, random passwords with custom parameters using our free password generator. Protect your accounts with zero server upload.",
  "qr-code-generator": "Create custom QR codes for URLs, WiFi, texts, and emails with our free QR code generator online. Download SVG and PNG instantly with no sign up.",
  "word-counter": "Analyze text character counts, words, reading time, and keyword density with our free word counter tool. Get instant writing stats in browser.",
  "image-compressor": "Compress JPG, PNG, and WebP images online with our free image compressor. Reduce file sizes up to 80% with zero quality loss — 100% private.",
  "salary-calculator": "Calculate your monthly in-hand salary, EPF, and tax deductions with our free salary calculator. Get instant breakdown with no registration.",
  "json-formatter": "Format, validate, and beautify your JSON data online with our free JSON formatter. Clean up code structure instantly in browser — 100% private.",
  "color-palette": "Generate harmonious color palettes and copy HEX, RGB, and HSL codes instantly with our free color palette generator. Perfect for designers.",
  "pdf-merger": "Combine multiple PDF files into one document with our free online PDF merger. Reorder pages and merge files instantly in browser — 100% local.",
  "pdf-splitter": "Split PDF pages or extract custom page ranges with our free online PDF splitter. Process documents instantly in browser with total privacy.",
  "image-to-pdf": "Convert PNG, JPG, and WebP images to PDF documents with our free image to PDF converter. Create clean PDFs instantly with no data uploads.",
  "pdf-watermark": "Add text or logo watermarks to PDF files online with our free PDF watermarker. Customize opacity and position with 100% browser-based security.",
  "pdf-metadata": "Edit PDF titles, authors, keywords, and creation dates with our free PDF metadata editor. Update document properties instantly in your browser.",
  "background-remover": "Remove image backgrounds automatically with our free background remover tool. Get transparent PNG outputs instantly — 100% private local execution.",
  "image-resizer": "Resize image width, height, and dimensions online with our free image resizer tool. Scale images instantly in browser with zero server uploads.",
  "format-converter": "Convert WebP, PNG, JPEG, and GIF images with our free online image format converter. Process files instantly in browser with no registration.",
  "pdf-compressor": "Compress PDF file size online while maintaining document quality with our free PDF compressor. Reduce file MBs instantly with zero server uploads.",
  "zip-extractor": "Extract and unzip files online directly in your browser with our free ZIP extractor. Unpack archives instantly with zero uploads and total privacy.",
  "unit-converter": "Convert length, weight, temperature, area, and speed measurements with our free unit converter. Get instant conversion results in your browser.",
  "meme-maker": "Create custom memes with text captions and images using our free online meme maker. Export funny memes instantly with no sign up required.",
  "favicon-generator": "Generate ICO, PNG, and SVG favicons for websites with our free favicon generator tool. Download web app icons instantly — 100% client side.",
  "og-image-generator": "Create custom Open Graph social cards for blogs and websites with our free OG image generator. Download 1200x630 banners instantly online.",
  "social-media-resizer": "Resize images for Instagram, Twitter, YouTube, and LinkedIn with our free social media resizer. Crop optimal dimensions instantly online.",
  "fake-data-generator": "Generate fake test names, emails, addresses, and phone numbers with our free fake data generator. Export JSON and CSV instantly for dev work.",
  "photo-collage-maker": "Create custom photo collages with layouts and grid frames using our free collage maker tool. Export high resolution image collages online.",
  "age-calculator-in-months": "Calculate your exact age in total months, weeks, and days with our free age in months calculator. Get instant age breakdowns — no signup required.",
  "dog-age-calculator": "Convert dog years to human years accurately based on breed size with our free dog age calculator. Calculate your pet's real age instantly online.",
  "pregnancy-due-date-calculator": "Calculate your estimated baby due date and pregnancy milestones with our free pregnancy due date calculator. Get instant timeline results online.",
  "retirement-calculator": "Calculate your retirement corpus requirements and monthly savings target with our free retirement calculator. Plan your future wealth now.",
  "zodiac-age-calculator": "Discover your astrological zodiac sign, birth element, and exact age with our free zodiac age calculator. Get instant birth chart insights online.",
  "school-age-eligibility-calculator": "Check if your child meets kindergarten and grade school entry age cutoffs with our free school age calculator. Get instant eligibility results.",
  "median-calculator": "Calculate the statistical median value of any dataset instantly with our free median calculator. Get step-by-step math analysis online now.",
  "mean-calculator": "Calculate the arithmetic average and mean of numbers with our free mean calculator. Get instant statistical calculations — no signup required.",
  "mod-calculator": "Compute modulo remainder operations (A mod B) instantly with our free mod calculator. Solves integer division remainders for math and programming.",
  "zodiac-sun-moon-calculator": "Calculate your Sun sign, Moon sign, and Rising astrological positions with our free zodiac sun moon calculator. Get instant cosmic details online.",
  "death-calculator": "Estimate your average life expectancy based on lifestyle habits with our free longevity calculator. Get personalized health insights online now.",
  "loan-calculator": "Calculate total interest and monthly repayments for any loan with our free loan calculator. Analyze principal vs interest breakdowns online.",
  "education-loan-emi-calculator": "Calculate education loan EMIs, moratorium interest, and tax savings under Sec 80E with our free student loan calculator. Plan college loans.",
  "personal-loan-emi-calculator": "Calculate personal loan EMIs, processing fees, and total borrowing costs with our free personal loan calculator. Plan instant repayments online.",
  "bike-loan-emi-calculator": "Calculate two-wheeler loan EMIs, down payments, and on-road prices with our free bike loan EMI calculator. Plan vehicle purchases now.",
  "car-loan-emi-calculator": "Calculate auto loan EMIs, down payments, and trade-in adjustments with our free car loan EMI calculator. Plan your vehicle finance online.",
  "home-loan-emi-calculator": "Calculate home loan EMIs, tax benefits, and total interest with our free home loan calculator. Analyze housing finance options online now.",
  "mortgage-calculator": "Calculate monthly mortgage PITI payments, property tax, PMI, and HOA fees with our free mortgage calculator. Plan home purchases now.",
  "interest-calculator": "Compare simple vs compound interest growth over time with our free interest calculator. Calculate total returns and earnings online now.",
  "fd-calculator": "Calculate bank fixed deposit maturity values and quarterly interest returns with our free FD calculator. Plan your savings returns online now.",
  "rd-calculator": "Calculate recurring deposit maturity amounts and accrued interest with our free RD calculator. Plan monthly savings installments online now.",
  "compound-interest-calculator": "Calculate compound interest growth with regular monthly contributions using our free compound interest calculator. Forecast your wealth online.",
  "simple-interest-calculator": "Calculate simple interest (I = P x R x T) and total return with our free simple interest calculator. Get instant interest results online now.",
  "ppf-calculator": "Calculate Public Provident Fund maturity value, 15-year interest, and tax savings with our free PPF calculator. Plan long term wealth now.",
};

export function getToolSeoTitle(tool: Tool): string {
  if (TOOL_SEO_TITLES[tool.id]) {
    return TOOL_SEO_TITLES[tool.id];
  }
  const categoryLabel = getCategoryName(tool.category).split(" ")[0];
  const title = `${tool.title} – Free Online ${categoryLabel} Tool | Yuitility`;
  return title.length <= 60 ? title : `${tool.title} – Free Online Tool | Yuitility`;
}

export function getToolSeoDescription(tool: Tool): string {
  if (TOOL_SEO_DESCRIPTIONS[tool.id]) {
    return TOOL_SEO_DESCRIPTIONS[tool.id];
  }
  const desc = `${tool.description} Use our free online ${tool.title.toLowerCase()} for instant results. 100% private in browser — no signup required.`;
  if (desc.length >= 120 && desc.length <= 155) return desc;
  return `Use our free online ${tool.title.toLowerCase()} to get instant, accurate results directly in your browser. 100% private with no signup required.`;
}
