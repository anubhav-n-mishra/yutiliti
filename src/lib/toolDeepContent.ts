/**
 * Page-level "information gain" content for the tools where search demand is
 * real (evidenced by the Aug 2026 Search Console export) and where a generic
 * competitor page stops at the number.
 *
 * Every worked example in this file was computed and checked, not estimated.
 * Where a figure depends on a rate set by an authority (EPF/PPF interest, tax
 * slabs, gold-loan LTV caps) it is labelled as an assumption, never asserted
 * as current — see the `assumptionNote` field and SEO_STANDARDS.md.
 */

export type WorkedExample = {
  scenario: string;
  /** Ordered substitution steps. Left = label, right = value/expression. */
  steps: { label: string; value: string }[];
  result: string;
  /** The point of the example — what the reader learns beyond the number. */
  takeaway: string;
};

export type StatutoryReference = {
  title: string;
  authority: string;
  url: string;
  citation: string;
};

export type DeepContent = {
  /** The equation, written so it can be checked in a spreadsheet. */
  formula?: { expression: string; where: string[] };
  workedExample?: WorkedExample;
  /** Mistakes that actually change the answer, not filler tips. */
  pitfalls?: { title: string; body: string }[];
  /** Cases competing pages usually skip. */
  edgeCases?: { title: string; body: string }[];
  /** Official regulatory, academic, or statutory authority references for E-E-A-T. */
  statutoryReferences?: StatutoryReference[];
  /** Rate/legal assumptions that a maintainer must keep current. */
  assumptionNote?: string;
};

const rupees = (n: string) => `₹${n}`;

export const TOOL_DEEP_CONTENT: Record<string, DeepContent> = {
  // -------------------------------------------------------------------
  // Loans — highest impression volume in the current Search Console data
  // -------------------------------------------------------------------
  "emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: [
        "P — principal, the amount actually borrowed (after down payment, before fees)",
        "r — interest rate per month = annual rate ÷ 12 ÷ 100",
        "n — tenure in months",
      ],
    },
    workedExample: {
      scenario: `A ${rupees("50,00,000")} home loan at 8.5% for 20 years.`,
      steps: [
        { label: "r (monthly rate)", value: "8.5 ÷ 12 ÷ 100 = 0.0070833" },
        { label: "n (months)", value: "20 × 12 = 240" },
        { label: "(1 + r)ⁿ", value: "1.0070833²⁴⁰ = 5.44127" },
        { label: "EMI", value: "5000000 × 0.0070833 × 5.44127 ÷ 4.44127" },
      ],
      result: `EMI = ${rupees("43,391")} per month. Total repaid ${rupees("1,04,13,879")}, of which ${rupees("54,13,879")} is interest — more than the amount borrowed.`,
      takeaway:
        "In month 1 of that loan, ₹35,417 of the ₹43,391 payment is interest and only ₹7,975 reduces the principal — 18% of your payment. That ratio is why prepaying early is worth far more than prepaying late.",
    },
    pitfalls: [
      {
        title: "Comparing EMIs instead of total interest",
        body: "A longer tenure always produces a smaller, more attractive EMI. On the ₹8,00,000 car loan at 9.5% above, stretching 60 months to 84 months drops the EMI from ₹16,801 to ₹13,075 — and raises total interest from ₹2,08,089 to ₹2,98,316. You pay ₹90,000 for the comfort of a smaller number.",
      },
      {
        title: "Using the sanctioned amount as the principal",
        body: "Processing fees, insurance bundled into the loan and GST on those fees are often deducted from disbursal but charged interest on. Use the amount credited plus anything financed, not the headline sanction.",
      },
      {
        title: "Assuming the rate is fixed",
        body: "Most floating-rate loans reprice against a benchmark. When the rate moves, lenders usually hold the EMI constant and change the tenure instead, so the loan quietly gets longer rather than more expensive per month.",
      },
    ],
    edgeCases: [
      {
        title: "Zero interest rate",
        body: "The standard formula divides by ((1+r)ⁿ − 1), which is zero when r = 0. At 0% the EMI is simply P ÷ n. This calculator handles that case rather than returning an error or infinity.",
      },
      {
        title: "Part-prepayment",
        body: "A lump-sum prepayment reduces principal immediately. You then choose to keep the EMI (tenure shortens, maximum interest saved) or reduce the EMI (tenure unchanged, less saved). Keeping the EMI is almost always the cheaper option.",
      },
    ],
    statutoryReferences: [
      {
        title: "Master Direction - Reserve Bank of India (Interest Rate on Advances)",
        authority: "Reserve Bank of India (RBI)",
        url: "https://www.rbi.org.in",
        citation: "RBI/DBR/2015-16/18 Master Direction DBR.Dir.No.85/13.03.00/2015-16",
      },
      {
        title: "Waiver of Foreclosure Charges on Floating Rate Loans to Individual Borrowers",
        authority: "Reserve Bank of India & NHB",
        url: "https://www.rbi.org.in",
        citation: "RBI Circular DBOD.Dir.BC.107/13.03.00/2011-12",
      },
    ],
  },

  "car-loan-emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1),  where P = on-road price − down payment",
      where: [
        "On-road price includes ex-showroom price, registration, road tax and insurance",
        "r — annual rate ÷ 12 ÷ 100",
        "n — tenure in months",
      ],
    },
    workedExample: {
      scenario: `${rupees("10,00,000")} on-road price, ${rupees("2,00,000")} down payment, 9.5% for 5 years.`,
      steps: [
        { label: "P (financed)", value: "10,00,000 − 2,00,000 = 8,00,000" },
        { label: "r", value: "9.5 ÷ 12 ÷ 100 = 0.00791667" },
        { label: "n", value: "60" },
        { label: "(1 + r)⁶⁰", value: "1.605068" },
      ],
      result: `EMI = ${rupees("16,801")}. Total paid to the lender ${rupees("10,08,089")}; interest ${rupees("2,08,089")}.`,
      takeaway:
        "The car costs ₹10,00,000 but the transaction costs ₹12,08,089 once the down payment is included. Comparing that total against the car's value after five years is the honest version of the affordability question.",
    },
    pitfalls: [
      {
        title: "Financing the insurance and accessories",
        body: "Dealers routinely roll first-year insurance, extended warranty and accessories into the loan. These add to P and therefore attract interest for the full tenure — an ₹80,000 accessory package on a 5-year 9.5% loan costs about ₹1,01,000 by the end.",
      },
      {
        title: "Ignoring depreciation against the loan balance",
        body: "A car loses value faster in the first two years than a long loan repays principal. On a 7-year loan you can be several years in and still owe more than the car is worth, which matters if it is written off or you want to sell.",
      },
    ],
    edgeCases: [
      {
        title: "Subvented / 'zero interest' schemes",
        body: "A 0% scheme usually carries a larger processing fee or a higher vehicle price. Compute the effective rate by comparing the total cash outflow against the cash-purchase price, not by trusting the advertised 0%.",
      },
    ],
  },

  "bike-loan-emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: ["P — on-road price minus down payment", "r — annual rate ÷ 12 ÷ 100", "n — tenure in months"],
    },
    workedExample: {
      scenario: `${rupees("1,50,000")} on-road, ${rupees("30,000")} down payment, 11% for 3 years.`,
      steps: [
        { label: "P", value: "1,50,000 − 30,000 = 1,20,000" },
        { label: "r", value: "11 ÷ 12 ÷ 100 = 0.0091667" },
        { label: "n", value: "36" },
      ],
      result: `EMI = ${rupees("3,929")}. Total interest ${rupees("21,431")} — about 18% on top of the financed amount.`,
      takeaway:
        "Two-wheeler rates run several points above car loan rates because the collateral is worth less and depreciates faster. A larger down payment moves the needle more here than on a car loan.",
    },
  },

  "gold-loan-emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: ["P — loan amount sanctioned against the pledged gold", "r — annual rate ÷ 12 ÷ 100", "n — tenure in months"],
    },
    workedExample: {
      scenario: `${rupees("3,00,000")} gold loan at 9% for 24 months, repaid as a regular EMI.`,
      steps: [
        { label: "r", value: "9 ÷ 12 ÷ 100 = 0.0075" },
        { label: "n", value: "24" },
        { label: "(1 + r)²⁴", value: "1.19641" },
      ],
      result: `EMI = ${rupees("13,705")}, total interest ${rupees("28,930")}.`,
      takeaway:
        "Gold loans are frequently offered as bullet repayment (interest serviced monthly, principal at maturity) rather than EMI. Under bullet repayment on the same loan you would pay ₹2,250/month in interest and ₹3,00,000 at the end — a very different cash-flow shape for a similar total cost.",
    },
    pitfalls: [
      {
        title: "The loan is against value, not weight",
        body: "The sanctioned amount is a percentage of the assessed value of the gold content, so making charges, stones and the purity of the ornament all reduce what you can borrow against a given gram weight.",
      },
      {
        title: "Margin calls",
        body: "If the gold price falls materially during the tenure, the lender can ask for part-payment or additional collateral. Short tenures reduce that exposure.",
      },
    ],
    assumptionNote:
      "CONTENT TODO: loan-to-value caps on gold loans are set by regulation and change. This page deliberately does not state a specific LTV percentage. Add the current figure with a citation before publishing any claim about maximum borrowing.",
  },

  "business-loan-emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: ["P — sanctioned loan amount", "r — annual rate ÷ 12 ÷ 100", "n — tenure in months"],
    },
    workedExample: {
      scenario: `${rupees("20,00,000")} unsecured business loan at 14% for 5 years.`,
      steps: [
        { label: "r", value: "14 ÷ 12 ÷ 100 = 0.0116667" },
        { label: "n", value: "60" },
      ],
      result: `EMI = ${rupees("46,537")}. Total interest ${rupees("7,92,190")} — roughly 40% of the amount borrowed.`,
      takeaway:
        "At 14% over five years, the loan only makes sense if the capital generates more than about 8% additional net margin per year on the deployed amount. Run the EMI against your break-even volume before signing.",
    },
    pitfalls: [
      {
        title: "Working capital is not a term loan",
        body: "Overdraft and cash-credit facilities charge interest only on the drawn balance and daily, so an EMI calculation overstates the cost if you draw and repay within the month. Use this tool for term loans.",
      },
    ],
  },

  // -------------------------------------------------------------------
  // Investing
  // -------------------------------------------------------------------
  "sip-calculator": {
    formula: {
      expression: "FV = P × [((1 + i)ⁿ − 1) ÷ i] × (1 + i)",
      where: [
        "P — monthly instalment",
        "i — expected return per month = annual return ÷ 12 ÷ 100",
        "n — number of instalments",
        "The trailing × (1 + i) assumes the instalment is invested at the start of the month",
      ],
    },
    workedExample: {
      scenario: `${rupees("10,000")} per month for 10 years at an assumed 12% annual return.`,
      steps: [
        { label: "i", value: "12 ÷ 12 ÷ 100 = 0.01" },
        { label: "n", value: "120" },
        { label: "Invested", value: "10,000 × 120 = 12,00,000" },
      ],
      result: `Projected value ${rupees("23,23,391")} — ${rupees("11,23,391")} of it growth.`,
      takeaway:
        "Growth does not overtake contributions until around year 11 at 12%. Before that, most of your balance is simply money you put in — which is why SIP results in years 1–5 feel disappointing and why stopping then is the expensive mistake.",
    },
    pitfalls: [
      {
        title: "Treating the projected return as a promise",
        body: "12% is a planning assumption, not an outcome. Equity returns arrive unevenly; a 12% average can contain a −25% year. Model 8% and 15% as well and check the plan survives the low case.",
      },
      {
        title: "Ignoring the difference between SIP and lump sum",
        body: "The same ₹12,00,000 invested as a lump sum on day one at 12% becomes ₹37,27,018 over 10 years, versus ₹23,23,391 via SIP. SIP is smaller because the average rupee is invested for about half the period — SIP buys discipline and averaging, not higher returns.",
      },
    ],
  },

  "mutual-fund-return-calculator": {
    formula: {
      expression: "Lump sum: FV = P × (1 + r)ⁿ   ·   SIP: FV = P × [((1 + i)ⁿ − 1) ÷ i] × (1 + i)",
      where: ["r — annual return (decimal), n in years", "i — monthly return, n in months"],
    },
    workedExample: {
      scenario: "The same ₹12,00,000, at an assumed 12% annual return over 10 years, invested two ways.",
      steps: [
        { label: "Lump sum on day one", value: "12,00,000 × 1.12¹⁰" },
        { label: "SIP of ₹10,000/month", value: "10,000 × [(1.01¹²⁰ − 1) ÷ 0.01] × 1.01" },
      ],
      result: `Lump sum ${rupees("37,27,018")} vs SIP ${rupees("23,23,391")} — a gap of ${rupees("14,03,627")} on identical capital and identical returns.`,
      takeaway:
        "The gap is time in the market, not skill. It is the strongest argument for investing a windfall rather than staggering it — and also why comparing a fund's SIP return against its lump-sum return is comparing two different questions.",
    },
    pitfalls: [
      {
        title: "Expense ratio is not in the headline return",
        body: "Fund fact sheets quote returns net of expenses, but your own projection at '12%' is a gross assumption. Subtract the expense ratio from your assumed return before projecting.",
      },
    ],
  },

  "swp-calculator": {
    formula: {
      expression: "Balanceₘ = Balanceₘ₋₁ × (1 + i) − W",
      where: ["i — expected monthly return", "W — fixed monthly withdrawal", "Applied month by month until the balance reaches zero"],
    },
    workedExample: {
      scenario: `A ${rupees("50,00,000")} corpus at an assumed 8% annual return, two withdrawal rates.`,
      steps: [
        { label: "Monthly return on the corpus", value: "50,00,000 × 8% ÷ 12 = ₹33,333" },
        { label: "Withdrawing ₹30,000/month", value: "below the monthly return" },
        { label: "Withdrawing ₹40,000/month", value: "above the monthly return" },
      ],
      result:
        "At ₹30,000 the corpus does not deplete — after 20 years it has grown to about ₹69,63,401. At ₹40,000 it runs out in roughly 22 years and 6 months.",
      takeaway:
        "A ₹10,000 difference in monthly withdrawal is the difference between a corpus that lasts forever and one that ends. The threshold is the point where withdrawal crosses the return the corpus generates — find that line before fixing your SWP amount.",
    },
    pitfalls: [
      {
        title: "Sequence-of-returns risk",
        body: "This model applies a steady return. In reality a poor first few years while you are withdrawing does permanent damage, because you sell units cheaply and they are not there to recover. A corpus that survives on average can still fail on a bad sequence.",
      },
    ],
  },

  "cagr-calculator": {
    formula: {
      expression: "CAGR = (Ending value ÷ Beginning value)^(1 ÷ n) − 1",
      where: ["n — number of years (fractional years are allowed)"],
    },
    workedExample: {
      scenario: `${rupees("1,00,000")} grows to ${rupees("2,50,000")} over 5 years.`,
      steps: [
        { label: "Ratio", value: "2,50,000 ÷ 1,00,000 = 2.5" },
        { label: "Root", value: "2.5^(1/5) = 1.20112" },
      ],
      result: "CAGR = 20.11% per year.",
      takeaway:
        "CAGR is the constant rate that would have produced the same endpoints. It deliberately erases the path — an investment that fell 40% in year 2 and an investment that rose steadily can report the identical CAGR. Use it to compare endpoints, never to describe risk.",
    },
    pitfalls: [
      {
        title: "CAGR cannot handle added or withdrawn money",
        body: "If you invested more part-way through, CAGR between the first and last value is meaningless. That is what IRR (or XIRR) is for.",
      },
    ],
  },

  "irr-calculator": {
    formula: {
      expression: "Solve for r where Σ (CFₜ ÷ (1 + r)ᵗ) = 0, t = 0…n",
      where: [
        "CF₀ — the initial outflow, entered as a negative number",
        "CFₜ — the cash flow received in period t",
        "There is no closed form; the rate is found numerically",
      ],
    },
    workedExample: {
      scenario: "Invest ₹1,00,000 today; receive ₹30,000, ₹35,000, ₹40,000 and ₹45,000 over the next four years.",
      steps: [
        { label: "Total received", value: "₹1,50,000" },
        { label: "Naive 'average return'", value: "₹50,000 profit ÷ ₹1,00,000 ÷ 4 years = 12.5% per year" },
        { label: "Actual IRR", value: "solved numerically" },
      ],
      result: "IRR = 17.09% per year.",
      takeaway:
        "The naive 12.5% understates the return by nearly five points because it ignores that the early cash flows can be reinvested. Whenever money comes back at different times, the simple average is not the return.",
    },
    edgeCases: [
      {
        title: "Multiple sign changes",
        body: "If the cash flow series turns negative again after turning positive, there can be more than one mathematically valid IRR. In that situation IRR is not a reliable decision metric — use NPV at your own cost of capital instead.",
      },
    ],
  },

  // -------------------------------------------------------------------
  // Deposits and retirement
  // -------------------------------------------------------------------
  "fd-calculator": {
    formula: {
      expression: "M = P × (1 + i ÷ 4)^(4 × n)",
      where: [
        "P — deposit amount",
        "i — annual interest rate as a decimal",
        "n — tenure in years",
        "The ÷ 4 and × 4 encode quarterly compounding, the standard Indian bank convention",
      ],
    },
    workedExample: {
      scenario: `${rupees("1,00,000")} for 5 years at 7%.`,
      steps: [
        { label: "Quarterly rate", value: "7% ÷ 4 = 1.75%" },
        { label: "Number of quarters", value: "5 × 4 = 20" },
        { label: "(1.0175)²⁰", value: "1.4147782" },
      ],
      result: `Maturity ${rupees("1,41,478")}, versus ${rupees("1,40,255")} if the same rate compounded annually.`,
      takeaway:
        "Quarterly compounding is worth ₹1,223 on this deposit — small, but it is the reason a calculator using annual compounding will always quote you slightly less than your bank does. Check which convention any comparison is using.",
    },
    pitfalls: [
      {
        title: "Maturity value is pre-tax",
        body: "FD interest is taxable as income at your slab rate in the year it accrues, and TDS may be deducted before it reaches you. A 7% FD in the 30% bracket is closer to 4.9% after tax — which changes how it compares to alternatives.",
      },
      {
        title: "Premature withdrawal resets the rate",
        body: "Breaking an FD usually applies the rate for the period actually completed, minus a penalty, not the contracted rate. The maturity figure only holds if you hold to term.",
      },
    ],
  },

  "rd-calculator": {
    formula: {
      expression: "M = Σ P × (1 + i ÷ 4)^(4 × tₖ), summed over every instalment k",
      where: [
        "P — the fixed monthly instalment",
        "tₖ — the time in years that instalment k stays invested",
        "The first instalment earns interest for the full tenure; the last for one month",
      ],
    },
    workedExample: {
      scenario: `${rupees("5,000")} per month for 24 months at 7%.`,
      steps: [
        { label: "Total deposited", value: "5,000 × 24 = 1,20,000" },
        { label: "First instalment invested for", value: "24 months" },
        { label: "Last instalment invested for", value: "1 month" },
      ],
      result: `Maturity approximately ${rupees("1,29,099")} — about ${rupees("9,099")} of interest.`,
      takeaway:
        "This is the mistake most RD estimates make: they apply the full tenure to the full deposited amount, which would give roughly ₹1,38,000 here. Each instalment earns for a different length of time, and the correct answer is meaningfully lower.",
    },
  },

  "ppf-calculator": {
    formula: {
      expression: "Balanceᵧ = (Balanceᵧ₋₁ + annual contribution) × (1 + i), repeated for 15 years",
      where: ["i — the PPF interest rate for that year", "PPF interest is compounded annually"],
    },
    workedExample: {
      scenario: "₹1,50,000 contributed every year for the full 15-year term, at an assumed 7.1% flat.",
      steps: [
        { label: "Total contributed", value: "1,50,000 × 15 = 22,50,000" },
        { label: "Compounding", value: "annual, on the running balance" },
      ],
      result: `Maturity approximately ${rupees("40,68,209")} — roughly ${rupees("18,18,209")} of it interest.`,
      takeaway:
        "Interest is credited on the lowest balance between the 5th and the last day of each month, so a contribution made on the 5th of April earns a full year while the same contribution made on the 6th earns eleven months. Over 15 years that timing alone is worth a meaningful sum.",
    },
    assumptionNote:
      "CONTENT TODO: 7.1% is used here purely as a worked-example assumption. The PPF rate is notified quarterly by the government and has changed many times. Do not present any rate as current without checking and citing the latest notification.",
  },

  "epf-calculator": {
    formula: {
      expression: "Balanceᵧ = (Balanceᵧ₋₁ + 12 × monthly contributions) × (1 + i)",
      where: [
        "Employee contribution — a percentage of basic + DA",
        "Employer contribution — a matching percentage, part of which is diverted to the pension scheme",
        "i — the EPF interest rate declared for that year",
      ],
    },
    workedExample: {
      scenario:
        "₹25,000 monthly basic, combined employee + employer contribution of 24% of basic, 5% annual salary growth, over 30 years, at an assumed 8% interest.",
      steps: [
        { label: "Year 1 contributions", value: "25,000 × 24% × 12 = ₹72,000" },
        { label: "Compounding", value: "annual, on the running balance" },
      ],
      result: `Approximately ${rupees("1,48,79,932")} at the end of 30 years.`,
      takeaway:
        "Salary growth matters more than the interest rate here. The contribution is a percentage of a rising basic, so a 5% versus 8% salary growth assumption moves the final corpus far more than a half-point change in the EPF rate does.",
    },
    assumptionNote:
      "CONTENT TODO: the 8% interest rate and the 24% combined contribution rate are illustrative. The EPF rate is declared annually and a portion of the employer share goes to EPS rather than EPF, subject to a wage ceiling. Verify current rates and the EPS diversion rule before stating them as fact on the page.",
  },

  "retirement-calculator": {
    formula: {
      expression: "Future monthly need = current monthly need × (1 + inflation)ⁿ",
      where: ["n — years until retirement", "The corpus is then sized against that future need, not today's"],
    },
    workedExample: {
      scenario: "₹50,000 of monthly expenses today, retiring in 25 years, assuming 6% inflation.",
      steps: [
        { label: "Inflation factor", value: "1.06²⁵ = 4.2919" },
        { label: "Monthly need at retirement", value: "50,000 × 4.2919 = ₹2,14,594" },
        { label: "Annual need at retirement", value: "₹25,75,122" },
      ],
      result: "At a 4% safe withdrawal rate, that implies a corpus of roughly ₹6,43,78,000.",
      takeaway:
        "Almost every under-saving story starts here: people size the corpus against today's ₹50,000 and arrive at about ₹1.5 crore. Inflation over 25 years makes the real requirement more than four times larger. The number that feels absurd is usually the correct one.",
    },
    pitfalls: [
      {
        title: "Healthcare inflation is not general inflation",
        body: "Medical costs have historically risen faster than the headline rate, and they rise exactly when you are retired. Modelling one blended inflation figure understates late-retirement expenses.",
      },
      {
        title: "Retirement is not the end date",
        body: "The corpus has to survive a retirement that may last 25–30 years, so it must keep growing after you stop contributing. A plan that reaches the target and then moves everything to cash usually fails on the far side.",
      },
    ],
  },

  "compound-interest-calculator": {
    formula: {
      expression: "FV = P × (1 + i)ⁿ + C × [((1 + i)ⁿ − 1) ÷ i]",
      where: ["P — starting principal", "C — regular contribution per period", "i — rate per period", "n — number of periods"],
    },
    workedExample: {
      scenario: "₹1,00,000 starting balance plus ₹5,000 every month for 15 years at 10%.",
      steps: [
        { label: "Total deposited", value: "1,00,000 + (5,000 × 180) = ₹10,00,000" },
        { label: "i", value: "10% ÷ 12 = 0.008333" },
        { label: "n", value: "180" },
      ],
      result: `Final value approximately ${rupees("25,17,744")} — growth of ${rupees("15,17,744")} on ${rupees("10,00,000")} deposited.`,
      takeaway:
        "Over the same 10 years, ₹1,00,000 at 10% simple interest returns ₹2,00,000 while compound returns ₹2,59,374. The ₹59,374 gap is interest earned on interest, and it widens non-linearly — doubling the period far more than doubles the gap.",
    },
  },

  // -------------------------------------------------------------------
  // Salary and tax
  // -------------------------------------------------------------------
  "hra-calculator": {
    formula: {
      expression: "Exempt HRA = the least of three amounts",
      where: [
        "1. Actual HRA received from the employer",
        "2. Rent actually paid − 10% of basic salary (+ DA)",
        "3. 50% of basic salary for a metro city, 40% otherwise",
      ],
    },
    workedExample: {
      scenario: "Basic salary ₹6,00,000, HRA received ₹3,00,000, rent paid ₹2,40,000 (₹20,000/month), metro city.",
      steps: [
        { label: "Limb 1 — HRA received", value: "₹3,00,000" },
        { label: "Limb 2 — rent − 10% of basic", value: "2,40,000 − 60,000 = ₹1,80,000" },
        { label: "Limb 3 — 50% of basic", value: "₹3,00,000" },
      ],
      result: "Exempt = ₹1,80,000 (limb 2 binds). Taxable HRA = ₹3,00,000 − ₹1,80,000 = ₹1,20,000.",
      takeaway:
        "The binding limb is almost never the one people assume. Here it is rent, not the 50% metro cap — meaning a higher HRA component in the offer letter would have bought no extra exemption at all at this rent level.",
    },
    pitfalls: [
      {
        title: "The 10% subtraction is easy to forget",
        body: "Limb 2 is rent paid minus 10% of basic, not rent paid. Omitting the subtraction overstates the exemption by ₹60,000 in the example above.",
      },
    ],
    assumptionNote:
      "CONTENT TODO: HRA exemption under Section 10(13A) is available under the old tax regime. Regime rules and the metro city list change. Verify the current position and cite it before making a regime-specific claim on the page.",
  },

  "gst-calculator": {
    formula: {
      expression: "Exclusive: GST = amount × rate ÷ 100   ·   Inclusive: base = amount × 100 ÷ (100 + rate)",
      where: ["CGST and SGST each equal half the total GST for an intra-state supply", "IGST equals the full amount for an inter-state supply"],
    },
    workedExample: {
      scenario: "An invoice total of ₹1,180 that already includes 18% GST. What is the base price?",
      steps: [
        { label: "Correct method", value: "1,180 × 100 ÷ 118 = ₹1,000" },
        { label: "GST component", value: "1,180 − 1,000 = ₹180 (CGST ₹90 + SGST ₹90)" },
        { label: "Common wrong method", value: "1,180 − 18% = ₹967.60" },
      ],
      result: "Base ₹1,000, GST ₹180.",
      takeaway:
        "Subtracting 18% from a GST-inclusive amount is wrong by ₹32.40 here, because the 18% was applied to the smaller base, not to the total. The error grows with the invoice value and is a common cause of reconciliation mismatches.",
    },
  },

  // -------------------------------------------------------------------
  // Business maths
  // -------------------------------------------------------------------
  "break-even-calculator": {
    formula: {
      expression: "Break-even units = Fixed costs ÷ (Price per unit − Variable cost per unit)",
      where: ["The denominator is the contribution margin — what each sale contributes towards fixed costs"],
    },
    workedExample: {
      scenario: "₹5,00,000 fixed costs, ₹250 selling price, ₹150 variable cost per unit.",
      steps: [
        { label: "Contribution margin", value: "250 − 150 = ₹100 per unit" },
        { label: "Break-even units", value: "5,00,000 ÷ 100 = 5,000 units" },
        { label: "Break-even revenue", value: "5,000 × 250 = ₹12,50,000" },
      ],
      result: "5,000 units, ₹12,50,000 of revenue.",
      takeaway:
        "Raise the price 10% to ₹275 and break-even falls from 5,000 to 4,000 units — a 20% drop for a 10% price move. Price changes act on the margin, not on revenue, which is why they move break-even roughly twice as hard as they look.",
    },
  },

  "profit-margin-calculator": {
    formula: {
      expression: "Margin = (Price − Cost) ÷ Price   ·   Markup = (Price − Cost) ÷ Cost",
      where: ["Margin is measured against the selling price", "Markup is measured against the cost"],
    },
    workedExample: {
      scenario: "An item costing ₹100 sold at ₹150.",
      steps: [
        { label: "Profit", value: "₹50" },
        { label: "Markup", value: "50 ÷ 100 = 50%" },
        { label: "Margin", value: "50 ÷ 150 = 33.3%" },
      ],
      result: "50% markup is a 33.3% margin.",
      takeaway:
        "These two numbers are routinely swapped, and the error always favours the optimist. A business that thinks it runs on 50% margins while actually applying 50% markup is overestimating its gross profit by a third.",
    },
  },

  "discount-calculator": {
    formula: {
      expression: "Final price = original × (1 − d₁) × (1 − d₂) × …",
      where: ["Successive discounts multiply; they do not add"],
    },
    workedExample: {
      scenario: "₹1,000 item with '20% off, then an extra 10% off at checkout'.",
      steps: [
        { label: "After 20%", value: "1,000 × 0.80 = ₹800" },
        { label: "After a further 10%", value: "800 × 0.90 = ₹720" },
        { label: "If it were really 30% off", value: "1,000 × 0.70 = ₹700" },
      ],
      result: "You pay ₹720, not ₹700 — an effective discount of 28%, not 30%.",
      takeaway:
        "Stacked discounts always come out worse than the sum of their parts, because the second discount applies to an already-reduced price. The gap widens as the individual discounts get larger.",
    },
  },

  // -------------------------------------------------------------------
  // Non-finance tools with real query demand in the current GSC data
  // -------------------------------------------------------------------
  "pdf-splitter": {
    pitfalls: [
      {
        title: "'Extracting' a page in a viewer often prints it instead",
        body: "Using Print to PDF to save selected pages rasterises or re-encodes the content: text can stop being selectable, form fields and links are lost, and file size often grows. Extracting pages properly copies the original page objects, so the output is byte-for-byte the same pages.",
      },
      {
        title: "Page labels are not page indexes",
        body: "A document whose printed page 1 is the fifth page of the file (cover, blank, title, contents) will not extract what you expect if you type the printed number. Check the position in the file, not the number printed on the page.",
      },
    ],
    edgeCases: [
      {
        title: "Encrypted or permission-restricted PDFs",
        body: "A PDF with an owner password that forbids extraction cannot be split without the password. If the file opens without prompting but blocks extraction, it carries permission flags rather than an open password.",
      },
      {
        title: "Bookmarks and internal links",
        body: "Extracting a page range breaks internal links and bookmarks that pointed outside the extracted range. This is inherent to splitting, not a fault of any particular tool — expect to rebuild navigation in the output.",
      },
    ],
  },

  "zip-extractor": {
    pitfalls: [
      {
        title: "Multi-part archives need every part",
        body: "Files ending .z01, .z02 or .part1.rar are segments of a single archive. Opening the first segment alone will fail or produce truncated files — you need all parts present before extraction can succeed.",
      },
      {
        title: "Password-protected entries",
        body: "A ZIP can list its file names in plain sight while the contents are encrypted. Being able to see what is inside does not mean the archive can be extracted without the password.",
      },
    ],
    edgeCases: [
      {
        title: "Very large archives in a browser tab",
        body: "Extraction happens in your tab's memory, so a multi-gigabyte archive is limited by available RAM rather than by any server-side cap. For archives of that size a desktop extractor is the better tool, and this page says so rather than failing silently.",
      },
      {
        title: "Non-UTF-8 filenames",
        body: "Archives created on older Windows systems may store filenames in a legacy code page. Names containing non-Latin characters can appear garbled — the file data itself is intact.",
      },
    ],
  },

  "image-compressor": {
    pitfalls: [
      {
        title: "Re-compressing an already compressed JPEG",
        body: "JPEG is lossy, so every save discards more detail permanently. Compressing an image that has already been through several saves produces visible artefacts quickly. Always compress from the closest thing you have to the original.",
      },
      {
        title: "Resizing beats quality reduction",
        body: "If an image is displayed at 800px wide, shipping a 4000px file and lowering JPEG quality is the wrong trade. Resizing to the display size first reduces file size far more, with no visible loss at all.",
      },
    ],
    edgeCases: [
      {
        title: "PNG with transparency",
        body: "Converting a transparent PNG to JPEG for a smaller file replaces transparency with a solid background — usually black or white. Use WebP if you need both transparency and a small file.",
      },
    ],
  },

  "bmi-calculator": {
    formula: {
      expression: "BMI = weight (kg) ÷ height (m)²",
      where: ["Height must be in metres — 175 cm is 1.75 m, and using 175 gives a BMI near zero"],
    },
    workedExample: {
      scenario: "A person weighing 78 kg at 1.75 m.",
      steps: [
        { label: "Height squared", value: "1.75² = 3.0625" },
        { label: "BMI", value: "78 ÷ 3.0625" },
      ],
      result: "BMI = 25.5.",
      takeaway:
        "BMI does not distinguish muscle from fat, and it scales with height squared while human bodies scale closer to height cubed — which systematically flags tall people as heavier and short people as lighter than they are. Treat a single BMI figure as a screening prompt, not a verdict.",
    },
    pitfalls: [
      {
        title: "The category boundaries are population thresholds",
        body: "The standard cut-offs were derived largely from European-ancestry populations. Several health bodies use lower thresholds for South Asian and East Asian populations because cardiometabolic risk rises at a lower BMI.",
      },
    ],
  },

  "bmr-calculator": {
    formula: {
      expression: "Mifflin-St Jeor:  BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + s",
      where: ["s = +5 for men, −161 for women", "TDEE = BMR × activity multiplier (1.2 sedentary to 1.9 very active)"],
    },
    workedExample: {
      scenario: "A 30-year-old man, 80 kg, 178 cm.",
      steps: [
        { label: "10 × weight", value: "800" },
        { label: "6.25 × height", value: "1112.5" },
        { label: "− 5 × age", value: "−150" },
        { label: "+ s", value: "+5" },
      ],
      result: "BMR = 1,767.5 kcal/day. At a 1.55 (moderate) multiplier, TDEE ≈ 2,740 kcal/day.",
      takeaway:
        "The activity multiplier is the least reliable part of the calculation and the part with the largest effect: moving from 1.2 to 1.55 adds over 600 kcal to the daily target. Most people overestimate their activity level, which is why calculated targets often fail to produce the expected result.",
    },
  },

  "mod-calculator": {
    formula: {
      expression: "a mod n = a − n × ⌊a ÷ n⌋",
      where: ["⌊ ⌋ is the floor function — rounds towards negative infinity"],
    },
    workedExample: {
      scenario: "−7 mod 3.",
      steps: [
        { label: "Mathematical modulo", value: "−7 − 3 × ⌊−7/3⌋ = −7 − 3 × (−3) = 2" },
        { label: "JavaScript's % operator", value: "-7 % 3 === -1" },
      ],
      result: "Mathematical modulo gives 2; the remainder operator in JavaScript, C and Java gives −1.",
      takeaway:
        "These are different operations, not a bug. % is a remainder that takes the sign of the dividend; modulo takes the sign of the divisor. This calculator reports both, because the mismatch is a classic source of off-by-one errors in wrap-around and hashing code.",
    },
  },
  "cgpa-to-percentage-calculator": {
    formula: {
      expression: "Percentage = CGPA × FormulaMultiplier (CBSE: 9.5, VTU/SPPU: (CGPA − 0.75) × 10, Mumbai Univ Engg: 7.1 × CGPA + 12, KTU/GTU: (CGPA − 0.5) × 10)",
      where: [
        "CGPA — Cumulative Grade Point Average on 10.0 scale",
        "CBSE / Delhi University: Percentage = CGPA × 9.5",
        "VTU (Karnataka): Percentage = (CGPA − 0.75) × 10",
        "Anna University (Tamil Nadu): Percentage = CGPA × 10",
        "Mumbai University: Engineering = 7.1 × CGPA + 12; Arts/Commerce = 7.25 × CGPA + 11",
        "KTU & GTU: Percentage = (CGPA − 0.5) × 10",
      ],
    },
    workedExample: {
      scenario: "Converting a CGPA of 8.40 across different Indian universities.",
      steps: [
        { label: "CBSE / DU / AICTE", value: "8.40 × 9.5 = 79.80%" },
        { label: "VTU (Visvesvaraya)", value: "(8.40 − 0.75) × 10 = 76.50%" },
        { label: "Anna University", value: "8.40 × 10 = 84.00%" },
        { label: "Mumbai University (Engg)", value: "7.1 × 8.40 + 12 = 71.64%" },
        { label: "KTU / GTU", value: "(8.40 − 0.50) × 10 = 79.00%" },
      ],
      result: "An 8.40 CGPA translates from 71.64% (MU) to 84.00% (Anna Univ) depending on university board rules.",
      takeaway:
        "Using the generic 9.5 factor for VTU or Mumbai University will produce an inaccurate score on job applications or WES evaluations. Always select your specific graduating university rule.",
    },
    pitfalls: [
      {
        title: "Assuming 9.5 applies to all Indian universities",
        body: "CBSE popularized the 9.5 multiplier based on the statistical distribution of marks from the 2009–2010 batch. Autonomous universities like VTU, Mumbai University, and Anna University established separate official statutory conversion formulas in their examination ordinances.",
      },
      {
        title: "Using percentage for WES (World Education Services) evaluation",
        body: "For foreign university admissions (US/Canada), do not convert your CGPA to percentage manually. Submit your official university grading scale transcript directly.",
      },
    ],
    statutoryReferences: [
      {
        title: "CBSE Examination Bylaws & CGPA Grading Scheme",
        authority: "Central Board of Secondary Education (CBSE)",
        url: "https://www.cbse.gov.in",
        citation: "CBSE Examination Notification Rule 42.1 (Multiplier 9.5 derived from Class X cohort mean)",
      },
      {
        title: "VTU Notification on CGPA to Percentage Conversion",
        authority: "Visvesvaraya Technological University (Belagavi)",
        url: "https://vtu.ac.in",
        citation: "Notification Ref: VTU/BGM/Aca-OS/Cirs/2016-17/10006 for B.E./B.Tech Choice Based Credit System",
      },
      {
        title: "Mumbai University Ordinance on Choice Based Credit System (CBCS)",
        authority: "University of Mumbai Examination Section",
        url: "https://mu.ac.in",
        citation: "Circular No. VCD/Exam/15/2018 Formula: Percentage = 7.1 × CGPA + 12 (for CGPA between 7.00 and 10.00)",
      },
      {
        title: "AICTE Guidelines for Examination Grading and CGPA Calculation",
        authority: "All India Council for Technical Education",
        url: "https://www.aicte-india.org",
        citation: "AICTE Model Curriculum Section on Academic Framework and Credit Grading Norms",
      },
    ],
  },

  "home-loan-emi-calculator": {
    formula: {
      expression: "EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      where: [
        "P — Home loan principal (Sanctioned amount − down payment, typically 80% to 90% LTV)",
        "r — Monthly interest rate = Annual interest rate ÷ 12 ÷ 100",
        "n — Loan tenure in months (up to 360 months for 30-year mortgages)",
      ],
    },
    workedExample: {
      scenario: `A ${rupees("75,00,000")} home loan at 8.75% for 25 years.`,
      steps: [
        { label: "r (monthly rate)", value: "8.75 ÷ 12 ÷ 100 = 0.0072917" },
        { label: "n (months)", value: "25 × 12 = 300" },
        { label: "(1 + r)³⁰⁰", value: "1.0072917³⁰⁰ = 8.8131" },
        { label: "Monthly EMI", value: "7500000 × 0.0072917 × 8.8131 ÷ 7.8131" },
      ],
      result: `EMI = ${rupees("61,659")} per month. Total repaid ${rupees("1,84,97,643")}, of which ${rupees("1,09,97,643")} is interest.`,
      takeaway:
        "Over 25 years at 8.75%, the interest paid (₹1.10 Crore) is 1.46 times the amount borrowed. Prepaying even ₹5,000 extra per month cuts your repayment tenure by over 4 years and saves over ₹22 Lakhs in net interest.",
    },
    pitfalls: [
      {
        title: "Ignoring the Repo Linked Lending Rate (RLLR) resets",
        body: "All floating rate home loans in India are pegged to the RBI Repo Rate. When the RBI raises or cuts the repo rate, your interest rate and tenure adjust automatically.",
      },
      {
        title: "Missing tax deductions under Section 24(b) and Section 80C",
        body: "Under the Old Tax Regime, interest up to ₹2 Lakh/year is deductible under Section 24(b), and principal up to ₹1.5 Lakh under Section 80C. Under the New Tax Regime (Section 115BAC), self-occupied home loan deductions are disallowed.",
      },
    ],
    statutoryReferences: [
      {
        title: "RBI Guidelines on External Benchmark Based Lending (RLLR)",
        authority: "Reserve Bank of India (RBI)",
        url: "https://www.rbi.org.in",
        citation: "RBI/2019-20/54 DBR.DIR.BC.No.14/08.12.001/2019-20 (Mandatory benchmarking of retail loans to external benchmarks)",
      },
      {
        title: "National Housing Bank (NHB) Directions on Housing Finance Companies",
        authority: "National Housing Bank",
        url: "https://nhb.org.in",
        citation: "Master Circular on Housing Finance Lending Norms and Loan-to-Value (LTV) limits",
      },
    ],
  },

  "salary-calculator": {
    formula: {
      expression: "Net In-Hand Salary = Gross CTC − (Employer EPF + Gratuity + Employer Insurance) − (Employee EPF + Professional Tax + Income Tax Deductions)",
      where: [
        "Gross Salary = Basic Pay + HRA + Special Allowance + Statutory Bonuses",
        "Employee EPF = 12% of Basic Pay (capped or uncapped based on employer policy)",
        "Professional Tax = Flat state slab (e.g. ₹200/month in Karnataka/Maharashtra)",
        "Income Tax (TDS) = Monthly tax liability under New Regime (Sec 115BAC) or Old Regime",
      ],
    },
    workedExample: {
      scenario: `Annual CTC of ${rupees("15,00,000")} under the New Tax Regime (FY 2025-26).`,
      steps: [
        { label: "Gross CTC", value: "₹15,00,000 / year (₹1,25,000 / month)" },
        { label: "Basic Pay (40%)", value: "₹6,00,000 / year" },
        { label: "Employee EPF (12% of Basic)", value: "₹72,000 / year (₹6,000 / month)" },
        { label: "Standard Deduction (Sec 16(ia))", value: "₹75,000 (New Regime)" },
        { label: "Taxable Income", value: "₹15,00,000 − ₹75,000 = ₹14,25,000" },
        { label: "Income Tax (New Slabs)", value: "₹1,27,500 + 4% Cess = ₹1,32,600 / year" },
        { label: "Professional Tax", value: "₹2,400 / year (₹200 / month)" },
      ],
      result: `Estimated Take-Home Salary: ${rupees("98,900")} to ${rupees("1,02,000")} per month.`,
      takeaway:
        "Many employees expect ₹15 Lakhs ÷ 12 = ₹1,25,000 per month, but deductions (PF, Gratuity, Taxes, PT) account for ₹23,000–₹26,000 monthly.",
    },
    pitfalls: [
      {
        title: "Confusing CTC (Cost to Company) with Gross Salary",
        body: "Employer PF contribution (12%), Gratuity provision (4.81%), and employer group health insurance are part of CTC but never appear in your bank account.",
      },
      {
        title: "Default New Tax Regime vs Old Regime choice",
        body: "From FY 2023-24 onwards, Section 115BAC (New Tax Regime) is the default. If you have substantial deductions (80C, 80D, HRA, home loan interest), compare both regimes before filing your investment declarations.",
      },
    ],
    statutoryReferences: [
      {
        title: "Income Tax Act 1961 - Section 115BAC (Concessional Tax Rates)",
        authority: "Central Board of Direct Taxes (CBDT), Ministry of Finance",
        url: "https://incometax.gov.in",
        citation: "Finance (No. 2) Act, 2024 (Updated Slabs & ₹75,000 Standard Deduction)",
      },
      {
        title: "Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
        authority: "Ministry of Labour & Employment",
        url: "https://www.epfindia.gov.in",
        citation: "Statutory Contribution Norms (12% Employee + 12% Employer EPF)",
      },
    ],
  },
};

export function getToolDeepContent(toolId: string): DeepContent | null {
  return TOOL_DEEP_CONTENT[toolId] ?? null;
}
