# SEO Experiments Log

Every SEO change is a hypothesis until the data says otherwise.

**No entry in this file may claim that a change "will improve rankings."** Record
what changed, what you expect, and then what actually happened. If the outcome
contradicts the hypothesis, write that down — that is the useful part.

## How to use this file

1. Add a row to **Active experiments** when you ship a change.
2. Record the baseline **before** the change from Search Console. Do not
   reconstruct it later from memory.
3. Wait the stated review date. Google needs to recrawl, reprocess and re-evaluate;
   for indexation changes on a site this size, meaningful signal takes 3–8 weeks.
4. Fill in the actual outcome and move the row to **Concluded**.

### Measuring correctly

- Compare **like-for-like date ranges** of equal length. Weekday/weekend mix
  distorts short windows.
- **Segment by page.** Sitewide averages on this site are dominated by whichever
  large group of pages Google is currently trialling. The August 2026 data is the
  cautionary example: average position "improved" from 81 to 74 purely because bad
  pages stopped being served.
- **Watch position and CTR on a fixed set of pages**, not total impressions.
  Impressions are the most misleading metric here.
- Note any known Google update in the window before attributing a change to your
  own work.

---

## Baseline: before any change

Source: `yuitility.app Performance on Search 2026-09-03.xlsx`, Web search,
last 3 months (2026-06-05 → 2026-09-03 as exported; data effectively starts
2026-07-19).

| Metric | Value |
| --- | --- |
| Total clicks | **11** |
| Total impressions | **8,850** |
| Average CTR | **0.1%** |
| Average position | **79.7** |
| Distinct queries with ≥1 impression | 1,000 (export cap) |
| **Distinct queries with ≥1 click** | **1** — `yutility` (brand misspelling) |
| Pages with ≥1 impression | 126 |
| Pages with ≥1 click | 6 |
| Desktop | 4 clicks / 8,518 impressions / CTR 0.05% / pos 79.71 |
| Mobile | 7 clicks / 329 impressions / CTR 2.13% / pos 78.66 |
| Tablet | 0 clicks / 1 impression / pos 9.0 |
| Search appearance: Review snippet | 1 click / 10 impressions / pos 7.3 |

Daily trend (the important part):

| Date | Impressions | Position |
| --- | --- | --- |
| 2026-07-22 | 1 | 1.0 |
| 2026-07-26 | 5 | 6.6 |
| 2026-08-01 | 9 | 27.4 |
| 2026-08-05 | 49 | 66.4 |
| 2026-08-12 | 724 | 82.2 |
| 2026-08-18 | 741 | 80.7 |
| 2026-08-22 | 378 | 81.4 |
| 2026-08-25 | 43 | 74.6 |
| 2026-08-31 | 40 | 74.1 |
| 2026-09-01 | 3 | 27.7 |

Reference pages to track individually (position at baseline):

| Page | Clicks | Impr | Position |
| --- | --- | --- | --- |
| `/` | 6 | 44 | 27.61 |
| `/tools/age-calculator` | 1 | 11 | 6.73 |
| `/tools/social-media-resizer` | 1 | 6 | 16.50 |
| `/tools/unit-converter` | 0 | 18 | 17.39 |
| `/tools/gst-calculator` | 0 | 67 | 65.70 |
| `/tools/epf-calculator` | 0 | 169 | 66.45 |
| `/tools/fd-calculator` | 0 | 219 | 68.62 |
| `/tools/pdf-metadata` | 0 | 32 | 55.91 |
| `/tools/car-loan-emi-calculator` | 0 | 470 | 82.09 |
| `/tools/mutual-fund-return-calculator` | 0 | 454 | 78.95 |
| `/tools/cgpa-to-percentage-calculator` | 0 | 748 | 79.05 |
| `/blog/resizing-images-without-quality-loss` | 0 | 1,368 | 83.28 |
| `/blog/extracting-zip-files-directly-in-browser` | 0 | 562 | 76.95 |
| `/blog/how-to-extract-specific-pdf-pages` | 0 | 546 | 78.39 |

---

## Active experiments

### EXP-001 — Remove fabricated review and rating structured data

| Field | Value |
| --- | --- |
| **Change** | Deleted `aggregateRating`, `review`, `getStableReviewBody()` and the invented reviewer list from `src/app/tools/[slug]/page.tsx`. Added a build-failing guard. |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | All 128 tool pages |
| **Hypothesis** | The markup was a structured-data policy violation on every tool page and a plausible contributor to site-level quality suppression. Removing it should not improve rankings by itself, but it removes a demotion and manual-action risk that would cap anything else we do. |
| **Expected outcome** | "Review snippet" disappears from the Search appearance report within ~4 weeks. No ranking movement attributable to this change alone. Possible small loss of the 10 review-snippet impressions — acceptable. |
| **Review date** | 2026-10-01 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

### EXP-002 — Noindex the 49 tool pages with no implementation

| Field | Value |
| --- | --- |
| **Change** | `noindex, follow` on every tool not in `IMPLEMENTED_TOOL_IDS`; removed from sitemap, homepage grid, `/tools` hub and category listings; the generic X × Y placeholder widget replaced with an honest "not built yet" page linking to working alternatives. |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | 49 (sitemap 172 → 119 URLs) |
| **Hypothesis** | These pages are what Google trialled from 5 Aug and withdrew from 22 Aug. They cannot satisfy the queries they are matched to, and at 38% of the indexable corpus they are dragging the site-level quality assessment down — which is why *working* pages such as `/tools/car-loan-emi-calculator` also sit at position 82. Removing them from the index should let crawl budget and quality assessment concentrate on the 79 pages that work. |
| **Expected outcome** | **Total impressions fall sharply** — `/tools/cgpa-to-percentage-calculator` alone is 748 of the 8,850. That is the intended outcome and must not be read as a regression. The metric that matters is **average position and CTR on the 79 live pages**, tracked separately. Expect the fixed reference set above to hold or improve. If live-page positions are unchanged after 8 weeks, the site-quality hypothesis is wrong and the constraint is purely authority. |
| **Review date** | 2026-11-01 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

### EXP-003 — Make the homepage link to tool pages at all

| Field | Value |
| --- | --- |
| **Change** | All three homepage view modes converted from `<div onClick={navigateTo}>` to real `<Link href>` anchors. New server-rendered `/tools` hub with one anchor per live tool. Header, footer and homepage all link to it. All 8 categories linked from the footer (was 5). |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | Sitewide. Homepage went from 2 hidden tool `href`s to 24 visible cards + 9 category links + the hub. |
| **Hypothesis** | Tool pages were receiving almost no internal link equity, because the site's strongest page (`/`, position 27.6, CTR 13.6%) linked to none of them in HTML. Real anchors plus a hub should let internal authority reach the tool corpus and help Google infer which pages matter. |
| **Expected outcome** | Improved crawl frequency on tool pages; gradual position improvement on live tool pages over 4–8 weeks. Slowest-acting of the three P0 changes. |
| **Review date** | 2026-11-01 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

### EXP-004 — Rewrite all 79 titles and meta descriptions

| Field | Value |
| --- | --- |
| **Change** | Replaced `"{Tool} - Free Online {Category} Tool \| Yuitility"` with unique, hand-written titles leading on the distinguishing capability, and 79 unique descriptions. Removed the `keywords` meta tag (~100 stuffed phrases/page). |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | 79 live tool pages + 8 category pages |
| **Hypothesis** | Boilerplate titles get rewritten by Google, so the site does not control its own snippet; and desktop CTR of 0.05% shows the snippet is doing no work. Distinct titles should reduce rewriting. **This will not move CTR while pages sit at position 79** — a snippet nobody sees cannot be clicked. The test only becomes meaningful for pages that reach the top 20. |
| **Expected outcome** | Fewer Google-rewritten titles. **No measurable CTR change until positions improve.** Do not judge this experiment before EXP-002 and EXP-003 conclude. |
| **Review date** | 2026-11-15 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

### EXP-005 — Add formula, worked example, pitfalls and edge cases to priority pages

| Field | Value |
| --- | --- |
| **Change** | `src/lib/toolDeepContent.ts` + `ToolDeepDive` component: the equation, a computed and checked worked example, the mistakes that change the answer, and edge cases, on 27 priority pages. |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | 27 (EMI, car/bike/gold/business loan, SIP, MF return, SWP, CAGR, IRR, FD, RD, PPF, EPF, retirement, compound interest, HRA, GST, break-even, margin, discount, PDF split, ZIP, image compressor, BMI, BMR, modulo) |
| **Hypothesis** | These pages currently say nothing a competitor's page does not. Specific, verifiable content — "quarterly compounding is worth ₹1,223 on this deposit", "20% then 10% is 28% off, not 30%" — is the kind of information gain that distinguishes a page worth ranking from one that merely matches the topic. |
| **Expected outcome** | Watch `/tools/gst-calculator` (pos 65.7) and `/tools/fd-calculator` (pos 68.6) first — best positions among the treated pages, so most likely to show movement. Expect nothing before 4 weeks. |
| **Review date** | 2026-11-01 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

### EXP-006 — Topical re-clustering of tool categories

| Field | Value |
| --- | --- |
| **Change** | Reassigned 17 tools so categories reflect topics: `media` 1 → 7, `health` 1 → 5, `math` 0 → 5, `conversion` 0 → 2, `utility` 22 → 9. `/category/finance` (38 tools) now renders as six named sub-clusters with explanatory copy instead of one grid. Category is not part of any URL, so no redirects were needed. |
| **Date shipped** | 2026-09-03 |
| **Pages affected** | 8 category pages, 79 tool pages (breadcrumbs), `/tools` |
| **Hypothesis** | Coherent clusters help Google associate the site with specific topics. A 22-item "Everyday Utilities" bucket containing image tools, health calculators and converters communicates nothing; a 7-item "Image & Media" cluster does. |
| **Expected outcome** | Category pages become eligible for their own category-level queries. Slow-acting; judge alongside EXP-003. |
| **Review date** | 2026-11-15 |
| **GSC impressions (actual)** | *pending* |
| **GSC clicks (actual)** | *pending* |
| **CTR (actual)** | *pending* |
| **Average position (actual)** | *pending* |
| **Actual outcome** | *pending* |

---

## Queued — not yet shipped

| ID | Change | Hypothesis | Depends on |
| --- | --- | --- | --- |
| EXP-007 | Consolidate 5 cannibalizing blog posts into their tool pages via 301 (`extracting-zip-files…`, `how-to-extract-specific-pdf-pages`, `converting-images-to-pdf-locally`, `editing-pdf-metadata-for-privacy`, and `resizing-images-without-quality-loss` if it has not moved) | Two pages competing for one intent split the signal, and the tool page is the one that satisfies it. `/tools/pdf-metadata` already outranks its blog post (55.9 vs 78.3). | Roadmap §3 |
| EXP-008 | Build the 9 Tier-2 tools that already receive impressions at their noindexed placeholder | Demand is demonstrated; only the implementation is missing. `cgpa-to-percentage-calculator` alone had 748 impressions. | Roadmap §2 |
| EXP-009 | Add screenshots and a "verify it yourself in the Network tab" section to file tools | Converts the privacy claim from marketing copy into something the reader can check. No competitor that uploads files can copy it. | Roadmap §4 |
| EXP-010 | Resolve the rate CONTENT TODOs (EPF, PPF, gold-loan LTV, HRA regime) with cited sources | Those pages cannot fully answer their queries while the key number is deliberately absent. | Needs a citable source |

---

## Concluded experiments

*None yet. The first review date is 2026-10-01 (EXP-001).*

---

## Notes for whoever reviews these

- **Impressions will go down first.** That is the point of EXP-002, not a failure.
- The site's total click volume (11 in three months, 10 of them brand or
  near-brand) is so low that click-based metrics are statistically meaningless for
  now. Judge by **position on a fixed set of pages** until non-brand clicks
  regularly exceed zero.
- If, after EXP-002 and EXP-003 have had 8 weeks, the live tool pages have not
  moved off position ~75, the site-quality hypothesis is wrong and the binding
  constraint is off-site authority. Say so here and change the strategy — do not
  ship more on-page changes and hope.
