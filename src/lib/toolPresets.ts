import { FAQItem } from "../types";

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

  // =========================================================================
  // 6. US & TIER 1 MORTGAGE PRESETS (mortgage-calculator)
  // =========================================================================
  {
    toolId: "mortgage-calculator",
    presetSlug: "30-year-fixed",
    category: "finance",
    seoTitle: "30-Year Fixed Mortgage Calculator: Current US Rates", // 53 chars
    seoDescription:
      "Calculate 30-year fixed rate mortgage monthly payments, amortization schedule, property taxes, and PMI with current benchmark interest rates.", // 143 chars
    h1: "30-Year Fixed Mortgage Calculator",
    subtitle: "US Conventional 30-Year Benchmark: Model monthly principal, interest, taxes, and insurance (PITI)",
    badge: "US 30-Yr Benchmark (6.85%)",
    presetParams: {
      initialHomePrice: 425000,
      initialDownPaymentPercent: 20,
      initialInterestRate: 6.85,
      initialLoanTermYears: 30,
      initialPropertyTaxAnnual: 4800,
      initialHomeInsuranceAnnual: 1400,
      initialHoaFeesMonthly: 100,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "Freddie Mac Primary Mortgage Market Survey (PMMS)",
      authority: "Federal Home Loan Mortgage Corp (Freddie Mac)",
      citation: "30-Year Fixed-Rate Mortgage Conforming Loan Average",
      url: "https://www.freddiemac.com/pmms",
    },
    faqs: [
      {
        question: "What is the monthly payment on a $400,000 30-year fixed mortgage?",
        answer: "At a 6.85% interest rate with 20% down ($80,000 down payment, $320,000 loan balance), the monthly principal and interest payment is approximately $2,097. Adding estimated taxes and insurance brings the total payment to around $2,613/month.",
      },
      {
        question: "How does 20% down payment avoid PMI in the US?",
        answer: "Under Fannie Mae and Freddie Mac underwriting rules, putting down 20% or more creates an 80% Loan-to-Value (LTV) ratio, legally exempting conventional borrowers from Private Mortgage Insurance (PMI).",
      },
    ],
  },
  {
    toolId: "mortgage-calculator",
    presetSlug: "15-year-fixed",
    category: "finance",
    seoTitle: "15-Year Fixed Mortgage Calculator: Rates & Payoff", // 49 chars
    seoDescription:
      "Calculate 15-year fixed mortgage monthly payments and compare interest savings versus 30-year loans using current US conforming interest rates.", // 143 chars
    h1: "15-Year Fixed Mortgage Calculator",
    subtitle: "Accelerate home equity and save tens of thousands in interest with a 15-year fixed repayment plan",
    badge: "US 15-Yr Benchmark (6.15%)",
    presetParams: {
      initialHomePrice: 425000,
      initialDownPaymentPercent: 20,
      initialInterestRate: 6.15,
      initialLoanTermYears: 15,
      initialPropertyTaxAnnual: 4800,
      initialHomeInsuranceAnnual: 1400,
      initialHoaFeesMonthly: 100,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "Freddie Mac 15-Year Conforming Fixed Benchmark",
      authority: "Freddie Mac PMMS",
      citation: "15-Year Fixed-Rate Loan Series",
      url: "https://www.freddiemac.com/pmms",
    },
    faqs: [
      {
        question: "How much interest do you save with a 15-year vs 30-year mortgage?",
        answer: "On a $320,000 mortgage, choosing a 15-year loan at 6.15% over a 30-year loan at 6.85% saves over $265,000 in total lifetime interest while paying the home off 15 years sooner.",
      },
    ],
  },
  {
    toolId: "mortgage-calculator",
    presetSlug: "fha-loan",
    category: "finance",
    seoTitle: "FHA Loan Calculator: 3.5% Down Payment & Monthly MIP", // 52 chars
    seoDescription:
      "Calculate Federal Housing Administration (FHA) mortgage payments with 3.5% minimum down payment, upfront MIP, and annual mortgage insurance premiums.", // 151 chars
    h1: "FHA Mortgage Loan Calculator",
    subtitle: "Model FHA loan eligibility with 3.5% down payment and mandatory mortgage insurance premium (MIP)",
    badge: "HUD FHA 3.5% Down Guidelines",
    presetParams: {
      initialHomePrice: 350000,
      initialDownPaymentPercent: 3.5,
      initialInterestRate: 6.5,
      initialLoanTermYears: 30,
      initialPropertyTaxAnnual: 3800,
      initialHomeInsuranceAnnual: 1200,
      initialHoaFeesMonthly: 0,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "HUD Single Family Housing Policy Handbook 4000.1",
      authority: "U.S. Department of Housing and Urban Development (HUD)",
      citation: "FHA Forward Mortgage Maximum LTV & MIP Guidelines",
      url: "https://www.hud.gov",
    },
    faqs: [
      {
        question: "What credit score is required for 3.5% down on an FHA loan?",
        answer: "HUD requires a minimum FICO credit score of 580 to qualify for the 3.5% down payment option. Credit scores between 500 and 579 require 10% down.",
      },
      {
        question: "How much is FHA monthly MIP?",
        answer: "For a 30-year FHA loan with 3.5% down, the annual Mortgage Insurance Premium (MIP) is 0.55% of the base loan amount, divided across 12 monthly payments.",
      },
    ],
  },
  {
    toolId: "mortgage-calculator",
    presetSlug: "va-loan",
    category: "finance",
    seoTitle: "VA Loan Calculator: 0% Down Military Mortgage & Fees", // 53 chars
    seoDescription:
      "Calculate monthly payments on a 0% down VA home loan for US veterans and active military personnel. Account for VA funding fees and zero PMI.", // 142 chars
    h1: "VA Home Loan Mortgage Calculator",
    subtitle: "Zero down payment, competitive interest rates, and no monthly private mortgage insurance (PMI) for US Veterans",
    badge: "VA Zero-Down Benefit (Sep 2026)",
    presetParams: {
      initialHomePrice: 400000,
      initialDownPaymentPercent: 0,
      initialInterestRate: 6.35,
      initialLoanTermYears: 30,
      initialPropertyTaxAnnual: 4200,
      initialHomeInsuranceAnnual: 1300,
      initialHoaFeesMonthly: 0,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "VA Home Loan Guaranty Buyer Guide",
      authority: "U.S. Department of Veterans Affairs (VA)",
      citation: "Title 38 U.S. Code Chapter 37 Housing Loans",
      url: "https://www.va.gov/housing-assistance/home-loans/",
    },
    faqs: [
      {
        question: "Do VA home loans require monthly mortgage insurance?",
        answer: "No. Unlike conventional loans with <20% down or FHA loans, VA loans never require monthly Private Mortgage Insurance (PMI), significantly lowering your monthly payment.",
      },
    ],
  },
  {
    toolId: "mortgage-calculator",
    presetSlug: "canada-cmhc",
    category: "finance",
    seoTitle: "Canada Mortgage Calculator: CMHC Insurance & Rates", // 50 chars
    seoDescription:
      "Calculate Canadian residential mortgage payments, CMHC insurance premiums for under 20% down, and qualifying stress test amortization schedules.", // 144 chars
    h1: "Canada Mortgage Calculator (CMHC Insurance)",
    subtitle: "Model Canadian home purchases with 5-year fixed rates, CMHC default insurance tiers, and property taxes",
    badge: "CMHC Insurance Rules (CAD)",
    presetParams: {
      initialHomePrice: 650000,
      initialDownPaymentPercent: 10,
      initialInterestRate: 4.85,
      initialLoanTermYears: 25,
      initialPropertyTaxAnnual: 5200,
      initialHomeInsuranceAnnual: 1500,
      initialHoaFeesMonthly: 0,
      initialCurrency: "CAD",
    },
    officialReference: {
      title: "CMHC Mortgage Loan Insurance Rules",
      authority: "Canada Mortgage and Housing Corporation (CMHC)",
      citation: "B-20 Residential Mortgage Underwriting Practices",
      url: "https://www.cmhc-schl.gc.ca",
    },
    faqs: [
      {
        question: "What is CMHC mortgage insurance premium in Canada?",
        answer: "When putting down 10% on a Canadian property, CMHC charges a 3.10% insurance premium on the loan amount, which is rolled directly into the principal mortgage balance.",
      },
    ],
  },
  {
    toolId: "mortgage-calculator",
    presetSlug: "uk-repayment",
    category: "finance",
    seoTitle: "UK Mortgage Calculator: BoE Base Rate & Repayment", // 49 chars
    seoDescription:
      "Calculate UK monthly mortgage repayments, interest totals, and Loan-to-Value (LTV) ratios based on current Bank of England base rates in Pounds Sterling.", // 153 chars
    h1: "UK Mortgage Repayment Calculator",
    subtitle: "Calculate monthly repayments and interest breakdown for England, Scotland, and Wales residential properties",
    badge: "UK BoE Benchmark (GBP)",
    presetParams: {
      initialHomePrice: 320000,
      initialDownPaymentPercent: 15,
      initialInterestRate: 4.75,
      initialLoanTermYears: 25,
      initialPropertyTaxAnnual: 1800,
      initialHomeInsuranceAnnual: 400,
      initialHoaFeesMonthly: 0,
      initialCurrency: "GBP",
    },
    officialReference: {
      title: "Bank of England Official Bank Rate",
      authority: "Bank of England (BoE)",
      citation: "Monetary Policy Committee Benchmark Rate Decisions",
      url: "https://www.bankofengland.co.uk",
    },
    faqs: [
      {
        question: "What is the monthly repayment on a £250,000 UK mortgage at 4.75%?",
        answer: "For a 25-year capital and interest repayment mortgage of £250,000 at 4.75%, your monthly repayment is approximately £1,425.",
      },
    ],
  },

  // =========================================================================
  // 7. US RETIREMENT & WEALTH PRESETS (retirement-calculator)
  // =========================================================================
  {
    toolId: "retirement-calculator",
    presetSlug: "401k-growth",
    category: "finance",
    seoTitle: "401(k) Calculator: Employer Match & Retirement Growth", // 53 chars
    seoDescription:
      "Forecast 401(k) retirement balance with company match, annual salary raises, and compound market growth up to the 2026 IRS $23,500 contribution limit.", // 150 chars
    h1: "401(k) Retirement Growth Calculator",
    subtitle: "Compound growth simulator with employer matching contributions and historical index returns",
    badge: "IRS 2026 401(k) Limit ($23,500)",
    presetParams: {
      initialCurrentAge: 28,
      initialRetirementAge: 65,
      initialCurrentSavings: 45000,
      initialMonthlyExpenses: 4500,
      initialExpectedReturn: 9.0,
      initialInflationRate: 3.0,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "IRS Notice: Retirement Plan Contribution Limits",
      authority: "Internal Revenue Service (IRS)",
      citation: "IRC Section 402(g) Elective Deferrals",
      url: "https://www.irs.gov",
    },
    faqs: [
      {
        question: "What is the maximum 401(k) contribution limit for 2026?",
        answer: "The IRS employee contribution limit for 401(k) plans is $23,500 per year (plus an additional $7,500 catch-up contribution for workers aged 50 and older).",
      },
    ],
  },
  {
    toolId: "retirement-calculator",
    presetSlug: "roth-ira",
    category: "finance",
    seoTitle: "Roth IRA Calculator: Tax-Free Compound Growth to 65", // 51 chars
    seoDescription:
      "Calculate tax-free wealth accumulation in a Roth IRA with annual $7,000 contributions, compound dividend reinvestment, and early retirement benchmarks.", // 152 chars
    h1: "Roth IRA Compound Growth Calculator",
    subtitle: "Model 100% tax-free retirement compounding with annual contributions and S&P 500 benchmark returns",
    badge: "IRS 2026 Roth IRA Limit ($7,000)",
    presetParams: {
      initialCurrentAge: 25,
      initialRetirementAge: 65,
      initialCurrentSavings: 15000,
      initialMonthlyExpenses: 4000,
      initialExpectedReturn: 10.0,
      initialInflationRate: 2.8,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "IRS Publication 590-A: Contributions to IRAs",
      authority: "Internal Revenue Service (IRS)",
      citation: "IRC Section 408A Roth IRAs",
      url: "https://www.irs.gov",
    },
    faqs: [
      {
        question: "How much will maxing out a Roth IRA every year grow to?",
        answer: "Maxing out a Roth IRA at $7,000/year from age 25 to 65 at an average 10% annual return grows to approximately $3,375,000—completely exempt from federal and state income taxes upon qualified withdrawal.",
      },
    ],
  },
  {
    toolId: "retirement-calculator",
    presetSlug: "fire-movement",
    category: "finance",
    seoTitle: "FIRE Calculator: Financial Independence & 4% Rule", // 50 chars
    seoDescription:
      "Calculate your exact Financial Independence, Retire Early (FIRE) number using the Trinity Study 4% safe withdrawal rate rule and annual living expenses.", // 154 chars
    h1: "FIRE Movement Retirement Calculator",
    subtitle: "Find your 25x annual expenditure target to retire decades early with the 4% safe withdrawal rule",
    badge: "Trinity Study 4% Rule",
    presetParams: {
      initialCurrentAge: 30,
      initialRetirementAge: 45,
      initialCurrentSavings: 120000,
      initialMonthlyExpenses: 5000,
      initialExpectedReturn: 9.0,
      initialInflationRate: 3.0,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable",
      authority: "Trinity University Study (Cooley, Hubbard, Walz)",
      citation: "Journal of the American Association of Individual Investors (4% Rule)",
      url: "https://www.aaii.com",
    },
    faqs: [
      {
        question: "How do you calculate your FIRE number?",
        answer: "Your FIRE number equals 25 times your annual living expenses. For example, if you spend $60,000 per year, your target nest egg is $60,000 * 25 = $1,500,000 based on the 4% safe withdrawal rate.",
      },
    ],
  },

  // =========================================================================
  // 8. TIER 1 COMPOUND WEALTH PRESETS (compound-interest-calculator)
  // =========================================================================
  {
    toolId: "compound-interest-calculator",
    presetSlug: "sp500-index",
    category: "finance",
    seoTitle: "S&P 500 Return Calculator: 10% Historical CAGR Return", // 53 chars
    seoDescription:
      "Calculate long-term wealth growth investing in the S&P 500 index at its historical 10% annualized return with monthly dollar-cost averaging.", // 141 chars
    h1: "S&P 500 Index Compound Return Calculator",
    subtitle: "Simulate dollar-cost averaging into low-cost index funds (VOO / SPY) with reinvested dividends",
    badge: "S&P 500 10% Historical CAGR",
    presetParams: {
      initialPrincipal: 10000,
      initialMonthlyContribution: 500,
      initialAnnualRate: 10.0,
      initialYears: 20,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "S&P 500 Historical Total Return Series",
      authority: "S&P Dow Jones Indices",
      citation: "S&P 500 Total Return Index 1926-2026",
      url: "https://www.spglobal.com",
    },
    faqs: [
      {
        question: "What is the historical average return of the S&P 500?",
        answer: "Over the last 90+ years, the S&P 500 index has generated an annualized nominal compound return of approximately 10.2% with dividends reinvested (roughly 7% adjusted for inflation).",
      },
    ],
  },
  {
    toolId: "compound-interest-calculator",
    presetSlug: "500-a-month",
    category: "finance",
    seoTitle: "$500 a Month Investment Calculator: 10, 20 & 30 Years", // 52 chars
    seoDescription:
      "Calculate how much $500 invested monthly grows to in 10, 20, and 30 years at 8%, 10%, and 12% compound returns. Real wealth breakdown with charts.", // 148 chars
    h1: "$500 a Month Investment Calculator",
    subtitle: "Discover how a consistent $500 monthly investment compounds into over $1,000,000 in index funds",
    badge: "$500/Month DCA Strategy",
    presetParams: {
      initialPrincipal: 1000,
      initialMonthlyContribution: 500,
      initialAnnualRate: 10.0,
      initialYears: 25,
      initialCurrency: "USD",
    },
    faqs: [
      {
        question: "How much will $500 a month be in 25 years at 10% interest?",
        answer: "Investing $500 per month for 25 years at 10% annual return yields approximately $669,450 on a total out-of-pocket investment of just $151,000. In 30 years, it crosses $1,130,000.",
      },
    ],
  },

  // =========================================================================
  // 9. US AUTO LOANS (car-loan-emi-calculator)
  // =========================================================================
  {
    toolId: "car-loan-emi-calculator",
    presetSlug: "60-month-auto-loan",
    category: "finance",
    seoTitle: "60-Month Car Loan Calculator: Payment & 6.8% APR", // 48 chars
    seoDescription:
      "Calculate 60-month (5-year) new and used car monthly loan payments with trade-in value, down payment, and current US average 6.8% auto loan interest rates.", // 156 chars
    h1: "60-Month Auto Loan Payment Calculator",
    subtitle: "Model the most common US auto financing term with trade-in deduction and current bank APRs",
    badge: "US 60-Month Benchmark (6.8% APR)",
    presetParams: {
      initialCarPrice: 35000,
      initialDownPayment: 5000,
      initialTradeInValue: 3000,
      initialInterestRate: 6.8,
      initialTenureYears: 5,
      initialCurrency: "USD",
    },
    officialReference: {
      title: "Federal Reserve Consumer Credit Report (G.19)",
      authority: "Federal Reserve Board",
      citation: "Commercial Bank Interest Rates on 60-Month Auto Loans",
      url: "https://www.federalreserve.gov/releases/g19/",
    },
    faqs: [
      {
        question: "What is the average monthly payment for a $35,000 car for 60 months?",
        answer: "With $5,000 down payment and $3,000 trade-in ($27,000 loan amount) at 6.8% APR, the monthly payment is approximately $532. Total interest paid over 5 years is roughly $4,923.",
      },
    ],
  },

  // =========================================================================
  // 6. MARKDOWN DOCUMENT & DEVELOPER PRESETS (markdown-viewer)
  // =========================================================================
  {
    toolId: "markdown-viewer",
    presetSlug: "github-readme",
    category: "developer",
    seoTitle: "GitHub README.md Viewer & Editor (Free Online)", // 48 chars
    seoDescription:
      "Preview and edit your GitHub README.md online with live split-screen preview, badge rendering, tables, code blocks, and instant copy. 100% private in-browser.", // 160 chars
    h1: "GitHub README.md Viewer & Editor",
    subtitle: "Real-time GitHub Flavored Markdown (GFM) preview, shields.io badges, installation blocks, and contributing guidelines",
    badge: "GitHub README Specification",
    presetParams: {
      templateKey: "readme",
      initialFileName: "README.md",
    },
    officialReference: {
      title: "GitHub Docs - About READMEs",
      authority: "GitHub Documentation",
      citation: "GitHub Standard Repository Documentation Guide",
      url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
    },
    faqs: [
      {
        question: "How do I preview a GitHub README.md before pushing to GitHub?",
        answer: "Paste your README markdown into the editor or upload your README.md file. This viewer uses the exact GitHub Flavored Markdown (GFM) specification to render headings, badges, tables, checklists, and code fences identically to GitHub's web interface.",
      },
      {
        question: "Can I export my GitHub README as a PDF or Word document?",
        answer: "Yes. Click 'MD to PDF' or 'MD to Word' in the top action ribbon to compile a clean, formatted document for executive reports, grant proposals, or client documentation.",
      },
      {
        question: "Does this preview tool upload my proprietary code or README to any server?",
        answer: "No. Everything runs strictly in your local browser memory via JavaScript. No repository code, documentation, or metadata is ever transmitted over the network.",
      },
    ],
  },
  {
    toolId: "markdown-viewer",
    presetSlug: "changelog",
    category: "developer",
    seoTitle: "Keep a Changelog Viewer & Editor (CHANGELOG.md)", // 47 chars
    seoDescription:
      "Preview and edit CHANGELOG.md files adhering to Keep a Changelog standards. Live GFM preview with version release tags, checklists, and instant PDF/Word export.", // 162 chars
    h1: "Keep a Changelog Viewer & Editor",
    subtitle: "Standardized release notes viewer adhering to KeepAChangelog.com and SemVer 2.0.0 guidelines with instant export",
    badge: "KeepAChangelog Spec v1.1.0",
    presetParams: {
      templateKey: "changelog",
      initialFileName: "CHANGELOG.md",
    },
    officialReference: {
      title: "Keep a Changelog Standard (v1.1.0)",
      authority: "Keep a Changelog Initiative",
      citation: "Standardized Release History Conventions for Software Projects",
      url: "https://keepachangelog.com/en/1.1.0/",
    },
    faqs: [
      {
        question: "What categories should a CHANGELOG.md include?",
        answer: "According to Keep a Changelog standards, each release should organize changes under: Added (new features), Changed (modifications), Deprecated (soon-to-be removed), Removed (eliminated features), Fixed (bug resolutions), and Security (vulnerability patches).",
      },
      {
        question: "How do I format version headers in Markdown?",
        answer: "Use level-2 headings with square brackets for version numbers and release dates: ## [1.2.0] - 2026-09-06. The top section should always remain ## [Unreleased] for upcoming changes.",
      },
    ],
  },
  {
    toolId: "markdown-viewer",
    presetSlug: "documentation",
    category: "developer",
    seoTitle: "Markdown Documentation Viewer & Editor (DOCS.md)", // 48 chars
    seoDescription:
      "Preview technical documentation and API docs in Markdown. Features live split-screen view, parameter tables, GFM alert callouts, and instant PDF export.", // 154 chars
    h1: "Technical Markdown Documentation Viewer",
    subtitle: "Interactive developer documentation viewer with API endpoint grids, request/response syntax blocks, and alert callouts",
    badge: "Technical Docs & API Spec",
    presetParams: {
      templateKey: "docs",
      initialFileName: "DOCS.md",
    },
    officialReference: {
      title: "CommonMark Standard Specification (v0.31.2)",
      authority: "CommonMark Workgroup",
      citation: "Standardized Syntax for Technical & Computational Documentation",
      url: "https://commonmark.org",
    },
    faqs: [
      {
        question: "How can I share technical documentation written in Markdown with non-technical stakeholders?",
        answer: "Use the 'MD to PDF' or 'MD to Word' export buttons. This compiles your Markdown documentation, tables, and code snippets into standard .pdf and .doc files that clients, managers, and non-developers can read without any Markdown reader.",
      },
      {
        question: "How do I write callout boxes for warnings or tips in Markdown?",
        answer: "Use GitHub-style alert callouts: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], or > [!CAUTION]. The viewer styles each with thematic colors, borders, and icons.",
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
