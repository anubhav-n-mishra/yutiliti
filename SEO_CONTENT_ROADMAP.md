# Yuitility SEO Content Roadmap

Companion to `SEO_GROWTH_AUDIT.md`. Prioritised by

> **expected ranking probability × business value × topical importance**

deliberately *not* by search volume, which is not available to this repository
and which is the metric that produced the current 49 unbuilt calculator pages.

**No search volumes, keyword difficulty scores, competitor metrics or backlink
counts appear anywhere in this document.** No such data source is connected. Every
number quoted is either from the user-supplied Search Console export (labelled
"GSC") or from the repository itself.

---

## 1. What the site is actually about

**Primary topic:** browser-native utilities that do the work locally — file
handling (PDF, image, archive) and quantitative calculators (money, health,
maths) — where the defining property is that *nothing you open or type leaves
your device.*

That last clause is the only genuine differentiator the site has, and it is
currently buried in boilerplate ("100% private, no signup required" appended to
79 identical descriptions) rather than used as the reason a specific page
deserves to win a specific query.

### The topical map

```
PILLAR: Tools that run in your browser, not on someone's server   → /tools
│
├── CLUSTER: PDF work without uploading            → /category/pdf
│   ├── split / extract pages   ← strongest current opportunity
│   ├── merge, compress
│   └── watermark, metadata     ← privacy angle is literal here
│
├── CLUSTER: Image work without uploading          → /category/media
│   ├── compress, resize, convert
│   └── background removal, social sizing, collage
│
├── CLUSTER: Money maths with the working shown    → /category/finance
│   ├── SUB: Loans and EMI
│   ├── SUB: Investing and returns
│   ├── SUB: Deposits, provident funds, retirement
│   ├── SUB: Salary and tax
│   ├── SUB: Business and pricing
│   └── SUB: Personal balance sheet
│
├── CLUSTER: Developer tools safe for real data    → /category/developer
├── CLUSTER: Maths with steps                      → /category/math
├── CLUSTER: Health estimates, honestly bounded    → /category/health
├── CLUSTER: Units and conversion                  → /category/conversion
└── CLUSTER: Everyday utilities                    → /category/utility
```

The finance cluster is now rendered as those six named sub-clusters on
`/category/finance` rather than a 38-item grid, so the page reads as a topic with
structure rather than an inventory.

---

## 2. Priority queue

Difficulty is engineering + writing effort. "Ranking probability" is reasoned
from observed GSC positions on adjacent queries, not from any external metric.

### Tier 0 — done in this pass (listed for completeness)

| Change | Pages | Why first |
| --- | --- | --- |
| Remove fabricated review schema | 128 | Live policy violation, confirmed in GSC |
| Noindex 49 unbuilt tools | 49 | They are what Google evaluated and rejected |
| Homepage → real anchors, `/tools` hub | sitewide | Homepage linked 0 tool pages |
| Unique titles + descriptions | 79 | 5+ pages shared identical title tails |
| Fix 3 orphan categories, 3 `undefined` descriptions | 8 | Broken pages in the index |
| Topical re-clustering of categories | 79 | `media` had 1 tool; `utility` had 22 |
| Formula + worked example + pitfalls | 27 | Information gain (see §4) |

### Tier 1 — highest expected return, start here

| P | Topic / target | Intent | Page type | Reason (evidence) | Internal links | Difficulty |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Extracting specific pages from a PDF | Do-it, procedural | Improve `/tools/pdf-splitter` | **Best non-brand positions on the whole site**: "how to select some pages from pdf" 44.0, "how to take one page of a pdf" 51.0, "is there a way to download specific pages of a pdf" 52.0, "how to extract certain pages from pdf" 56.0 (GSC). Dozens of near-identical phrasings, all 44–63. Privacy angle is literally the objection ("I don't want to upload my contract"). | In: `/category/pdf`, `/tools/pdf-merger`, `/blog/how-to-extract-specific-pdf-pages`. Out: pdf-merger, pdf-compressor, image-to-pdf | Low — page exists and works; needs the deep-dive content (partly added) plus screenshots |
| 2 | Opening / viewing a ZIP without installing software | Do-it | Improve `/tools/zip-extractor` | "open zip file" 76.8, "how do i view a zip file" 56.0, "can anyone open a zip file" 55.0, "how to read a zip file" 59.0, "how to open zip part file" 59.0 (GSC). The multi-part and password cases are exactly where generic pages stop. | In: `/category/utility`, `/blog/extracting-zip-files-directly-in-browser`. Out: pdf-compressor, image-compressor | Low — pitfalls content added; needs screenshots |
| 3 | GST inclusive vs exclusive | Transactional/calc | Improve `/tools/gst-calculator` | Best non-brand head-term position on the site: "gst calculator" **46.0**, "gst tax calculator" 50.2, "how do i know how much gst i will get" 55.0 (GSC). Position 46 with the site's current authority means the SERP is winnable. | In: `/category/finance` (Salary and tax), income-tax-calculator, discount-calculator | Low — worked example added |
| 4 | EPF corpus projection | Calc + explanatory | Improve `/tools/epf-calculator` | "epf interest rate calculator" **53.3**, "epf calculator" 58.7, "epf retirement calculator" 57.5, "epf calculator at retirement" 60.0, "epf future value calculator" 62.0 (GSC). A tight, coherent query family already in the 50s. | In: `/category/finance` (Deposits), salary-calculator, ppf-calculator, nps-calculator | Medium — **needs the current EPF rate and EPS diversion rule verified and cited** (CONTENT TODO in `toolDeepContent.ts`) |
| 5 | FD maturity with quarterly compounding | Calc | Improve `/tools/fd-calculator` | "fd calculator" 62.6, "fixed deposit calculator" 62.0, "fd interest calculator compounded quarterly" 62.0, "fd compound calculator" 65.0, "fixed deposit calculator quarterly compounding" 63.0 (GSC). The compounding-convention query is the differentiated one and almost nobody answers it explicitly. | In: `/category/finance` (Deposits), rd-calculator, compound-interest-calculator | Low — worked example added showing the ₹1,223 quarterly-vs-annual gap |
| 6 | Gold loan interest | Calc + explanatory | Improve `/tools/gold-loan-emi-calculator` | "how to calculate gold loan interest" 56.5, "interest calculator for gold loan" 58.5, "gold loan interest calculator" 63.5, "how much loan can i get on 100gm gold" 54.0 (GSC). The bullet-repayment vs EMI distinction is the information gap. | In: `/category/finance` (Loans), personal-loan-emi-calculator | Medium — **the LTV question needs a cited regulatory figure; deliberately unanswered today** |

### Tier 2 — build the tools behind the queries that already have impressions

These are currently `noindex` placeholders. Each is listed because GSC shows real
impressions arriving at the placeholder — meaning Google has already matched the
topic and the only missing piece is a working tool.

| P | Tool to build | GSC impressions at the placeholder | Best related query & position | Difficulty |
| --- | --- | --- | --- | --- |
| 7 | `cgpa-to-percentage-calculator` | **748** — 2nd highest page on the site | "cgpa to percentage" 88.2, "percentage calculator from cgpa" 57.3 | Low — but conversion formulas differ by university; the page must let the user pick the scale and state the formula rather than assume one |
| 8 | `date-difference-calculator` | 81 | "differnce calculator" 60.0 | Low |
| 9 | `ideal-body-weight-calculator` | 79 | — | Low (Devine/Robinson/Miller are published formulas) |
| 10 | `flooring-calculator` | 44 | — | Low |
| 11 | `protein-intake-calculator` | 35 | — | Low |
| 12 | `room-square-footage-calculator` | 32 | — | Low |
| 13 | `cgpa-calculator` | 30 | — | Low |
| 14 | `macro-ratio-calculator` | 25 | — | Low |
| 15 | `permutation-combination-calculator` | 17 | — | Low |

**Rule for all of these:** build the tool, verify its output against a
hand-computed case, write the formula and worked example into
`src/lib/toolDeepContent.ts`, add the id to `IMPLEMENTED_TOOL_IDS`, then let it
index. `npm run seo:audit` fails if the id is added without a renderer case.

The remaining 40 placeholders have no measured demand. **Do not build them to
increase page count.** Build them when someone needs them.

### Tier 3 — the head terms, only after Tiers 1–2 land

`retirement calculator` (89.9), `mutual funds calculator` (74.4),
`vehicle loan emi calculator` (91.0), `car loan emi calculator` (74.5).

These pages work and their content has been deepened, but positions of 74–96
reflect an authority gap that on-page work does not close. Revisit once Tier 1
pages show movement; if `/tools/gst-calculator` moves from 46 into the top 20,
the site-level constraint has loosened and these become worth attacking.

---

## 3. Keyword cannibalization decisions

Every indexable page was checked for pages targeting the same intent.

| Conflict | Evidence | Decision |
| --- | --- | --- |
| `/blog/resizing-images-without-quality-loss` vs `/tools/image-resizer` | Blog: **1,368 impressions, 0 clicks, pos 83.3** — the largest impression source on the site. Tool page: works. Same "resize an image" intent. | **Differentiate, then consolidate if it does not move.** The tool page owns the do-it intent. Rewrite the post to answer the *why* (resampling algorithms, when upscaling is lossy, DPI vs pixels) and link to the tool with descriptive anchor text. If it is still at 0 clicks after 8 weeks, 301 it to `/tools/image-resizer`. |
| `/blog/extracting-zip-files-directly-in-browser` vs `/tools/zip-extractor` | Blog 562 impressions pos 77.0; tool page targets the same queries | **Merge into the tool page.** The blog adds nothing the tool page's new pitfalls section does not. 301 the post to `/tools/zip-extractor`. |
| `/blog/how-to-extract-specific-pdf-pages` vs `/tools/pdf-splitter` | Blog 546 impressions pos 78.4; identical intent; this is Tier-1 territory | **Merge into the tool page.** Fold any unique paragraph into the tool page's deep-dive, then 301. Splitting the signal here is costing the site its best opportunity. |
| `/blog/converting-images-to-pdf-locally` vs `/tools/image-to-pdf` | Blog 250 impressions pos 82.7 | 301 to the tool. |
| `/blog/editing-pdf-metadata-for-privacy` vs `/tools/pdf-metadata` | Blog 282 pos 78.3; tool page pos **55.9** — the tool already ranks better | 301 to the tool. |
| `/blog/checking-wcag-color-contrast-accessibility` vs `/tools/color-palette` | Blog 366 pos 86.5 | **Keep separate.** WCAG threshold explanation is genuinely informational and distinct from "generate a palette". Differentiate the tool page's title toward generation, the post toward compliance. |
| `emi-calculator` vs `loan-calculator` | Both compute reducing-balance repayment | **Keep separate, differentiate.** EMI page owns the amortization schedule; loan page owns the principal-vs-interest split over the term. Titles now reflect exactly that, and they cross-link. |
| `home-loan-emi-calculator` vs `mortgage-calculator` | Same maths | **Keep separate.** Mortgage page owns full PITI (tax, insurance, HOA); home-loan page owns the yearly schedule. Titles differentiated; they cross-link and must not both be optimised for "home loan emi". |
| `compound-interest-calculator` vs `interest-calculator` vs `simple-interest-calculator` | Three pages, overlapping | **Keep three, with distinct jobs.** `interest-calculator` is now positioned as the *comparison* page (simple vs compound side by side); the other two own their single formula. |
| `sip-calculator` vs `mutual-fund-return-calculator` | Both project fund returns | **Keep separate.** SIP page owns the monthly-instalment projection; MF page owns the lump-sum-vs-SIP comparison. Both worked examples were written specifically to reinforce that split. |
| `bmi-calculator` vs `bmr-calculator` vs `body-fat-calculator` | Different formulas, adjacent intent | **Keep separate**, cross-linked. No conflict. |
| `mean-calculator` vs `median-calculator` | Distinct statistics | **Keep separate.** No conflict. |
| `unit-converter` (declared twice) | Two entries, different titles/categories | **Resolved** — duplicate deleted. |
| `json-formatter` (declared twice) | Same | **Resolved** — duplicate deleted. |

**Net:** 5 blog posts to redirect, 1 to rewrite-then-review, 22 to leave. No new
pages are created to target queries an existing page already covers.

---

## 4. Information gain: what was added, and what is still missing

Implemented in `src/lib/toolDeepContent.ts`, rendered by `ToolDeepDive`. Each
entry gives the formula, a **worked example whose arithmetic was computed and
checked**, the mistakes that change the answer, and edge cases.

27 pages now carry it: `emi-calculator`, `car-loan-emi-calculator`,
`bike-loan-emi-calculator`, `gold-loan-emi-calculator`,
`business-loan-emi-calculator`, `sip-calculator`,
`mutual-fund-return-calculator`, `swp-calculator`, `cagr-calculator`,
`irr-calculator`, `fd-calculator`, `rd-calculator`, `ppf-calculator`,
`epf-calculator`, `retirement-calculator`, `compound-interest-calculator`,
`hra-calculator`, `gst-calculator`, `break-even-calculator`,
`profit-margin-calculator`, `discount-calculator`, plus `pdf-splitter`,
`zip-extractor`, `image-compressor`, `bmi-calculator`, `bmr-calculator` and
`mod-calculator`.

Representative examples of the actual gain — these are the sentences a generic
competitor page does not contain:

- **EMI:** on a ₹50L / 8.5% / 20-year loan, month one is ₹35,417 interest and
  ₹7,975 principal — 18% of the payment. That is the argument for early prepayment,
  quantified.
- **Car loan:** 60 → 84 months drops the EMI from ₹16,801 to ₹13,075 and raises
  total interest from ₹2,08,089 to ₹2,98,316. The smaller number costs ₹90,000.
- **SIP:** returns do not overtake contributions until roughly year 11 at 12% —
  which is why years 1–5 feel like failure and why quitting then is expensive.
- **SIP vs lump sum:** the same ₹12,00,000 at the same 12% over the same 10 years
  is ₹37,27,018 as a lump sum and ₹23,23,391 via SIP. A ₹14,03,627 gap from timing.
- **SWP:** ₹30,000/month from ₹50L at 8% never depletes (it grows to ₹69.6L over
  20 years); ₹40,000/month runs out in 22 years 6 months. The threshold is the
  monthly return, ₹33,333.
- **FD:** quarterly vs annual compounding is ₹1,223 on ₹1L over 5 years — the
  reason a calculator disagrees with your bank.
- **RD:** the standard mistake gives ~₹1,38,000 where the answer is ₹1,29,099,
  because each instalment earns for a different length of time.
- **HRA:** in a worked case the *rent* limb binds, not the 50% metro cap — so a
  bigger HRA component in the offer letter would have bought nothing.
- **GST:** subtracting 18% from a GST-inclusive ₹1,180 gives ₹967.60; the answer
  is ₹1,000. A ₹32.40 error that scales with invoice value.
- **Discounts:** "20% then 10%" is 28% off, not 30%.
- **Margin vs markup:** 50% markup is a 33.3% margin — an error that always
  flatters the optimist.
- **IRR:** the naive average return on a real cash-flow series says 12.5%; the IRR
  is 17.09%.
- **Modulo:** `-7 mod 3` is 2, but JavaScript's `-7 % 3` is `-1`. Both reported.
- **PDF split:** "Print to PDF" re-encodes and loses selectable text, form fields
  and links; extracting copies the original page objects.
- **ZIP:** multi-part archives need every segment; a ZIP can list filenames in
  plain sight while the contents are encrypted.

### Still missing — highest-value remaining information gain

1. **Screenshots and short screen recordings** of each tool mid-task. This is the
   clearest first-hand signal available and the site currently has none. Highest
   priority non-writing work.
2. **A verifiable privacy demonstration.** The core claim is "nothing is
   uploaded". Show it: a short section on each file tool explaining how to confirm
   it in the browser's Network tab. This converts a marketing claim into something
   the reader can check — and no competitor can copy it, because for most of them
   it is not true.
3. **Downloadable outputs.** An amortization schedule as CSV; a retirement plan as
   a printable one-pager. Genuine utility, and a reason to link.
4. **The rate-dependent CONTENT TODOs** flagged in `toolDeepContent.ts`: current
   EPF rate and EPS diversion rule, current PPF rate, gold-loan LTV cap, HRA
   regime applicability. **These are deliberately unanswered rather than guessed.**

---

## 5. Authority signals

The audit found no usable backlink data and this repository has no integration
that could provide any, so nothing is asserted about the site's current profile.
What *can* be said from the repo:

- `sameAs` previously pointed at `github.com/yuitility` and `twitter.com/yuitility`.
  These could not be verified from here and were removed. **Re-add only profiles
  that exist and are controlled by Yuitility** — an unresolvable `sameAs` is a
  negative entity signal.
- There is no author or organisation identity anywhere on the site beyond team
  bylines ("Yuitility Finance Team"). For finance and health calculators, which
  sit in YMYL territory, that is a real E-E-A-T gap. An `/about` page naming who
  builds this and what they know is worth more than any on-page tweak in Tier 3.
- The strongest legitimate link-earning asset the site has is the privacy
  architecture itself: a genuinely client-side PDF and image toolchain is
  linkable from privacy, security and "tools that don't upload your files"
  contexts. That is an outreach angle, not a code change, and it is out of scope
  for this repository.

---

## 6. Programmatic SEO decision

**No new programmatic pages.** See `SEO_GROWTH_AUDIT.md` §6. The 49 placeholder
pages *were* the programmatic experiment; it produced ~700 impressions/day for two
weeks and zero clicks, then collapsed. The gate is now enforced in code: a tool
page is only indexable once `IMPLEMENTED_TOOL_IDS` names it, and the audit script
fails the build if that list drifts from the components that actually exist.
