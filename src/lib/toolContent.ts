import { FAQItem, Tool } from "@/src/types";

/**
 * Priority 1, Priority 2, and Tool Content Pack "How It Works" Descriptions
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
  "emi-calculator":
    "Enter your loan principal, annual interest rate, and tenure in months or years. The calculator uses the standard reducing-balance formula to show your monthly EMI, total interest payable, and total repayment amount.",
  "sip-calculator":
    "Enter your monthly investment amount, expected annual return rate, and investment duration. The calculator projects your total invested amount, estimated returns, and final corpus using compound growth.",
  "car-loan-emi-calculator":
    "Enter the vehicle's on-road price, down payment, interest rate, and tenure. The calculator computes your monthly EMI and total interest over the loan period.",
  "bike-loan-emi-calculator":
    "Enter the two-wheeler's on-road price, down payment amount, interest rate, and tenure to calculate your monthly EMI and total repayment.",
  "personal-loan-emi-calculator":
    "Enter your loan amount, interest rate, and tenure. The calculator shows your EMI, total interest, and total repayment, and can factor in processing fees for a true cost comparison.",
  "retirement-calculator":
    "Enter your current age, target retirement age, expected monthly expenses, and expected returns. The calculator projects your required retirement corpus, adjusted for inflation, and the monthly savings needed to reach it.",
  "fd-calculator":
    "Enter your deposit amount, interest rate, and tenure. The calculator computes your maturity value based on the compounding frequency (typically quarterly for Indian bank FDs).",
  "rd-calculator":
    "Enter your monthly deposit amount, interest rate, and tenure. The calculator computes your maturity value, accounting for the fact that each monthly deposit earns interest for a different duration.",
  "compound-interest-calculator":
    "Enter your principal, interest rate, compounding frequency, and duration. Optionally add regular monthly contributions to see how they affect total growth. The calculator shows your final amount and total interest earned.",
  "simple-interest-calculator":
    "Enter your principal, interest rate, and time period. The calculator computes interest using I = P × R × T, along with the total amount (principal + interest).",
  "ppf-calculator":
    "Enter your annual contribution amount and the calculator projects your PPF balance over the standard 15-year tenure, including compounded interest and applicable tax benefits.",
  "bmi-calculator":
    "Enter your height and weight. The calculator computes your Body Mass Index (weight in kg / height in meters squared) and shows which standard health category it falls into.",
  "json-formatter":
    "Paste your JSON data and the tool formats (pretty-prints) it with proper indentation, validates the syntax, and flags any errors like missing commas or mismatched brackets.",
  "password-generator":
    "Choose your desired password length and character types (uppercase, lowercase, numbers, symbols). The tool generates a cryptographically random password locally in your browser.",
  "qr-code-generator":
    "Enter the content you want encoded (URL, text, WiFi credentials, contact info) and the tool generates a scannable QR code, downloadable as PNG or SVG.",
  "word-counter":
    "Paste or type your text and the tool instantly shows word count, character count (with and without spaces), estimated reading time, and keyword density.",
  "image-compressor":
    "Upload a JPG, PNG, or WebP image and the tool reduces file size while preserving visual quality, processed entirely in your browser.",
  "background-remover":
    "Upload an image and the tool automatically detects and removes the background, producing a transparent PNG output you can use on any background.",
  "image-resizer":
    "Upload an image and specify your target width and height (or a percentage scale). The tool resizes the image while giving you control over aspect ratio locking.",
  "pdf-merger":
    "Upload multiple PDF files, reorder them as needed, and the tool combines them into a single PDF document, processed locally in your browser.",
  "pdf-splitter":
    "Upload a PDF and specify the page range(s) you want to extract, or split into individual pages. The tool outputs the selected pages as a new PDF.",
  "image-to-pdf":
    "Upload one or more images (JPG, PNG, WebP) and the tool converts them into a single PDF document, with each image becoming a page.",
  "color-palette":
    "Generate harmonious color schemes, extract palettes from images, or test contrast ratios. Copy HEX, RGB, and HSL values instantly for web design and frontend projects.",
  "pdf-watermark":
    "Upload a PDF document and add custom text or image watermarks. Adjust font size, opacity, rotation, and alignment with 100% browser-side privacy.",
  "pdf-metadata": "Upload a PDF file to view and edit title, author, subject, keywords, and creator metadata fields. Save updated PDF files instantly with no server upload.",
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
  "interest-calculator":
    "Enter principal amount, interest rate, time period, and compounding frequency to compare simple vs compound interest earnings over time.",
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
 * Priority 1, Priority 2, and Content Pack FAQ Database
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

  "emi-calculator": [
    {
      question: "How is EMI calculated?",
      answer: "EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal, R is the monthly interest rate, and N is the number of monthly installments.",
    },
    {
      question: "Why does more interest get paid in the early months?",
      answer: "In a reducing-balance loan, interest is calculated on the outstanding principal. Early on, the outstanding balance is highest, so a larger share of each EMI goes toward interest rather than principal.",
    },
    {
      question: "Does prepayment reduce my EMI or my tenure?",
      answer: "Depends on the lender's policy — some reduce your tenure while keeping EMI the same, others reduce your EMI while keeping tenure the same. Check with your lender which option applies.",
    },
    {
      question: "Is a lower EMI always better?",
      answer: "Not necessarily — a lower EMI usually means a longer tenure, which increases total interest paid over the life of the loan.",
    },
  ],

  "sip-calculator": [
    {
      question: "What is a SIP?",
      answer: "A Systematic Investment Plan lets you invest a fixed amount regularly (usually monthly) into a mutual fund, rather than investing a lump sum at once.",
    },
    {
      question: "How accurate are SIP return projections?",
      answer: "Projections use an assumed constant annual return rate for simplicity, but actual mutual fund returns fluctuate year to year. Treat projections as an estimate, not a guarantee.",
    },
    {
      question: "Does SIP investing average out market volatility?",
      answer: "Yes — this is called rupee-cost averaging. Investing a fixed amount regularly means you buy more units when prices are low and fewer when prices are high, which can smooth out volatility over time.",
    },
    {
      question: "Why does the corpus grow faster in later years?",
      answer: "Compounding accelerates over time as returns are generated on both your contributions and previously accumulated returns, so the growth curve is not linear.",
    },
  ],

  "car-loan-emi-calculator": [
    {
      question: "Should I calculate EMI on ex-showroom or on-road price?",
      answer: "On-road price, since that includes registration, insurance, and other charges that most lenders finance as part of the loan amount.",
    },
    {
      question: "How much does a larger down payment save?",
      answer: "A larger down payment reduces the principal being financed, which lowers both your EMI and the total interest paid — often more significantly than people expect on higher-interest auto loans.",
    },
    {
      question: "What's a typical tenure for a car loan?",
      answer: "Commonly 3-7 years, though shorter tenures reduce total interest paid at the cost of a higher monthly EMI.",
    },
    {
      question: "Is my car loan calculation saved online?",
      answer: "No. All calculation figures execute 100% locally in your browser memory. Your loan details are never uploaded or tracked.",
    },
  ],

  "bike-loan-emi-calculator": [
    {
      question: "What's included in on-road price for a bike?",
      answer: "Ex-showroom price plus RTO registration, insurance, and sometimes accessories — financing based on on-road price avoids underestimating your actual loan need.",
    },
    {
      question: "Are bike loan interest rates higher than car loan rates?",
      answer: "Often yes, since two-wheelers depreciate faster and are considered slightly higher risk collateral by some lenders.",
    },
    {
      question: "What tenure is typical for bike loans?",
      answer: "Usually 1-4 years, shorter than car loans given the lower loan amounts involved.",
    },
    {
      question: "Does this bike loan calculator work for scooters?",
      answer: "Yes. It works for all two-wheelers including motorcycles, electric scooters, and mopeds.",
    },
  ],

  "personal-loan-emi-calculator": [
    {
      question: "Why are personal loan interest rates higher than secured loans?",
      answer: "Personal loans are unsecured (no collateral), so lenders charge higher rates to offset their higher risk compared to loans backed by property or vehicles.",
    },
    {
      question: "How do processing fees affect the real cost of a loan?",
      answer: "A 1-3% processing fee effectively raises your real borrowing cost above the stated interest rate — always compare the effective annual cost, not just the advertised rate, when choosing between lenders.",
    },
    {
      question: "Can I prepay a personal loan without penalty?",
      answer: "This varies by lender — many charge a prepayment penalty on personal loans, unlike some home loans where regulations limit such charges. Check your loan agreement.",
    },
    {
      question: "Is my personal financial data private?",
      answer: "Yes. Calculations run strictly in your browser memory with zero server uploads.",
    },
  ],

  "retirement-calculator": [
    {
      question: "Why does inflation matter so much in retirement planning?",
      answer: "Over 20-30 years, even moderate inflation significantly erodes purchasing power — expenses that feel comfortable today will cost substantially more by the time you retire, so plans need to account for this.",
    },
    {
      question: "How is the required corpus calculated?",
      answer: "Generally by estimating your annual post-retirement expenses (inflation-adjusted) and calculating the lump sum needed to sustain those withdrawals for your expected retirement duration, accounting for continued investment growth.",
    },
    {
      question: "What return rate should I assume?",
      answer: "This depends on your investment mix — conservative (largely debt) portfolios might assume 6-8%, while equity-heavy portfolios might assume higher long-term averages, though actual returns vary and are never guaranteed.",
    },
    {
      question: "Is my retirement goal stored anywhere?",
      answer: "No. All projections execute locally in your browser memory with zero server tracking.",
    },
  ],

  "fd-calculator": [
    {
      question: "How often does bank FD interest compound?",
      answer: "Most Indian banks compound FD interest quarterly, though this varies — check your specific bank's terms, since monthly vs quarterly compounding changes your maturity value.",
    },
    {
      question: "Is FD interest taxable?",
      answer: "Yes, in India, FD interest is added to your taxable income and taxed at your applicable slab rate, with TDS deducted by the bank if interest exceeds the threshold.",
    },
    {
      question: "What's the difference between cumulative and non-cumulative FDs?",
      answer: "Cumulative FDs reinvest interest and pay out the full amount at maturity; non-cumulative FDs pay interest periodically (monthly/quarterly) as income instead.",
    },
    {
      question: "Can I use this FD calculator for NRE/NRO fixed deposits?",
      answer: "Yes, it works for standard resident FDs as well as NRE and NRO fixed deposits.",
    },
  ],

  "rd-calculator": [
    {
      question: "Why is RD's effective return different from FD at the same rate?",
      answer: "Since RD deposits are made monthly rather than as a lump sum, each installment earns interest for a shorter period than the full tenure, resulting in a lower effective annualized return than an FD at the same stated rate.",
    },
    {
      question: "Can I withdraw an RD before maturity?",
      answer: "Most banks allow premature withdrawal, but usually with a penalty (reduced interest rate) — check your bank's specific terms.",
    },
    {
      question: "Is RD interest taxable?",
      answer: "Yes, similar to FD, RD interest is taxable as income at your applicable slab rate in India.",
    },
    {
      question: "Is my deposit data saved anywhere?",
      answer: "No. Calculations execute strictly client-side with zero data uploads.",
    },
  ],

  "compound-interest-calculator": [
    {
      question: "How does compounding frequency affect returns?",
      answer: "More frequent compounding (daily/monthly vs annual) results in slightly higher effective returns at the same nominal rate, since interest itself starts earning interest sooner.",
    },
    {
      question: "What's the difference between simple and compound interest?",
      answer: "Simple interest is calculated only on the original principal throughout the term. Compound interest is calculated on the principal plus previously accumulated interest, causing growth to accelerate over time.",
    },
    {
      question: "How much difference do regular contributions make?",
      answer: "Adding regular contributions on top of a lump sum can significantly increase the final corpus compared to a one-time deposit alone, especially over long durations, since each contribution has its own compounding runway.",
    },
    {
      question: "Is my investment growth data saved on your server?",
      answer: "No. Compound interest calculations run 100% in your browser memory.",
    },
  ],

  "simple-interest-calculator": [
    {
      question: "Where is simple interest actually used?",
      answer: "Less common in everyday lending than people assume — most consumer loans and deposits use compound interest. Simple interest typically appears in certain short-term loans, bonds, or as a simplified teaching example.",
    },
    {
      question: "How is simple interest different from compound interest?",
      answer: "Simple interest is calculated only on the original principal for the entire period, while compound interest also earns returns on previously accumulated interest.",
    },
    {
      question: "Does the time period need to be in years?",
      answer: "The formula works with any consistent time unit as long as the interest rate matches that unit — most commonly expressed as an annual rate with time in years.",
    },
    {
      question: "Is my calculation saved anywhere?",
      answer: "No. All simple interest calculations run 100% locally in browser memory.",
    },
  ],

  "ppf-calculator": [
    {
      question: "How is PPF interest calculated?",
      answer: "Interest is compounded annually but calculated monthly based on the lowest balance in your account between the 5th and last day of each month.",
    },
    {
      question: "Why does depositing before the 5th of the month matter?",
      answer: "Since interest is calculated on the lowest balance between the 5th and month-end, depositing before the 5th ensures that month's contribution earns interest starting that same month, rather than missing out.",
    },
    {
      question: "Is PPF interest and maturity amount taxable?",
      answer: "No — PPF falls under the EEE (Exempt-Exempt-Exempt) tax category in India, meaning contributions, interest earned, and maturity proceeds are all tax-free, subject to applicable limits.",
    },
    {
      question: "What is the maximum investment limit in PPF per year?",
      answer: "The maximum contribution allowed in a PPF account is ₹1.5 lakh per financial year.",
    },
  ],

  "bmi-calculator": [
    {
      question: "What are the standard BMI categories?",
      answer: "Generally: below 18.5 is underweight, 18.5-24.9 is normal weight, 25-29.9 is overweight, and 30+ is considered obese, though these thresholds are population-level guidelines, not individual diagnoses.",
    },
    {
      question: "Is BMI accurate for everyone?",
      answer: "No — BMI doesn't distinguish muscle mass from fat, so athletes or muscular individuals can register as \"overweight\" despite low body fat. It's a screening tool, not a precise individual health measure.",
    },
    {
      question: "What other measures complement BMI?",
      answer: "Waist circumference, body fat percentage, and waist-to-hip ratio are commonly used alongside BMI for a fuller picture of health risk.",
    },
    {
      question: "Is my weight data saved or tracked?",
      answer: "No. All calculations run strictly in your browser memory. Your measurements are 100% private.",
    },
  ],

  "json-formatter": [
    {
      question: "What common JSON errors does this catch?",
      answer: "Trailing commas, mismatched brackets/braces, unquoted keys, and invalid escape sequences are among the most common issues flagged.",
    },
    {
      question: "Is my data sent to a server?",
      answer: "No — formatting and validation run entirely in your browser, so nothing you paste is uploaded anywhere, which matters if you're working with API responses or config containing sensitive data.",
    },
    {
      question: "Can I minify JSON with this tool too?",
      answer: "Yes, most JSON formatters offer both a \"beautify\" (pretty-print) and \"minify\" (compact, whitespace-removed) option.",
    },
    {
      question: "Does it format large JSON files quickly?",
      answer: "Yes. The client-side parser formats large payloads in milliseconds directly in device RAM.",
    },
  ],

  "password-generator": [
    {
      question: "Is length or complexity more important for password strength?",
      answer: "Length generally matters more — a longer passphrase with moderate complexity is typically harder to crack than a short password stuffed with special characters.",
    },
    {
      question: "Is it safe to generate passwords online?",
      answer: "It's safe if the generation happens entirely client-side (in your browser) rather than being sent to and generated on a server — check that the tool you're using works this way.",
    },
    {
      question: "Should I use a different password for every account?",
      answer: "Yes — reusing passwords means a breach on one site can compromise your accounts elsewhere. A password manager paired with generated unique passwords is the standard recommendation.",
    },
    {
      question: "Does Yuitility store my generated passwords?",
      answer: "Never. Passwords are generated in your local browser tab memory using Web Crypto API.",
    },
  ],

  "qr-code-generator": [
    {
      question: "Should I download QR codes as PNG or SVG?",
      answer: "SVG for anything that will be printed or resized, since it stays sharp at any size. PNG is fine for fixed-size digital use like social media posts.",
    },
    {
      question: "Do QR codes expire?",
      answer: "Static QR codes (encoding the content directly) never expire. Dynamic QR codes (that redirect through a service) can expire if the underlying service is discontinued.",
    },
    {
      question: "How much data can a QR code hold?",
      answer: "Depends on the QR code version and error correction level, but typically up to a few thousand characters — more than enough for URLs, contact info, or short text.",
    },
    {
      question: "Is my QR code payload tracked?",
      answer: "No. The vector canvas renders locally on your device without server communication.",
    },
  ],

  "word-counter": [
    {
      question: "How is reading time calculated?",
      answer: "Typically based on an average reading speed (around 200-250 words per minute for adults), giving an estimate rather than an exact figure since actual reading speed varies by person and content complexity.",
    },
    {
      question: "Does hyphenated word count as one word or two?",
      answer: "This varies by tool and by the specific style guide you're following — worth checking if you're hitting a strict word count requirement for a submission.",
    },
    {
      question: "What is keyword density used for?",
      answer: "It shows how frequently specific words appear relative to total word count, often used in content/SEO writing to check if a target keyword is over- or under-used.",
    },
    {
      question: "Is my typed text saved or sent to a server?",
      answer: "No. Text parsing executes entirely within your browser memory window.",
    },
  ],

  "image-compressor": [
    {
      question: "Does compression reduce image quality?",
      answer: "Some compression is \"lossy\" (small quality tradeoff for major size reduction) while some is \"lossless\" (no quality loss, smaller size reduction) — most everyday use cases benefit from lossy compression since the difference is barely visible.",
    },
    {
      question: "Why does image compression matter for websites?",
      answer: "Large uncompressed images are one of the most common causes of slow page load times, which affects both user experience and search engine rankings.",
    },
    {
      question: "Is WebP better than JPG?",
      answer: "WebP typically achieves better compression than JPG at similar visual quality and is supported by all modern browsers, making it a good default for web use.",
    },
    {
      question: "Are my photos uploaded to a cloud server?",
      answer: "No. Compression runs 100% locally on your browser canvas.",
    },
  ],

  "background-remover": [
    {
      question: "What image types work best for background removal?",
      answer: "Clear subject-background contrast (like product photos or portraits with a plain background) tends to produce the cleanest results compared to busy or low-contrast backgrounds.",
    },
    {
      question: "What format is the output?",
      answer: "A transparent PNG, which preserves the removed-background area so you can layer the subject onto any new background.",
    },
    {
      question: "Can this be used for product photos?",
      answer: "Yes, it's commonly used for e-commerce listings — a clean transparent or white background on product photos often performs better for conversions than a busy original background.",
    },
    {
      question: "Is my photo sent to an AI cloud server?",
      answer: "No. Background removal models run directly in your local browser WebAssembly environment.",
    },
  ],

  "image-resizer": [
    {
      question: "Should I lock the aspect ratio when resizing?",
      answer: "Generally yes, unless you specifically want to stretch/distort the image — locking aspect ratio prevents unwanted warping.",
    },
    {
      question: "Does resizing reduce file size too?",
      answer: "Often yes, since fewer pixels typically means a smaller file, though for maximum size reduction pairing resize with compression is more effective.",
    },
    {
      question: "What are common social media image dimensions?",
      answer: "These vary by platform and post type (feed post vs story vs banner) — worth checking current platform specs since they change occasionally, rather than assuming universal dimensions.",
    },
    {
      question: "Are my images uploaded during resizing?",
      answer: "No. Resizing is performed 100% locally using HTML5 canvas elements.",
    },
  ],

  "pdf-merger": [
    {
      question: "Can I reorder pages before merging?",
      answer: "Yes, most PDF mergers let you drag-and-drop to set the final page order before combining, which avoids having to redo the merge if the order comes out wrong.",
    },
    {
      question: "Does merging affect the original files?",
      answer: "No, merging creates a new combined file — your original individual PDFs remain unchanged.",
    },
    {
      question: "Is there a limit to how many PDFs I can merge?",
      answer: "This depends on the tool, though most browser-based mergers can comfortably handle a reasonable number of files without issue for typical use cases.",
    },
    {
      question: "Are my PDF documents uploaded to cloud servers?",
      answer: "No. PDF merging executes 100% in your browser memory.",
    },
  ],

  "pdf-splitter": [
    {
      question: "Can I extract just one page from a larger document?",
      answer: "Yes, specifying a single-page range extracts just that page as its own PDF.",
    },
    {
      question: "Does splitting affect the original PDF?",
      answer: "No, splitting creates new file(s) from the selected ranges — the original document is untouched.",
    },
    {
      question: "Why would I split a PDF instead of screenshotting a page?",
      answer: "Splitting preserves the original quality, text selectability, and any embedded data, whereas a screenshot is a flattened image that loses text searchability and can look blurry.",
    },
    {
      question: "Is my document uploaded anywhere?",
      answer: "No. Page extraction is executed locally on your computer.",
    },
  ],

  "image-to-pdf": [
    {
      question: "Can I combine multiple images into one PDF?",
      answer: "Yes, uploading several images typically creates a multi-page PDF with each image as its own page, in the order uploaded.",
    },
    {
      question: "Does image quality get preserved in the PDF?",
      answer: "Generally yes, though very large images may be compressed somewhat to keep the resulting PDF file size reasonable.",
    },
    {
      question: "Why convert images to PDF instead of just sharing the images?",
      answer: "PDFs are a more universal format for documents (forms, scanned pages, receipts) and keep multiple pages together as one file, which is easier to share, print, or submit than separate image files.",
    },
    {
      question: "Are my photos sent to a server during PDF creation?",
      answer: "No. PDF assembly runs 100% locally in your browser tab.",
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
