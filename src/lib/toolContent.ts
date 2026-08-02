import { FAQItem, Tool } from "@/src/types";

/**
 * Priority 1 & 2 Custom "How It Works" Descriptions
 */
const CUSTOM_HOW_IT_WORKS: Record<string, string> = {
  "dog-age-calculator":
    "Enter your dog's age and size/breed group. Our calculator converts it to human years using updated veterinary formulas — not the old \"multiply by 7\" myth. Small breeds age slower after year two; large breeds age faster. Results are instant and run entirely in your browser.",
  "death-calculator":
    "Enter your age, sex, and basic lifestyle factors (smoking, exercise, etc.). Our calculator estimates statistical life expectancy based on actuarial and public health data. This is a statistical estimate for informational and planning purposes only — not a medical prediction.",
  "education-loan-emi-calculator":
    "Enter your loan amount, interest rate, tenure, and moratorium period (the time during your course when repayment is paused). The calculator computes your EMI, total interest, and shows how moratorium interest gets added to your principal before repayment begins.",
  "salary-calculator":
    "Enter your annual CTC (Cost to Company). The calculator breaks it down into basic pay, HRA, allowances, EPF contribution, professional tax, and income tax deductions to show your actual monthly in-hand salary.",
  "mortgage-calculator":
    "Enter loan amount, interest rate, and tenure. The calculator computes your monthly EMI using the standard reducing-balance formula, and (for the PITI version) adds property tax, insurance, and HOA fees for a full monthly payment picture.",
  "home-loan-emi-calculator":
    "Enter loan amount, interest rate, and tenure. The calculator computes your monthly EMI using the standard reducing-balance formula, and adds property tax, insurance, and HOA fees for a full monthly payment picture.",
  "bmi-calculator":
    "Enter your height and body weight in either metric or imperial units. The calculator computes your Body Mass Index (BMI) using standard WHO clinical guidelines and displays your health category instantly in your browser without uploading any data.",
  "emi-calculator":
    "Enter your loan principal amount, annual interest rate, and tenure. The calculator uses the standard reducing-balance formula to compute your exact monthly payment (EMI), interest burden, and interactive repayment schedule.",
  "sip-calculator":
    "Enter your monthly investment amount, expected annual return rate, and investment horizon. The calculator computes compound wealth growth over time and displays total invested capital alongside total returns.",
  "password-generator":
    "Select your desired length and toggle uppercase, lowercase, numbers, or special symbols. The generator uses Web Crypto API to generate cryptographically secure passwords 100% locally in your browser memory.",
  "qr-code-generator":
    "Enter any text, URL, WiFi credential, or contact info. The generator encodes it directly into a vector QR code canvas in your browser so you can download PNG or SVG graphics without server tracking.",
  "word-counter":
    "Paste or type your document text directly into the input area. The tool counts total words, characters (with and without spaces), sentences, paragraphs, reading duration, and keyword frequency in real time.",
  "image-compressor":
    "Upload your JPG, PNG, or WebP images into the local processing engine. Adjust quality settings to compress file size by up to 80% with zero server uploads and zero quality loss.",
  "json-formatter":
    "Paste raw JSON into the editor. The tool validates syntax, formats indentation, fixes formatting errors, and collapses tree nodes instantly inside your browser with complete privacy.",
  "color-palette":
    "Generate harmonious color schemes, extract palettes from images, or test contrast ratios. Copy HEX, RGB, and HSL values instantly for web design and frontend projects.",
  "pdf-merger":
    "Drag and drop multiple PDF files into the file queue. Reorder pages and merge them into a single consolidated PDF document using client-side PDF processing.",
  "pdf-splitter":
    "Select a PDF file and specify target page numbers or custom split ranges. The tool extracts selected pages into separate PDF files without uploading your document to any server.",
  "image-to-pdf":
    "Select image files from your device. The converter arranges images into custom page sizes, margins, and orientations, outputting a clean PDF document directly in your browser.",
  "pdf-watermark":
    "Upload a PDF document and add custom text or image watermarks. Adjust font size, opacity, rotation, and alignment with 100% browser-side privacy.",
  "pdf-metadata": "Upload a PDF file to view and edit title, author, subject, keywords, and creator metadata fields. Save updated PDF files instantly with no server upload.",
  "background-remover":
    "Select an image file from your computer. Our local AI model detects subject boundaries and strips out backgrounds to generate transparent PNG images 100% in browser.",
  "image-resizer":
    "Select image files and set target pixel width, height, or aspect ratios. High-speed browser canvas scaling exports crisp resized graphics instantly.",
  "format-converter":
    "Select image files and pick target output formats (WebP, PNG, JPEG, GIF). Client-side canvas encoding converts format types without external server processing.",
  "pdf-compressor":
    "Upload PDF files and choose compression preset levels. Client-side stream optimization reduces file megabytes while preserving document legibility.",
  "zip-extractor":
    "Select ZIP archives from your file system. The browser unpacks compressed files into accessible folders, letting you view and download files offline.",
  "unit-converter":
    "Choose measurement categories (length, mass, temperature, area, speed, volume) and enter values. Conversion formulas calculate accurate conversions instantly.",
  "meme-maker":
    "Upload images or select template graphics, type top and bottom text captions, adjust font styles, and export funny meme graphics directly from your browser.",
  "favicon-generator":
    "Upload logo graphics or design icon assets. The generator renders ICO, PNG, and SVG web app icon packages ready for deployment.",
  "og-image-generator":
    "Design 1200x630 Open Graph social media preview banners for blog posts and websites. Customize background gradients, headlines, tags, and export PNG cards.",
  "social-media-resizer":
    "Upload image graphics and select social media platform templates (Instagram posts/stories, Twitter banners, YouTube thumbnails, LinkedIn covers) for instant cropping.",
  "fake-data-generator":
    "Configure dataset parameters and row counts to generate realistic dummy names, emails, street addresses, phone numbers, and company profiles in JSON or CSV.",
  "photo-collage-maker":
    "Upload image photos, choose grid layout templates, adjust border spacing and background colors, and export high-resolution composite photo collages.",
  "age-calculator-in-months":
    "Enter your date of birth to calculate exact age converted into total months, weeks, days, hours, and minutes with live date math.",
  "pregnancy-due-date-calculator":
    "Enter your last menstrual period (LMP) date or conception date. Naegele's rule computes your estimated delivery date and key trimester milestones.",
  "retirement-calculator":
    "Enter your current age, target retirement age, monthly expenses, current savings, and expected investment returns to calculate your total retirement corpus.",
  "zodiac-age-calculator":
    "Enter your birthdate to calculate your chronological age alongside astrological Western zodiac signs, birth elements, ruling planets, and modalities.",
  "school-age-eligibility-calculator":
    "Enter your child's date of birth and school district cutoff date to check entry eligibility for kindergarten, 1st grade, and preschool enrollment.",
  "median-calculator":
    "Paste numerical dataset values. The calculator sorts values in ascending order and identifies the exact central median value with step-by-step math explanations.",
  "mean-calculator":
    "Paste dataset numbers into the calculator. It computes the arithmetic mean ($\\\\bar{x} = \\\\frac{\\\\sum x}{n}$), total sum, and count instantly.",
  "mod-calculator":
    "Enter dividend integer A and divisor integer B. The calculator computes the modulo remainder ($A \\\\bmod B$) and quotient for programming and math.",
  "zodiac-sun-moon-calculator":
    "Enter your birth date, birth time, and location. Astronomical algorithms compute your Sun sign, Moon sign, and Rising sign (Ascendant) positions.",
  "loan-calculator":
    "Enter loan amount, interest rate, and repayment tenure. The calculator computes monthly payments, total interest payable, and total loan cost.",
  "personal-loan-emi-calculator":
    "Enter personal loan amount, interest rate, and term to compute monthly EMI payments, upfront processing fee impacts, and total borrowing costs.",
  "bike-loan-emi-calculator":
    "Enter two-wheeler loan principal, interest rate, and tenure. Calculate exact monthly EMIs, down payment requirements, and total interest paid.",
  "car-loan-emi-calculator":
    "Enter auto loan principal, interest rate, and repayment tenure to compute monthly car EMIs, down payments, and total vehicle financing cost.",
  "interest-calculator":
    "Enter principal amount, interest rate, time period, and compounding frequency to compare simple vs compound interest earnings over time.",
  "fd-calculator":
    "Enter fixed deposit principal, annual interest rate, and tenure to calculate bank FD maturity value and quarterly compounding interest returns.",
  "rd-calculator":
    "Enter monthly recurring deposit amount, interest rate, and tenure to compute total accumulated savings and maturity interest payout.",
  "compound-interest-calculator":
    "Enter initial principal, monthly contribution, interest rate, and compounding frequency ($A = P(1 + r/n)^{nt}$) to forecast long-term compound wealth.",
  "simple-interest-calculator":
    "Enter principal, annual rate, and time in years to calculate simple interest ($I = P \\\\times R \\\\times T$) and final accumulated balance.",
  "ppf-calculator":
    "Enter annual Public Provident Fund contribution to calculate 15-year maturity wealth, accrued compound interest, and Section 80C tax exemption benefits.",
  "age-calculator":
    "Enter your birth date to calculate exact age in years, months, and days down to the live second, plus zodiac details and next birthday countdown.",
};

/**
 * Helper to retrieve tailored "How It Works" text for any tool
 */
export function getToolHowItWorks(tool: Tool): string {
  if (CUSTOM_HOW_IT_WORKS[tool.id]) {
    return CUSTOM_HOW_IT_WORKS[tool.id];
  }
  return `Enter your input parameters or select your files. Our ${tool.title.toLowerCase()} processes your data instantly using standard browser algorithms. All operations run 100% locally on your device with no server uploads, no data storage, and no account registration required.`;
}

/**
 * Priority 1 & 2 and Reusable Tool FAQ Database
 */
const TOOL_FAQS_DB: Record<string, FAQItem[]> = {
  "dog-age-calculator": [
    {
      question: "Is the \"1 dog year = 7 human years\" rule accurate?",
      answer: "No. That rule is outdated. Dogs mature much faster in their first two years, then aging slows down — and the rate varies significantly by size. Small dogs (under 20 lbs) age slower in later years; large and giant breeds age faster.",
    },
    {
      question: "Does dog breed affect the calculation?",
      answer: "Yes, significantly. A 10-year-old Chihuahua and a 10-year-old Great Dane are at very different life stages. Larger breeds generally have shorter lifespans and hit \"senior\" status earlier.",
    },
    {
      question: "At what age is a dog considered a senior?",
      answer: "Small breeds are typically senior around 10-12 years old, medium breeds around 8-10, and large/giant breeds as early as 6-7 years old.",
    },
    {
      question: "How accurate is this calculator?",
      answer: "It uses current veterinary research-based formulas rather than the old linear multiplier, giving a much closer approximation of your dog's biological age. Individual health and genetics still play a role.",
    },
  ],

  "death-calculator": [
    {
      question: "Is this a real prediction of when I will die?",
      answer: "No. This tool provides a statistical life expectancy estimate based on population-level data (age, sex, lifestyle factors). It cannot predict individual outcomes and should not be used for medical or financial decisions without professional advice.",
    },
    {
      question: "What factors affect the estimate?",
      answer: "Common inputs include current age, biological sex, smoking status, exercise frequency, and sometimes BMI or family history — all of which are statistically linked to life expectancy trends.",
    },
    {
      question: "Why do calculators like this exist?",
      answer: "They're commonly used for insurance planning, retirement savings estimates, and general health awareness — helping people think about long-term financial and wellness planning.",
    },
    {
      question: "Can lifestyle changes improve my estimate?",
      answer: "Statistically, yes — quitting smoking, regular exercise, and maintaining a healthy weight are all associated with increased life expectancy in population studies.",
    },
  ],

  "education-loan-emi-calculator": [
    {
      question: "What is a moratorium period in an education loan?",
      answer: "It's the period during your course (plus usually 6-12 months after) when you're not required to make EMI payments. Interest still accrues during this time and is typically added to your principal — this calculator factors that in.",
    },
    {
      question: "Can I claim tax benefits on education loan interest?",
      answer: "Yes, in India, interest paid on education loans qualifies for a deduction under Section 80E, with no upper limit on the deduction amount, for up to 8 years or until the interest is fully repaid.",
    },
    {
      question: "Should I pay interest during the moratorium period if I can afford it?",
      answer: "Paying interest during the moratorium (simple interest, before it compounds into principal) can reduce your total loan cost significantly — many lenders offer a discount for this.",
    },
    {
      question: "How is the EMI calculated after the moratorium ends?",
      answer: "The accrued interest during the moratorium is added to the principal, and EMIs are then calculated on this new (higher) principal amount over the remaining tenure.",
    },
  ],

  "salary-calculator": [
    {
      question: "Why is my in-hand salary lower than my CTC divided by 12?",
      answer: "CTC includes components that don't reach your bank account directly — employer's EPF contribution, gratuity, insurance premiums — plus deductions like employee PF, professional tax, and TDS.",
    },
    {
      question: "Does this calculator account for the new vs old tax regime?",
      answer: "Yes, the calculation can be adjusted based on which tax regime you're under, since deductions and slab rates differ significantly between the two.",
    },
    {
      question: "What is EPF and why is it deducted?",
      answer: "Employee Provident Fund is a mandatory retirement savings deduction (typically 12% of basic pay), matched by an equal employer contribution, that builds a retirement corpus.",
    },
    {
      question: "Is my salary information private when using this tool?",
      answer: "Yes. All salary calculations execute 100% locally in your browser memory. Your CTC and tax figures are never transmitted to any external server or saved anywhere.",
    },
  ],

  "mortgage-calculator": [
    {
      question: "What does PITI stand for?",
      answer: "Principal, Interest, Taxes, and Insurance — the four components that typically make up a full monthly mortgage payment in the US.",
    },
    {
      question: "How does loan tenure affect total interest paid?",
      answer: "Longer tenures lower your monthly EMI but significantly increase total interest paid over the loan's life. Shorter tenures cost more per month but save substantially on total interest.",
    },
    {
      question: "Are there tax benefits on home loan interest?",
      answer: "In India, home loan interest is deductible under Section 24(b) (up to ₹2 lakh/year for self-occupied property) and principal repayment under Section 80C.",
    },
    {
      question: "Are my loan calculations saved on Yuitility?",
      answer: "No. All calculations run strictly in your browser memory. Your loan amount, interest rate, and property figures are 100% private and never uploaded to any server.",
    },
  ],

  "home-loan-emi-calculator": [
    {
      question: "What does PITI stand for?",
      answer: "Principal, Interest, Taxes, and Insurance — the four components that typically make up a full monthly mortgage payment in the US.",
    },
    {
      question: "How does loan tenure affect total interest paid?",
      answer: "Longer tenures lower your monthly EMI but significantly increase total interest paid over the loan's life. Shorter tenures cost more per month but save substantially on total interest.",
    },
    {
      question: "Are there tax benefits on home loan interest?",
      answer: "In India, home loan interest is deductible under Section 24(b) (up to ₹2 lakh/year for self-occupied property) and principal repayment under Section 80C.",
    },
    {
      question: "Are my loan calculations saved on Yuitility?",
      answer: "No. All calculations run strictly in your browser memory. Your loan amount, interest rate, and property figures are 100% private and never uploaded to any server.",
    },
  ],

  "bmi-calculator": [
    {
      question: "How is BMI calculated?",
      answer: "BMI is calculated by dividing body weight in kilograms by height in meters squared (kg/m²). For imperial units, multiply weight in pounds by 703 and divide by height in inches squared.",
    },
    {
      question: "What is a healthy BMI range for adults?",
      answer: "A standard healthy BMI range for adults is between 18.5 and 24.9. Below 18.5 is categorized as underweight, 25–29.9 as overweight, and 30 or above indicates obesity.",
    },
    {
      question: "Is BMI accurate for muscular individuals or athletes?",
      answer: "BMI does not distinguish between muscle mass and body fat. Muscular individuals or athletes may have a high BMI despite having low body fat, so it should be interpreted alongside other metrics.",
    },
    {
      question: "Is my personal height and weight data private?",
      answer: "Yes. Yuitility calculates your BMI 100% locally in your browser memory. No health measurements or personal inputs are uploaded to any server or saved in cookies.",
    },
  ],

  "emi-calculator": [
    {
      question: "How is loan EMI calculated?",
      answer: "EMI is calculated using the reducing balance formula: $E = P \\cdot r \\cdot \\frac{(1+r)^n}{(1+r)^n - 1}$, where $P$ is principal, $r$ is monthly interest rate, and $n$ is loan term in months.",
    },
    {
      question: "What is the difference between flat rate and reducing balance EMI?",
      answer: "In flat rate loans, interest is calculated on the full initial loan amount throughout the tenure. Reducing balance EMI calculates interest only on the remaining unpaid principal, saving you money.",
    },
    {
      question: "When should I choose a shorter loan tenure?",
      answer: "Choosing a shorter tenure increases your monthly EMI payment but significantly reduces the total interest cost over the life of the loan.",
    },
    {
      question: "Is my financial calculation data private?",
      answer: "Yes. All EMI and loan amortization calculations run strictly client-side in your device memory. Yuitility does not collect or transmit your financial inputs.",
    },
  ],

  "sip-calculator": [
    {
      question: "What is a Systematic Investment Plan (SIP)?",
      answer: "An SIP allows you to invest a fixed sum regularly into mutual funds. It instills financial discipline and leverages rupee cost averaging and compound interest growth over time.",
    },
    {
      question: "How does compound growth benefit SIP investments?",
      answer: "Compounding reinvests your investment returns, generating additional earnings on top of previous returns. Over 10 to 20 years, compound interest can double or triple your wealth.",
    },
    {
      question: "Can SIP returns be guaranteed?",
      answer: "No. Mutual fund SIP returns depend on market performance. The expected return rate in this calculator is an estimated benchmark for long-term financial planning.",
    },
    {
      question: "Is my investment plan data saved on your server?",
      answer: "No. All SIP forecasts compute locally inside your browser. No financial targets or investment amounts are saved or shared.",
    },
  ],

  "password-generator": [
    {
      question: "How does this tool generate secure passwords?",
      answer: "This tool uses the browser's built-in Web Crypto API (`window.crypto.getRandomValues`) to produce cryptographically random characters that cannot be predicted by attackers.",
    },
    {
      question: "Are generated passwords sent over the network?",
      answer: "Never. All passwords are generated 100% locally within your browser tab. No password data is ever uploaded to external servers or logged in database files.",
    },
    {
      question: "What length makes a password strong?",
      answer: "Security experts recommend passwords of at least 16 characters containing a mixture of uppercase, lowercase, numbers, and special symbols for 90+ bits of entropy.",
    },
    {
      question: "Can I use this tool offline?",
      answer: "Yes. Once the page is loaded, the password generator script resides in browser memory and works perfectly without an active internet connection.",
    },
  ],

  "qr-code-generator": [
    {
      question: "What data types can I encode in a QR code?",
      answer: "You can encode website URLs, plain text messages, WiFi network passwords, email addresses, phone numbers, and vCard contact details directly into QR code graphics.",
    },
    {
      question: "Do generated QR codes ever expire?",
      answer: "No. Static QR codes created with this tool embed the raw text data directly into the matrix code. They never expire and require no external redirection server.",
    },
    {
      question: "Which file format should I download for printing?",
      answer: "Download SVG for scalable vector printing on banners or business cards without pixelation. Download PNG for digital sharing, web pages, and documents.",
    },
    {
      question: "Is my QR code content tracked or saved?",
      answer: "No. The QR matrix is rendered directly on HTML5 canvas elements in your browser memory. Your links and passwords remain 100% private.",
    },
  ],

  "word-counter": [
    {
      question: "How does the word counter calculate reading time?",
      answer: "Reading time is estimated based on an average adult reading speed of 200 to 250 words per minute. Speaking time is calculated at 130 to 150 words per minute.",
    },
    {
      question: "Does this word counter count spaces and special characters?",
      answer: "Yes. The tool provides separate metrics for total character count with spaces, characters excluding spaces, total word count, sentence count, and paragraph count.",
    },
    {
      question: "Can I paste long essays or book chapters without lag?",
      answer: "Yes. The text parser is optimized for high-performance string tokenization, handling thousands of paragraphs instantly without sending data to servers.",
    },
    {
      question: "Is my written text stored or uploaded?",
      answer: "No. Your text remains strictly inside your browser window. Yuitility does not save, store, or transmit your draft content anywhere.",
    },
  ],

  "image-compressor": [
    {
      question: "How does browser-based image compression work?",
      answer: "Your browser decodes the image onto an HTML5 canvas and re-encodes it using WebP or JPEG lossy compression algorithms directly in local device RAM.",
    },
    {
      question: "How much file size reduction can I expect?",
      answer: "Depending on initial image dimensions and format, compression typically reduces file sizes by 40% to 80% with zero noticeable loss in visual quality.",
    },
    {
      question: "Are my private photos uploaded to a cloud server?",
      answer: "No. Unlike other compression sites that upload your photos to remote servers, Yuitility processes images 100% locally on your computer or phone.",
    },
    {
      question: "What image formats are supported?",
      answer: "The compressor supports PNG, JPG, JPEG, WebP, and GIF file uploads for instant compression and quality optimization.",
    },
  ],

  "json-formatter": [
    {
      question: "What is JSON formatting and beautifying?",
      answer: "JSON formatting parses raw, unformatted JSON strings into structured, color-coded trees with consistent indentation spaces for improved code readability and debugging.",
    },
    {
      question: "Can this tool fix invalid JSON syntax errors?",
      answer: "The tool detects syntax errors (like missing quotes, trailing commas, or unbalanced brackets) and highlights the exact line and position of the error.",
    },
    {
      question: "Is it safe to format sensitive API keys or JSON payload data?",
      answer: "Yes, 100% safe. Processing occurs entirely within your browser memory JavaScript engine. No JSON strings or API tokens are transmitted anywhere.",
    },
    {
      question: "Does the JSON formatter support collapsing nodes?",
      answer: "Yes. You can expand and collapse nested JSON objects and arrays to quickly navigate large payloads.",
    },
  ],

  "pdf-merger": [
    {
      question: "How many PDF files can I merge together at once?",
      answer: "You can combine dozens of PDF documents in a single operation. The merge speed depends on your local computer's memory and processor speed.",
    },
    {
      question: "Can I reorder PDF pages before merging?",
      answer: "Yes. You can drag and drop PDF thumbnails to arrange documents in your exact preferred sequence prior to generating the combined PDF.",
    },
    {
      question: "Are my confidential PDF documents uploaded to servers?",
      answer: "No. PDF page streams are spliced using client-side WebAssembly and PDF-Lib. Your files never leave your device.",
    },
    {
      question: "Does merging PDFs reduce document quality?",
      answer: "No. Text vector outlines, embedded fonts, images, and page dimensions are preserved without re-encoding quality degradation.",
    },
  ],
};

/**
 * Retrieve 4 high-quality, tailored FAQs for any tool
 */
export function getToolFaqs(tool: Tool): FAQItem[] {
  if (TOOL_FAQS_DB[tool.id]) {
    return TOOL_FAQS_DB[tool.id];
  }

  const toolName = tool.title;

  if (tool.category === "finance") {
    return [
      {
        question: `How is the ${toolName} calculated?`,
        answer: `The ${toolName} uses standard mathematical formulas for financial interest, amortization, and investment growth to compute exact values instantly as inputs change.`,
      },
      {
        question: `Can I change currencies in the ${toolName}?`,
        answer: `Yes. You can toggle between USD ($), EUR (€), GBP (£), INR (₹), AUD (A$), CAD (C$), JPY (¥), AED, and SGD using the currency selector menu.`,
      },
      {
        question: `Why should I use an online financial calculator?`,
        answer: `Financial calculators help you forecast future returns, evaluate loan costs, optimize repayment schedules, and make informed budgeting decisions without complex manual math.`,
      },
      {
        question: `Is my financial data uploaded or saved?`,
        answer: `No. All calculations run 100% locally within your browser memory. Yuitility does not store, track, or transmit your numbers to external servers.`,
      },
    ];
  }

  return [
    {
      question: `What does the ${toolName} do?`,
      answer: `The ${toolName} processes your inputs directly in your web browser to perform fast calculations, transformations, or data formatting without external tools.`,
    },
    {
      question: `Is the ${toolName} free to use?`,
      answer: `Yes. Yuitility provides the ${toolName} 100% free with no account creation, no usage caps, and no subscription fees.`,
    },
    {
      question: `Does the ${toolName} upload my files or personal data?`,
      answer: `No. All file processing, image conversion, and data math execute locally on your device. Your data never leaves your browser window.`,
    },
    {
      question: `Can I use the ${toolName} offline?`,
      answer: `Yes. Once the page is loaded, the client-side JavaScript execution code remains active in memory, allowing offline use without an active internet connection.`,
    },
  ];
}
