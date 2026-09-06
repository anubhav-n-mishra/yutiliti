import { FAQItem } from "./site";

export interface ToolPreset {
  toolId: string;
  presetSlug: string;
  seoTitle: string; // Must be <= 60 chars
  seoDescription: string; // Must be 70-190 chars
  h1: string;
  subtitle: string;
  badge: string;
  category: string;
  presetParams: Record<string, any>;
  faqs: FAQItem[];
  officialReference?: {
    title: string;
    authority: string;
    citation: string;
    url?: string;
  };
}

export const TOOL_PRESETS: ToolPreset[] = [
  // =========================================================================
  // 1. UNIVERSITY CGPA CONVERSION PRESETS (cgpa-to-percentage-calculator)
  // =========================================================================
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "vtu",
    category: "math",
    seoTitle: "VTU CGPA to Percentage Calculator: (CGPA−0.75)×10", // 49 chars
    seoDescription:
      "Convert VTU CGPA to percentage using the official Visvesvaraya Technological University formula (CGPA - 0.75) * 10 with circular citations and instant division calculation.", // 173 chars
    h1: "VTU CGPA to Percentage Calculator",
    subtitle: "Official Visvesvaraya Technological University (VTU Belagavi) Conversion Formula: (CGPA − 0.75) × 10",
    badge: "VTU Official Circular (2016-17/10006)",
    presetParams: {
      initialUniversity: "vtu",
      initialCgpa: 8.0,
    },
    officialReference: {
      title: "VTU CGPA to Percentage Conversion Notification",
      authority: "Visvesvaraya Technological University, Belagavi",
      citation: "Circular VTU/BGM/Aca-OS/Cirs/2016-17/10006 & CBCS Regulations",
      url: "https://vtu.ac.in",
    },
    faqs: [
      {
        question: "What is the official VTU formula to convert CGPA to percentage?",
        answer: "The official VTU formula is Percentage = (CGPA - 0.75) * 10. For example, if your VTU CGPA is 8.20, your percentage is (8.20 - 0.75) * 10 = 74.50%.",
      },
      {
        question: "Which VTU schemes use the (CGPA - 0.75) * 10 formula?",
        answer: "This formula applies to VTU 2015, 2017, 2018, and CBCS schemes across B.E, B.Tech, M.Tech, and MCA programs under Visvesvaraya Technological University.",
      },
      {
        question: "What is First Class with Distinction in VTU?",
        answer: "Under VTU regulations, a CGPA of 7.75 and above (70.0% or higher) earned in the first attempt qualifies for First Class with Distinction.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "anna-university",
    category: "math",
    seoTitle: "Anna University CGPA to Percentage Calculator: ×10", // 52 chars
    seoDescription:
      "Calculate Anna University CGPA to percentage using the official Regulation 2021 Clause 16.2 formula Percentage = CGPA * 10. Instant, accurate, and 100% private.", // 163 chars
    h1: "Anna University CGPA to Percentage Calculator",
    subtitle: "Official Anna University Chennai Conversion Formula: Percentage = CGPA × 10 (Regulation 2021 & 2017)",
    badge: "Anna University Reg 2021 Clause 16.2",
    presetParams: {
      initialUniversity: "anna",
      initialCgpa: 8.0,
    },
    officialReference: {
      title: "Anna University Regulations for B.E. / B.Tech",
      authority: "Anna University, Chennai (Centre for Academic Courses)",
      citation: "Clause 16.2 - Classification of the Degree Awarded",
      url: "https://www.annauniv.edu",
    },
    faqs: [
      {
        question: "What is Anna University's formula to convert CGPA to percentage?",
        answer: "Anna University explicitly uses the linear conversion formula: Percentage = CGPA * 10. A CGPA of 8.4 converts to exactly 84.0%.",
      },
      {
        question: "Does Anna University use a 9.5 multiplier?",
        answer: "No. While CBSE and AICTE suggest 9.5, Anna University officially mandates the multiplier of 10 for all engineering degree classifications.",
      },
      {
        question: "What CGPA is required for First Class with Distinction at Anna University?",
        answer: "A CGPA of 8.50 and above with no history of arrears qualifies for First Class with Distinction under Anna University regulations.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "mumbai-university",
    category: "math",
    seoTitle: "Mumbai University CGPA to Percentage: 7.1×CGPA+12", // 50 chars
    seoDescription:
      "Convert Mumbai University (MU) 10-point CGPA to equivalent percentage for engineering (7.1 * CGPA + 12) and arts/commerce faculties with official circular citations.", // 170 chars
    h1: "Mumbai University CGPA to Percentage Calculator",
    subtitle: "Official University of Mumbai Conversion Formula for Engineering: 7.1 × CGPA + 12 (CGPA ≥ 7.0)",
    badge: "University of Mumbai Circular VCD No. Exam/423",
    presetParams: {
      initialUniversity: "mumbai",
      initialCgpa: 8.0,
    },
    officialReference: {
      title: "Mumbai University CGPA to Percentage Conversion Circular",
      authority: "University of Mumbai Examination House",
      citation: "Circular No. UG/Exam/VCD/02 of 2018-19 & 7.1*CGPA+12 Formula",
      url: "https://mu.ac.in",
    },
    faqs: [
      {
        question: "What is the Mumbai University engineering CGPA to percentage formula?",
        answer: "For CGPA between 7.0 and 10.0 in engineering, Mumbai University uses Percentage = 7.1 * CGPA + 12. For CGPA under 7.0, it is Percentage = 7.4 * CGPA + 12.",
      },
      {
        question: "Does Mumbai University use different formulas for Arts and Commerce?",
        answer: "Yes, non-engineering faculties at Mumbai University use Percentage = 7.25 * CGPA + 11 for 10-point credit grading.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "ktu",
    category: "math",
    seoTitle: "KTU CGPA to Percentage Calculator: (CGPA−0.5)×10", // 48 chars
    seoDescription:
      "Calculate APJ Abdul Kalam Technological University (KTU Kerala) CGPA to percentage using the official formula (CGPA - 0.5) * 10 with verified academic circular citations.", // 173 chars
    h1: "KTU Kerala CGPA to Percentage Calculator",
    subtitle: "Official APJ Abdul Kalam Technological University Formula: Percentage = (CGPA − 0.5) × 10",
    badge: "KTU Academic Regulations Ordinance",
    presetParams: {
      initialUniversity: "ktu",
      initialCgpa: 8.0,
    },
    officialReference: {
      title: "KTU B.Tech Degree Regulations",
      authority: "APJ Abdul Kalam Technological University (Kerala)",
      citation: "KTU Academic Regulations Ordinance Section U.11",
      url: "https://ktu.edu.in",
    },
    faqs: [
      {
        question: "How do I convert KTU CGPA to percentage?",
        answer: "KTU specifies Percentage = (CGPA - 0.5) * 10. For example, a CGPA of 8.00 in KTU equals (8.00 - 0.5) * 10 = 75.00%.",
      },
      {
        question: "Is the KTU conversion formula valid for job applications?",
        answer: "Yes, the formula (CGPA - 0.5) * 10 is officially printed on KTU grade sheets and accepted by UPSC, PSC, TCS, Infosys, and international universities.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "cbse",
    category: "math",
    seoTitle: "CBSE CGPA to Percentage Calculator: Official ×9.5", // 50 chars
    seoDescription:
      "Convert CBSE Class 10 & 12 CGPA to equivalent percentage using the official CBSE Board formula: Percentage = CGPA * 9.5. Fast, accurate, and ad-free.", // 152 chars
    h1: "CBSE & Delhi University CGPA to Percentage Calculator",
    subtitle: "Official Central Board of Secondary Education & AICTE Standard: Percentage = CGPA × 9.5",
    badge: "CBSE Examination Bylaws Rule 42.1",
    presetParams: {
      initialUniversity: "cbse",
      initialCgpa: 8.4,
    },
    officialReference: {
      title: "CBSE Scheme of Examination and Grading Norms",
      authority: "Central Board of Secondary Education, New Delhi",
      citation: "CBSE Circular No. 40/2010 & AICTE Model Exam Guidelines",
      url: "https://cbse.gov.in",
    },
    faqs: [
      {
        question: "Why does CBSE multiply CGPA by 9.5?",
        answer: "CBSE analyzed marks scored by candidates over several years and determined that multiplying CGPA by 9.5 yields an accurate statistical approximation of percentage marks.",
      },
      {
        question: "How do I convert individual subject GPA in CBSE?",
        answer: "Multiply the subject Grade Point (GP) by 9.5. For instance, a Grade Point of 9 in Mathematics equals 9 * 9.5 = 85.5%.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "sppu",
    category: "math",
    seoTitle: "SPPU Pune CGPA to Percentage Calculator: (CGPA−0.75)×10", // 55 chars
    seoDescription:
      "Convert Savitribai Phule Pune University (SPPU / Unipune) CGPA to percentage for engineering and science with official circular formula (CGPA - 0.75) * 10.", // 157 chars
    h1: "SPPU Pune CGPA to Percentage Calculator",
    subtitle: "Official Savitribai Phule Pune University (Unipune) Formula: Percentage = (CGPA − 0.75) × 10",
    badge: "SPPU Circular No. 216/2020",
    presetParams: {
      initialUniversity: "sppu",
      initialCgpa: 8.0,
    },
    officialReference: {
      title: "SPPU Guidelines on Equivalence of CGPA to Percentage",
      authority: "Savitribai Phule Pune University (Unipune)",
      citation: "Circular No. 216/2020 on Credit System Degree Conversion",
      url: "http://unipune.ac.in",
    },
    faqs: [
      {
        question: "What is the SPPU Pune University CGPA formula?",
        answer: "SPPU uses Percentage = (CGPA - 0.75) * 10 for engineering and science degree courses following the credit-based grading system.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "gtu",
    category: "math",
    seoTitle: "GTU CGPA to Percentage Calculator: (CGPA−0.5)×10", // 48 chars
    seoDescription:
      "Convert Gujarat Technological University (GTU) CGPA and CPI to percentage using official GTU Circular formula Percentage = (CGPA - 0.5) * 10.", // 142 chars
    h1: "GTU CGPA & CPI to Percentage Calculator",
    subtitle: "Official Gujarat Technological University Formula: Percentage = (CGPA / CPI − 0.5) × 10",
    badge: "GTU Circular No. GTU/Circular/2012/10411",
    presetParams: {
      initialUniversity: "gtu",
      initialCgpa: 7.8,
    },
    officialReference: {
      title: "GTU Conversion Rule from CPI/CGPA to Percentage",
      authority: "Gujarat Technological University, Ahmedabad",
      citation: "Circular GTU/Conv_Formula/2012/10411",
      url: "https://www.gtu.ac.in",
    },
    faqs: [
      {
        question: "How is CPI converted to percentage in GTU?",
        answer: "GTU applies the exact same formula to both CPI and CGPA: Percentage = (CPI - 0.5) * 10.",
      },
    ],
  },
  {
    toolId: "cgpa-to-percentage-calculator",
    presetSlug: "aktu",
    category: "math",
    seoTitle: "AKTU CGPA to Percentage Calculator: Official ×10", // 49 chars
    seoDescription:
      "Calculate Dr. A.P.J. Abdul Kalam Technical University (AKTU / UPTU Lucknow) CGPA to percentage using the official formula: Percentage = CGPA * 10.", // 149 chars
    h1: "AKTU / UPTU CGPA to Percentage Calculator",
    subtitle: "Official Dr. A.P.J. Abdul Kalam Technical University Formula: Percentage = CGPA × 10",
    badge: "AKTU Ordinance on Grading System",
    presetParams: {
      initialUniversity: "aktu",
      initialCgpa: 8.2,
    },
    officialReference: {
      title: "AKTU Grading System and Conversion Regulations",
      authority: "Dr. A.P.J. Abdul Kalam Technical University, Lucknow",
      citation: "AKTU Ordinance Clause on Division and Percentage Equivalence",
      url: "https://aktu.ac.in",
    },
    faqs: [
      {
        question: "What is the official AKTU formula for converting CGPA?",
        answer: "AKTU specifies Percentage = CGPA * 10 for all undergraduate engineering (B.Tech) and postgraduate degrees.",
      },
    ],
  },

  // =========================================================================
  // 2. BANK-SPECIFIC HOME LOAN PRESETS (home-loan-emi-calculator)
  // =========================================================================
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "sbi-bank",
    category: "finance",
    seoTitle: "SBI Home Loan EMI Calculator: Compare Rates & Slabs", // 53 chars
    seoDescription:
      "Calculate State Bank of India (SBI) home loan monthly EMI, current interest rates (8.50% p.a.), tax savings under Sec 24b, and partial prepayment payoff schedules.", // 167 chars
    h1: "SBI Home Loan EMI Calculator",
    subtitle: "State Bank of India (SBI) Benchmark: 8.50% p.a. External Benchmark Lending Rate (EBLR)",
    badge: "SBI EBLR Benchmark (Sep 2026)",
    presetParams: {
      initialInterestRate: 8.5,
      initialPropertyPrice: 6000000,
      lenderName: "SBI Home Loan",
      initialCurrency: "INR",
    },
    officialReference: {
      title: "SBI Retail Lending Floating Interest Rates",
      authority: "State Bank of India",
      citation: "SBI External Benchmark Linked Lending Rate (EBLR) Guidelines",
      url: "https://sbi.co.in",
    },
    faqs: [
      {
        question: "What is the current SBI home loan interest rate in 2026?",
        answer: "SBI home loan interest rates start from 8.50% p.a. for borrowers with a CIBIL score of 750 and above, linked to the RBI Repo Rate (EBLR).",
      },
      {
        question: "Can I prepay my SBI home loan without penalties?",
        answer: "Yes, under RBI guidelines, SBI charges zero prepayment or foreclosure penalties on floating-rate individual home loans.",
      },
    ],
  },
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "hdfc-bank",
    category: "finance",
    seoTitle: "HDFC Home Loan EMI Calculator: Rates, EMI & Tax", // 49 chars
    seoDescription:
      "Calculate HDFC Bank home loan EMIs, 8.70% benchmark rate schedules, processing fees, and Section 24b tax deductions with full year-by-year amortization schedules.", // 164 chars
    h1: "HDFC Bank Home Loan EMI Calculator",
    subtitle: "HDFC Bank Benchmark Rate: 8.70% p.a. Retail Prime Lending Rate (RPLR)",
    badge: "HDFC Bank Benchmark (Sep 2026)",
    presetParams: {
      initialInterestRate: 8.7,
      initialPropertyPrice: 6000000,
      lenderName: "HDFC Bank",
      initialCurrency: "INR",
    },
    officialReference: {
      title: "HDFC Bank Housing Loan Rate Card",
      authority: "HDFC Bank Ltd",
      citation: "HDFC Retail Prime Lending Rate Structure and Spreads",
      url: "https://www.hdfcbank.com",
    },
    faqs: [
      {
        question: "What is the minimum down payment required by HDFC Bank?",
        answer: "HDFC Bank finances up to 80% of property cost for loans between ₹30 Lakhs and ₹75 Lakhs, meaning a minimum 20% down payment is required.",
      },
    ],
  },
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "icici-bank",
    category: "finance",
    seoTitle: "ICICI Home Loan EMI Calculator: 8.75% Rate & EMI", // 50 chars
    seoDescription:
      "Calculate ICICI Bank home loan EMI at 8.75% interest. View monthly installment breakdowns, prepayment interest cuts, and Section 24 tax relief.", // 146 chars
    h1: "ICICI Bank Home Loan EMI Calculator",
    subtitle: "ICICI Bank Benchmark Rate: 8.75% p.a. I-EBLR Lending Rate",
    badge: "ICICI Bank Benchmark (Sep 2026)",
    presetParams: {
      initialInterestRate: 8.75,
      initialPropertyPrice: 6000000,
      lenderName: "ICICI Bank",
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is ICICI Bank I-EBLR rate?",
        answer: "I-EBLR is ICICI Bank's External Benchmark Lending Rate pegged directly to the RBI repo rate. Home loan rates adjust automatically when repo rate changes.",
      },
    ],
  },
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "bank-of-baroda",
    category: "finance",
    seoTitle: "Bank of Baroda Home Loan EMI Calculator: 8.40%", // 48 chars
    seoDescription:
      "Calculate Bank of Baroda (BoB) home loan EMIs at competitive 8.40% interest rates. Model 20-year and 30-year repayments with zero prepayment penalty.", // 152 chars
    h1: "Bank of Baroda Home Loan EMI Calculator",
    subtitle: "Bank of Baroda Baroda Home Loan Benchmark: 8.40% p.a. BRLLR",
    badge: "Bank of Baroda Benchmark (Sep 2026)",
    presetParams: {
      initialInterestRate: 8.4,
      initialPropertyPrice: 6000000,
      lenderName: "Bank of Baroda",
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "Why is Bank of Baroda home loan interest rate among the lowest?",
        answer: "Public sector banks like Bank of Baroda offer lower markups over the RBI repo rate (BRLLR) for high CIBIL score borrowers.",
      },
    ],
  },

  // =========================================================================
  // 3. LOAN AMOUNT PRESETS (home-loan-emi-calculator)
  // =========================================================================
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "30-lakhs",
    category: "finance",
    seoTitle: "30 Lakh Home Loan EMI: Monthly Payment & Schedule", // 51 chars
    seoDescription:
      "Calculate 30 Lakh home loan monthly EMI at 8.5% interest across 10, 20, and 30 years. Compare total interest, tax savings, and prepayment payoff dates.", // 154 chars
    h1: "₹30 Lakh Home Loan EMI Calculator",
    subtitle: "Complete repayment schedule, interest cost, and tax deductions for a ₹30,00,000 housing loan",
    badge: "₹30 Lakh Principal Preset",
    presetParams: {
      initialPropertyPrice: 3750000, // 80% LTV = 30 Lakhs loan
      initialInterestRate: 8.5,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is the monthly EMI for a 30 Lakh home loan for 20 years?",
        answer: "At 8.5% interest, the monthly EMI for a ₹30 Lakh home loan for 20 years is ₹26,035. Total interest paid over 20 years is ₹32,48,328.",
      },
    ],
  },
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "50-lakhs",
    category: "finance",
    seoTitle: "50 Lakh Home Loan EMI: Monthly Cost & Interest", // 49 chars
    seoDescription:
      "Calculate monthly EMI for a 50 Lakh home loan at 8.5% p.a. for 20 years (₹43,391/mo). View total interest cost, amortization schedule, and prepayment impact.", // 160 chars
    h1: "₹50 Lakh Home Loan EMI Calculator",
    subtitle: "Complete repayment schedule, interest cost, and tax deductions for a ₹50,00,000 housing loan",
    badge: "₹50 Lakh Principal Preset",
    presetParams: {
      initialPropertyPrice: 6250000, // 80% LTV = 50 Lakhs loan
      initialInterestRate: 8.5,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is the EMI for 50 Lakh home loan for 20 years?",
        answer: "At 8.5% interest, your monthly EMI for ₹50 Lakhs for 20 years is ₹43,391. Total amount payable is ₹1,04,13,879, of which ₹54,13,879 is interest.",
      },
    ],
  },
  {
    toolId: "home-loan-emi-calculator",
    presetSlug: "1-crore",
    category: "finance",
    seoTitle: "1 Crore Home Loan EMI: Monthly Cost & Schedule", // 49 chars
    seoDescription:
      "Calculate 1 Crore home loan monthly EMI at 8.5% (₹86,782/mo for 20 yrs). Analyze tax deduction limits under Section 24b and partial prepayment savings.", // 153 chars
    h1: "₹1 Crore Home Loan EMI Calculator",
    subtitle: "Complete repayment schedule, interest cost, and tax deductions for a ₹1,00,00,000 luxury home loan",
    badge: "₹1 Crore Principal Preset",
    presetParams: {
      initialPropertyPrice: 12500000, // 80% LTV = 1 Crore loan
      initialInterestRate: 8.5,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is the monthly EMI for a 1 Crore home loan for 20 years?",
        answer: "At 8.5% interest, the EMI for ₹1 Crore for 20 years is ₹86,782/month. Total interest payable is ₹1.08 Crore.",
      },
    ],
  },

  // =========================================================================
  // 4. SIP CONTRIBUTION & WEALTH PRESETS (sip-calculator)
  // =========================================================================
  {
    toolId: "sip-calculator",
    presetSlug: "5000-per-month",
    category: "finance",
    seoTitle: "5000 Per Month SIP: 10, 15 & 20 Year Wealth Returns", // 53 chars
    seoDescription:
      "Forecast ₹5,000 monthly SIP returns at 12% annual CAGR over 10, 15, and 20 years. Model inflation purchasing power and annual step-up contribution growth.", // 156 chars
    h1: "₹5,000 Monthly SIP Calculator",
    subtitle: "Discover how a disciplined ₹5,000/month mutual fund investment compounds into wealth over 15 to 20 years",
    badge: "₹5,000/Month Preset",
    presetParams: {
      initialMonthlyInvestment: 5000,
      initialDuration: 15,
      initialExpectedReturn: 12,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "How much will ₹5,000 monthly SIP grow to in 15 years?",
        answer: "At an expected 12% annual return, investing ₹5,000 per month for 15 years (total investment ₹9 Lakhs) grows to approximately ₹25,22,880.",
      },
    ],
  },
  {
    toolId: "sip-calculator",
    presetSlug: "10000-per-month",
    category: "finance",
    seoTitle: "10000 Per Month SIP: 15 & 20 Year Wealth Forecast", // 51 chars
    seoDescription:
      "Calculate maturity wealth for a ₹10,000 monthly SIP at 12% return. See how a 10% annual step-up turns your investment into over ₹1.5 Crore.", // 142 chars
    h1: "₹10,000 Monthly SIP Calculator",
    subtitle: "Forecast compound wealth and inflation purchasing power for ₹10,000 monthly mutual fund investments",
    badge: "₹10,000/Month Preset",
    presetParams: {
      initialMonthlyInvestment: 10000,
      initialDuration: 15,
      initialExpectedReturn: 12,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "How much wealth does ₹10,000 monthly SIP create in 20 years?",
        answer: "At 12% CAGR, ₹10,000 per month for 20 years yields approximately ₹99,91,479 (~₹1 Crore) on an invested capital of ₹24 Lakhs.",
      },
    ],
  },
  {
    toolId: "sip-calculator",
    presetSlug: "1-crore-target",
    category: "finance",
    seoTitle: "1 Crore SIP Calculator: Monthly Target & Tenure", // 49 chars
    seoDescription:
      "Calculate exact monthly SIP investment required to reach ₹1 Crore corpus in 10, 15, or 20 years at 12% expected mutual fund returns with inflation metrics.", // 156 chars
    h1: "₹1 Crore Target SIP Calculator",
    subtitle: "Find the exact monthly SIP contribution needed to achieve your ₹1,00,00,000 financial freedom goal",
    badge: "₹1 Crore Goal Preset",
    presetParams: {
      initialMonthlyInvestment: 20000,
      initialDuration: 15,
      initialExpectedReturn: 12,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "How much should I invest monthly to get 1 Crore in 15 years?",
        answer: "At a 12% annual CAGR, you need to invest approximately ₹19,820 per month to accumulate a ₹1 Crore corpus in 15 years.",
      },
    ],
  },

  // =========================================================================
  // 5. SALARY CTC IN-HAND PRESETS (salary-calculator)
  // =========================================================================
  {
    toolId: "salary-calculator",
    presetSlug: "6-lakhs-ctc",
    category: "finance",
    seoTitle: "6 LPA In-Hand Salary: Monthly Take Home & EPF", // 47 chars
    seoDescription:
      "Calculate in-hand take-home monthly salary for ₹6 Lakhs CTC under New Tax Regime FY 2025-26. See employee EPF, professional tax, and zero income tax benefit.", // 159 chars
    h1: "₹6 LPA In-Hand Salary Calculator",
    subtitle: "Detailed monthly gross, EPF deductions, and take-home pay for an annual CTC of ₹6,00,000",
    badge: "₹6 LPA CTC Preset",
    presetParams: {
      initialCtc: 600000,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "Is income tax deducted on a 6 LPA salary in India?",
        answer: "No. Under the New Tax Regime (Section 115BAC), taxable income up to ₹7 Lakhs is eligible for full tax rebate under Section 87A, resulting in ₹0 income tax.",
      },
    ],
  },
  {
    toolId: "salary-calculator",
    presetSlug: "10-lakhs-ctc",
    category: "finance",
    seoTitle: "10 LPA In-Hand Salary: Monthly Pay & Tax Breakdown", // 52 chars
    seoDescription:
      "Calculate monthly in-hand take home salary for 10 Lakhs CTC under New Tax Regime. Breaks down basic pay, EPF, professional tax, and net bank credit.", // 150 chars
    h1: "₹10 LPA In-Hand Salary Calculator",
    subtitle: "Detailed monthly gross, EPF deductions, and tax liability for an annual CTC of ₹10,00,000",
    badge: "₹10 LPA CTC Preset",
    presetParams: {
      initialCtc: 1000000,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is the monthly in-hand salary for 10 LPA CTC?",
        answer: "For a 10 LPA CTC, assuming standard 50% basic and capped EPF, the monthly in-hand salary is approximately ₹72,000 to ₹75,000 after EPF and New Regime tax.",
      },
    ],
  },
  {
    toolId: "salary-calculator",
    presetSlug: "15-lakhs-ctc",
    category: "finance",
    seoTitle: "15 LPA In-Hand Salary: Monthly Take-Home & Taxes", // 50 chars
    seoDescription:
      "Calculate in-hand monthly salary for 15 Lakhs CTC in India. Detailed breakdown of ₹75,000 standard deduction, slab taxes under New Regime, and EPF.", // 148 chars
    h1: "₹15 LPA In-Hand Salary Calculator",
    subtitle: "Detailed monthly gross, EPF deductions, and tax liability for an annual CTC of ₹15,00,000",
    badge: "₹15 LPA CTC Preset",
    presetParams: {
      initialCtc: 1500000,
      initialCurrency: "INR",
    },
    faqs: [
      {
        question: "What is the monthly in-hand pay for a 15 LPA salary?",
        answer: "For 15 LPA CTC under the New Tax Regime, net monthly take-home is roughly ₹1,03,000 to ₹1,07,000 after accounting for EPF and ~₹1.05 Lakh annual tax.",
      },
    ],
  },
];

export function getAllToolPresets(): ToolPreset[] {
  return TOOL_PRESETS;
}

export function getPresetsForTool(toolId: string): ToolPreset[] {
  return TOOL_PRESETS.filter((p) => p.toolId === toolId);
}

export function getPreset(toolId: string, presetSlug: string): ToolPreset | undefined {
  return TOOL_PRESETS.find((p) => p.toolId === toolId && p.presetSlug === presetSlug);
}
