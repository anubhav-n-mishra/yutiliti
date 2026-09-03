# Yuitility SEO Growth Audit

**Date:** 3 September 2026
**Scope:** full repository audit + analysis of the Google Search Console export
`yuitility.app Performance on Search 2026-09-03.xlsx` (last 3 months, Web search).

## What is and is not evidence in this document

| Source | Status |
| --- | --- |
| Repository code, routes, metadata, schema, content | **Verified** — read directly from the repo at commit `ccc40b7` |
| Search Console: queries, pages, devices, countries, daily trend | **Verified** — from the user-supplied export |
| Live-site HTML / rendered DOM | **Not verified** — outbound HTTPS to `www.yuitility.app` is blocked in this environment (proxy returns 403). Every claim below is derived from source code or GSC, never from fetching the live page. |
| Search volumes, keyword difficulty, competitor backlinks, competitor content | **Not available.** No keyword or competitor API is integrated in this repo. Nothing of the kind is asserted anywhere in this document. Where competitive difficulty is discussed it is reasoned from the observed GSC positions, not from a third-party metric. |

---

## 1. Executive summary

The site is not suffering from a technical SEO problem. It is suffering from a
**content trust problem that Google has already measured and acted on.**

The single most important fact in the data is the shape of the daily trend:

| Window | Impressions/day | Avg. position | Clicks |
| --- | --- | --- | --- |
| 19 Jul – 4 Aug | 1–15 | **1.0 – 49** | 8 |
| 5 Aug – 11 Aug | 49 → 204 | 66 → 80 | 2 |
| 12 Aug – 21 Aug | ~700 (plateau) | ~80 | 1 |
| 22 Aug – 31 Aug | 547 → 378 → 178 → 90 → 43 | 81 → 74 | 0 |
| 1 Sep | 3 | 27.7 | 0 |

This is not a site that "can't reach page 1". This is a site where Google
**indexed a large batch of new pages in early August, trialled them at the bottom
of the results for two weeks, measured zero engagement, and then stopped serving
them.** Average position *improved* from 81 to 74 as impressions collapsed —
which only happens when the weakest pages are withdrawn from serving, leaving the
better ones behind.

The average position of ~79 is therefore **an artefact of a large tail of pages
Google evaluated and rejected**, not a uniform ranking ceiling.

Two facts confirm what those rejected pages were:

1. **49 of the 128 tool pages have no working implementation.** They fall through
   `ToolPageClient`'s renderer switch to `GenericInteractiveTool`, which renders a
   generic "Primary Value (X) × Secondary Parameter (Y)" multiplier. A visitor
   searching "cgpa to percentage" landed on a page titled *CGPA to Percentage
   Converter* and got a multiplication widget. That page is the **second-highest
   impression page on the entire site** (748 impressions, position 79.05, 0 clicks).
2. **Every tool page published fabricated review and rating structured data.**
   `getStableHashValue()` generated ratings of 4.5–4.9, review counts between 84
   and 1,850, invented reviewer names ("Alex Carter", "Priya Sharma") and invented
   review text — for a site that collects no reviews. GSC confirms Google consumed
   it: the **Search appearance report shows "Review snippet" with 10 impressions.**

Meanwhile, the pages that actually work rank fine:

| Page | Position | Status |
| --- | --- | --- |
| `/tools/age-calculator` | **6.7** | fully implemented |
| `/tools/social-media-resizer` | **16.5** | fully implemented |
| `/tools/unit-converter` | **17.4** | fully implemented |
| `/privacy` | 17.9 | real content |
| `/` | 27.6 | real content |
| `/tools/cgpa-to-percentage-calculator` | 79.1 | **placeholder widget** |
| `/tools/car-loan-emi-calculator` | 82.1 | works, but head-term competition |
| `/blog/resizing-images-without-quality-loss` | 83.3 | ~300-word thin post |

**Working pages rank 7–28. Broken and thin pages rank 74–93.** That correlation
is the whole diagnosis.

One further data point sets the ceiling on any keyword-level tactic: **across
1,000 distinct queries in three months, exactly one click was ever recorded, on
the brand misspelling "yutility" (position 7.3).** Every non-brand query produced
zero clicks. The site has essentially no non-brand equity to optimise yet — the
job is to earn the right to be served at all, then to convert.

---

## 2. Problems ranked by expected impact

Ranked by *expected impact × confidence*, not by how much work each represents.

### A. Fabricated review and rating structured data — sitewide (rank 1)

- **Category:** M (Other — policy violation) with knock-on effects on all of A–L
- **Evidence:** `src/app/tools/[slug]/page.tsx` (pre-fix) contained
  `getStableReviewBody()`, a `reviewerNames` array, and
  `aggregateRating: { ratingValue: 4.5–4.9, reviewCount: 84–1850 }` derived from a
  hash of the tool id. GSC "Search appearance" reports **Review snippet: 10
  impressions, 1 click, position 7.3** — proving the markup was live and consumed.
- **Affected pages:** all 128 tool pages.
- **Why it matters:** Google's structured data guidelines prohibit marking up
  reviews that were not genuinely collected. This is not a grey area — it is the
  single most commonly actioned structured-data violation, and it can trigger a
  manual action against the whole site, not just the markup. It also contaminates
  every other signal: a site that fabricates 128 aggregate ratings is a site whose
  other claims get discounted.
- **Fix:** removed entirely. The audit script now fails the build if
  `aggregateRating`, `ratingValue`, `reviewCount` or `"@type": "Review"` reappears.
- **Expected impact:** removes a demotion/manual-action risk. On its own it does
  not lift rankings; it removes the thing capping them.
- **Difficulty:** trivial. **Status: done.**

### B. 49 tool pages that do not do what their title promises (rank 2)

- **Category:** D (thin/low-value content) + M (scaled content abuse)
- **Evidence:** `IMPLEMENTED_TOOL_IDS` in `src/lib/toolRegistry.ts` lists 79
  implemented ids; `TOOLS` declares 128 unique ids. The remaining 49 render
  `GenericInteractiveTool` — two sliders and an X × Y product, regardless of what
  the page claims to be.
- **Affected pages (with current GSC impressions):**
  `cgpa-to-percentage-calculator` (748), `date-difference-calculator` (81),
  `ideal-body-weight-calculator` (79), `flooring-calculator` (44),
  `protein-intake-calculator` (35), `room-square-footage-calculator` (32),
  `cgpa-calculator` (30), `macro-ratio-calculator` (25),
  `permutation-combination-calculator` (17), plus 40 more —
  including `regex-tester`, `uuid-v4-generator`, `base64-encoder-decoder`,
  `quadratic-solver`, `matrix-calculator`, `standard-deviation-calculator`,
  `tdee-calculator`, `lorem-ipsum-generator`, `markdown-to-html`, `diff-checker`.
- **Why it matters:** this is the corpus Google trialled in August and withdrew.
  Every one of these pages is a promise the site does not keep. At scale, 49 such
  pages is precisely the "scaled content abuse" pattern — pages created primarily
  to rank rather than to serve. Their failure drags the site-level quality
  assessment down, which is why *working* pages like `car-loan-emi-calculator`
  also sit at position 82.
- **Fix:** all 49 are now `noindex, follow`, removed from the sitemap, removed
  from the homepage grid, the `/tools` hub and category listings, and — most
  importantly — they now render an honest "this tool is not built yet" page that
  routes the visitor to working alternatives in the same category, instead of a
  fake widget.
- **Expected impact:** highest of any change here. It concentrates crawl budget
  and site-level quality assessment on the 79 pages that deserve it. Expect
  impressions to *fall further* first — that is the intended outcome, and the
  metric to watch is average position and CTR on the remaining pages, not total
  impressions.
- **Difficulty:** low to noindex (done); high to actually build 49 tools (roadmap).

### C. The homepage linked to zero tool pages (rank 3)

- **Category:** F (weak internal linking) + H (poor site architecture)
- **Evidence:** `src/app/page.tsx` contained exactly **two** `href` attributes,
  both inside a search-results dropdown that only renders once the user types.
  All three view modes (grid, list, compact) rendered tool cards as
  `<div onClick={() => navigateTo(t.id)}>`, where `navigateTo` called
  `window.location.assign()`. Crawlers follow `href` attributes; they do not
  synthesise clicks on div handlers.
- **Affected pages:** all 128 tool pages, from the site's strongest page
  (`/` at position 27.6 — the only page with meaningful CTR, 13.6%).
- **Why it matters:** internal links are how authority reaches deep pages and how
  Google infers which pages matter. The tool corpus was receiving link equity from
  only three places: category pages (5 of 8 linked from the footer), three
  "related tools" links per tool page, and the XML sitemap. A sitemap entry is a
  discovery hint, not an endorsement.
- **Fix:** every card in all three view modes is now a real `<Link>`. Star buttons
  were moved out of the anchors (interactive content must not nest inside `<a>`).
  A new `/tools` hub renders one server-side anchor per live tool, grouped by
  category, with each tool's description as surrounding context. The homepage,
  header and footer all link to it.
- **Expected impact:** high. This is the change most likely to lift the *working*
  pages, because they finally receive internal authority from the strongest page.
- **Difficulty:** medium. **Status: done.**

### D. Head-term keyword targeting with no realistic chance (rank 4)

- **Category:** B (weak keyword targeting) + I (weak authority)
- **Evidence:** the top queries by impression are all high-competition commercial
  head terms: *vehicle loan emi calculator* (69 impr, pos 91), *retirement
  calculator* (62, pos 89.9), *mutual funds calculator* (61, pos 74.4), *emi
  calculator for car loan* (51, pos 83.5), *epf calculator* (24, pos 58.7), *fd
  calculator* (22, pos 62.6). These SERPs are held by large financial institutions
  and established comparison sites.
- **Why it matters:** positions of 74–97 on these terms mean Google understands
  the topical match but ranks the site last. That gap is authority, and no on-page
  change closes it. Critically, **the long tail is not currently better**: queries
  of five or more words average position 74.5 versus 70.7 for one- and two-word
  queries. There is no easy long-tail win being missed — the whole site is
  suppressed, which points back to A, B and C as the causes.
- **Fix:** rather than chase head terms, the roadmap concentrates on
  *sub-intents where a specific, checkable answer beats a generic calculator* —
  see `SEO_CONTENT_ROADMAP.md`. Titles have been rewritten to target the
  qualifier, not the head term (e.g. "EMI Calculator with Full Amortization
  Schedule" rather than "EMI Calculator - Free Online Finance Tool | Yuitility").
- **Expected impact:** medium, and slow. Realistic first wins are the
  question-shaped PDF and ZIP queries already showing at position 44–65.
- **Difficulty:** high (ongoing content work).

### E. Templated titles and meta descriptions across the corpus (rank 5)

- **Category:** K (poor titles/snippets)
- **Evidence:** the previous `getToolSeoTitle()` produced
  `"{Tool} - Free Online {Category} Tool | Yuitility"`. Five finance tools shared
  the trailing 30 characters verbatim. Descriptions all followed
  "Calculate X with our free online Y. … no signup required."
- **Why it matters:** two effects. Google rewrites boilerplate titles, so you lose
  control of the snippet; and desktop CTR of **0.05%** (4 clicks / 8,518
  impressions) means the snippet is doing no work even where it is shown.
- **Fix:** all 79 live tools now have a hand-written, unique title and meta
  description that leads with the distinguishing capability. The audit script
  fails on duplicates and on stacked pipe-separated phrases.
- **Expected impact:** medium — but only once positions improve. At position 79 no
  title fixes CTR.
- **Difficulty:** low. **Status: done.**

### F. Keyword-stuffed meta keywords (rank 6)

- **Category:** M
- **Evidence:** `getToolKeywords()` generated roughly 100 phrases per page,
  including permutations like `"free online bmi calculator"`,
  `"online bmi calculator free"`, `"bmi calculator online free"`, plus
  `"which is the best offline bmi calculator"` and
  `"safest web tool for bmi calculator"`.
- **Why it matters:** Google has ignored the keywords meta tag since 2009, so
  there was no upside. The downside is real: it is a visible, machine-readable
  declaration of intent to manipulate, which quality raters and spam classifiers
  read as a signal about the site as a whole.
- **Fix:** `getToolKeywords()` deleted; no route emits a keywords meta tag.
- **Expected impact:** low direct, meaningful as a trust signal.
- **Difficulty:** trivial. **Status: done.**

### G. Thin blog posts competing with their own tool pages (rank 7)

- **Category:** D (thin content) + G (cannibalization)
- **Evidence:** 28 posts averaging roughly 250–350 words of templated marketing
  copy. `/blog/resizing-images-without-quality-loss` is the **single largest
  impression source on the site** — 1,368 impressions, 0 clicks, position 83.28 —
  and targets the same intent as `/tools/image-resizer`. Same pattern for
  `/blog/extracting-zip-files-directly-in-browser` (562) vs `/tools/zip-extractor`,
  and `/blog/how-to-extract-specific-pdf-pages` (546) vs `/tools/pdf-splitter`.
- **Why it matters:** for a query like "resize image without losing quality" the
  searcher wants to resize an image. The tool page satisfies that; the blog post
  describes it. Both competing splits the signal and the winner is the weaker page.
- **Fix (this pass):** blog→tool linking repaired (`toolId: "pdf-merge"` pointed at
  a tool id that does not exist — the correct id is `pdf-merger`, so that post's
  tool CTA was silently absent). Article author type corrected from `Person` to
  `Organization`, since the bylines are team names. Full consolidation decisions
  are specified in `SEO_CONTENT_ROADMAP.md` §3.
- **Expected impact:** medium.
- **Difficulty:** medium (content work).

### H. Orphaned category pages and undefined category content (rank 8)

- **Category:** H (site architecture) + D
- **Evidence:** `CATEGORIES` declares 8 categories. The footer linked 5.
  `/category/health`, `/category/conversion` and `/category/utility` were reachable
  only from the sitemap. Worse, `categoryTitles` and `categoryDescriptions` had
  entries for 5 categories, so `/category/math`, `/category/health` and
  `/category/conversion` **rendered `{undefined}` as their intro paragraph** and
  emitted `description: undefined` into their CollectionPage schema.
- **Fix:** `CATEGORY_META` now covers all 8 with a hand-written title, meta
  description and a substantive on-page intro; every category is linked from the
  footer, from `/tools`, and from sibling category pages. Categories with no live
  tools are noindexed rather than shipped empty. The audit script fails on a
  missing entry or a missing footer link.
- **Expected impact:** medium.
- **Difficulty:** low. **Status: done.**

### I. Duplicate tool ids producing duplicate URLs (rank 9)

- **Category:** L (indexation) + G
- **Evidence:** `unit-converter` and `json-formatter` were each declared twice in
  `TOOLS` with different titles, descriptions and categories. `TOOLS.find()`
  returns the first, so the second entry was unreachable dead data — but
  `generateStaticParams()` and the sitemap both iterated the raw array, emitting
  each URL twice.
- **Fix:** duplicates removed; `UNIQUE_TOOLS` de-duplicates defensively; the audit
  script fails on any repeated id.
- **Expected impact:** low. **Difficulty:** trivial. **Status: done.**

### J. Placeholder verification tokens and unverifiable entity claims (rank 10)

- **Category:** M
- **Evidence:** `layout.tsx` emitted literal
  `<meta name="google-site-verification" content="google-site-verification-code">`
  plus the same for Yandex and Yahoo. Organization schema claimed
  `sameAs: ["https://github.com/yuitility", "https://twitter.com/yuitility"]`.
- **Why it matters:** placeholder tokens are inert but signal an unfinished site.
  `sameAs` pointing at profiles that may not exist is a negative entity signal —
  Google uses `sameAs` to corroborate identity, and a link that fails to
  corroborate is worse than no link.
- **Fix:** verification block removed with a comment explaining what to put there.
  `sameAs` removed and replaced with a CONTENT TODO, because this audit cannot
  verify whether those profiles exist. **Do not re-add them unless they do.**
- **Expected impact:** low. **Difficulty:** trivial. **Status: done.**

### K. Deprecated and over-broad structured data (rank 11)

- **Category:** M
- **Evidence:** every tool page emitted a `HowTo` schema built from three generic
  steps ("Enter the values for your scenario."). Google retired HowTo rich results
  in 2023. `FAQPage` was emitted on all 128 tool pages, but only 28 tools have
  hand-written FAQs — the other 100 shared one of six category-level templates, so
  ~20 pages at a time published byte-identical "unique" FAQ entities.
- **Fix:** `HowTo` removed (the steps remain as visible page content, where they
  are still useful). `FAQPage` is now emitted only where `hasHandWrittenFaqs()` is
  true. Schema was reduced to what the page genuinely is: `WebPage`,
  `SoftwareApplication`, `BreadcrumbList`, and `FAQPage` where earned.
- **Expected impact:** low direct; removes another templated-content signal.
- **Difficulty:** low. **Status: done.**

### L. Breadcrumbs pointing at a URL pattern the site does not use (rank 12)

- **Category:** H
- **Evidence:** tool-page `BreadcrumbList` linked position 3 to
  `/?category=finance` — a query-parameter URL that is not a real route (the
  homepage filter is client state) — while the actual category route is
  `/category/finance`.
- **Fix:** breadcrumbs now run `/tools → /category/{id} → tool`, and the visible
  breadcrumb links match the schema exactly.
- **Expected impact:** low. **Difficulty:** trivial. **Status: done.**

### Problems explicitly ruled *out*

- **L (indexation problems) as a root cause.** Pages are being indexed and served
  — 8,850 impressions across 126 URLs. Discovery is not the bottleneck.
- **Rendering/JS indexability.** Tool pages are server components; the homepage is
  a client component but Next.js still server-renders it. Content is in the HTML.
- **robots.txt / canonical errors.** `robots.ts` allows everything except `/api/`
  and `/private/`. Canonicals are present, self-referential and absolute-based via
  `metadataBase`. The apex→www redirect is correctly a 308 permanent.
- **Site speed as a primary factor.** Not measurable from here, and nothing in the
  GSC data points to it. Not a credible explanation for position 79.

---

## 3. Where the winnable ground actually is

The GSC query data contains one genuinely encouraging pattern. The site's *best*
non-brand positions are on specific, procedural questions:

| Query | Position |
| --- | --- |
| how to select some pages from pdf | 44.0 |
| how to take one page of a pdf | 51.0 |
| is there a way to download specific pages of a pdf | 52.0 |
| can anyone open a zip file | 55.0 |
| how to extract certain pages from pdf | 56.0 |
| how do i view a zip file | 56.0 |
| how to calculate gold loan interest | 56.5 |
| epf interest rate calculator | 53.3 |
| gst calculator | 46.0 |
| gst tax calculator | 50.2 |

These are queries where a **correct, specific, first-hand answer beats a generic
calculator page** — and where the site's genuine differentiator (nothing is
uploaded, so a confidential PDF stays on your machine) is directly relevant to the
searcher's actual worry. That is the beachhead. See `SEO_CONTENT_ROADMAP.md`.

---

## 4. Internal link report

Measured from the repository, before and after this pass.

| Metric | Before | After |
| --- | --- | --- |
| `href` attributes on `/` pointing to tool pages | 2 (both hidden behind a search input) | 24 visible cards + 9 category links + `/tools` |
| Crawlable page listing every tool | none | `/tools` (79 anchors, grouped, with context) |
| Category pages linked from the footer | 5 of 8 | 8 of 8 + `/tools` |
| Orphan category pages | `/category/health`, `/category/conversion`, `/category/utility` | none |
| Categories rendering `undefined` as their description | 3 (`math`, `health`, `conversion`) | 0 |
| Related-tool links per tool page | 3, chosen as "first 3 in same category" | 4, curated by task adjacency, + category + `/tools` |
| Tool pages with a link back to their category | 0 (breadcrumb was plain text) | all |
| Broken internal references | `toolId: "pdf-merge"` (no such tool) | 0, enforced by `npm run seo:audit` |
| Indexable pages with no working content | 49 | 0 |

**Pages still under-linked, for the roadmap:** the 79 live tools each receive one
link from `/tools`, one from their category page, and a variable number of
contextual links from `RELATED_TOOLS`. The most-linked are `emi-calculator` (7
inbound contextual links), `image-compressor` (5), `pdf-merger` (5) — which
correctly matches where the demand is. Tools with only the structural minimum are
listed by `npm run seo:audit` as `missing-title`/`missing-description` warnings
when they also lack hand-written metadata; currently none do.

**Excessively linked pages:** none. No page exceeds 8 inbound contextual links,
and `RELATED_TOOLS` is a hand-curated map rather than a generated cross-product,
so there is no circular link spam.

---

## 5. Indexation strategy after this pass

| Page type | Count | Indexed | Rationale |
| --- | --- | --- | --- |
| Live tool pages | 79 | Yes | Working, useful, unique metadata |
| Planned tool pages | 49 | **No** (`noindex, follow`) | No implementation — cannot satisfy the query |
| Category pages with live tools | 8 | Yes | Genuine listing + hand-written intro |
| Category pages with no live tools | 0 | No | Would be an empty listing |
| `/tools` hub | 1 | Yes | Primary internal-linking backbone |
| Blog posts | 28 | Yes (for now) | Thin; consolidation decisions in the roadmap |
| `/`, `/about`, `/blog` | 3 | Yes | — |
| `/privacy`, `/terms`, `/cookies` | 3 | Yes, not in sitemap | Indexable but no need to spend crawl prompts |
| `/api/*`, `/private/*` | — | Disallowed in robots.txt | — |

**Sitemap went from 172 URLs to 119** (79 live tools + 8 categories + 28 posts +
4 hubs). No faceted, parameter or filter URLs exist on this site — the homepage
filter is client state and generates no URLs — so there is nothing to prune there.

---

## 6. On programmatic SEO

**Programmatic page generation is not appropriate for this site right now, and
attempting more of it is what caused the current situation.**

The 49 placeholder tool pages *are* programmatic SEO: entries added to a `TOOLS`
array to create routes, with the content generated by template functions
(`getToolKeywords`, `getToolFaqs`, `getToolHowItWorks`) that swap the tool name
into fixed prose. `docs/tools_roadmap_checklist.md` describes an explicit plan to
reach "500+ tools", and pages were checked off as complete before the tool behind
them existed.

The condition under which a programmatic page is legitimate is that **each page
carries substantially unique, genuinely useful content or data.** For a tools site
that means the tool must work. A calculator page whose only unique element is its
title is not a page; it is a URL.

The correct sequencing is the reverse of what happened: build the tool, verify it
produces correct results, write the page's specific formula and worked example,
add it to `IMPLEMENTED_TOOL_IDS`, and only then let it be indexed. That gate is
now enforced in code and in `npm run seo:audit`.

---

## 7. What was implemented in this pass

See `SEO_STANDARDS.md` for the rules and `SEO_EXPERIMENTS.md` for the measurement
plan. Summary of code changes:

1. Removed all fabricated `aggregateRating` / `Review` structured data.
2. `src/lib/toolRegistry.ts` — single source of truth for which tools are real.
3. 49 unimplemented tools: `noindex`, out of the sitemap, out of every listing,
   and rendering an honest `PlannedToolNotice` instead of a fake widget.
4. Homepage tool cards converted from `div onClick` to real `<Link>` anchors.
5. New `/tools` hub — server-rendered anchor for every live tool.
6. All 8 categories given hand-written metadata and footer links; 3 orphans fixed.
7. 79 unique, hand-written titles and meta descriptions; boilerplate removed.
8. `getToolKeywords()` (~100 stuffed phrases/page) deleted.
9. `HowTo` schema removed; `FAQPage` restricted to hand-written FAQs.
10. `ToolDeepDive` — formula, checked worked example, pitfalls and edge cases on
    27 priority pages (`src/lib/toolDeepContent.ts`).
11. Curated `RELATED_TOOLS` contextual internal-linking map.
12. Breadcrumbs corrected to real routes; `BreadcrumbList` added to blog posts.
13. Placeholder verification meta and unverifiable `sameAs` removed.
14. Duplicate `unit-converter` / `json-formatter` entries removed.
15. `scripts/seo-audit.mjs`, wired to `prebuild` so regressions fail the build.
