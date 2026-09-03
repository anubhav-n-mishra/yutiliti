# Yuitility SEO Standards

Rules for anyone — human or agent — adding to or changing this codebase.

Most of these exist because the opposite was already tried here and measurably
failed. `SEO_GROWTH_AUDIT.md` has the evidence for each.

Run `npm run seo:audit` before opening a PR. It also runs automatically as
`prebuild`, so a violation of a checked rule fails the build.

---

## The one rule underneath all the others

**A page may only be indexable if it does the thing its title promises.**

Not "will do", not "is on the roadmap", not "renders something in that general
area". Between August 5 and August 22 2026 this site had ~700 impressions a day at
average position 80 with zero clicks, because 49 pages titled things like
*Standard Deviation Calculator* rendered a generic two-slider multiplier. Google
served them for two weeks, measured the outcome, and stopped. Every rule below is
a specific case of this one.

---

## 1. Titles

- **Every indexable page has a unique `<title>`.** Enforced: `duplicate-title`.
- **Target ≤ 60 characters before the ` | Yuitility` suffix.** Warned:
  `title-length`.
- **Lead with the entity the searcher typed, then the distinguishing detail.**
  `EMI Calculator with Full Amortization Schedule` — not
  `EMI Calculator - Free Online Finance Tool | Yuitility`.
- **Never stack synonyms or repeat the keyword.** No
  `Best X | X Online | Cheap X | Free X`. Enforced: `title-spam` fails on more
  than one pipe separator.
- **No superlatives** — "best", "top", "#1", "cheapest". Warned: `title-spam`.
- **Do not put "Free" and "Online" in every title.** When 79 titles carry the same
  two words they stop being information and start being boilerplate that Google
  rewrites.
- Live tool titles live in `TOOL_SEO_TITLES` in `src/lib/site.ts`. Category titles
  live in `CATEGORY_META`.

## 2. Meta descriptions

- **Unique per page.** Enforced: `duplicate-description`.
- **Roughly 110–170 characters.** Warned outside 70–190.
- **Say something the competing page's description does not.** "Compress images
  online free, no signup" is every result on the page. "Cut image file size with a
  live before-and-after comparison, so you can find the setting where the saving
  stops being worth it" is one of them.
- **Do not end every description with the same clause.** The privacy claim is the
  site's differentiator; using it as a suffix on all 79 pages spends it.
- Descriptions live in `TOOL_SEO_DESCRIPTIONS` in `src/lib/site.ts`.

## 3. H1 and heading hierarchy

- **Exactly one `<h1>` per page**, and it names the thing the page is.
- The `<h1>` may differ from the `<title>` — the title serves the SERP, the H1
  serves the reader on the page.
- Headings must nest without skipping: `h1 → h2 → h3`. Do not pick a heading level
  for its font size; use a class.
- **Do not repeat the target keyword in consecutive headings.** "BMI Calculator" /
  "Free BMI Calculator" / "Online BMI Calculator" as three H2s is stuffing.
- Headings must describe the section beneath them. "The maths behind the EMI
  calculator" is a heading; "More information" is not.

## 4. Canonicals

- **Every indexable route declares a canonical.** Enforced: `missing-canonical`.
- Use the relative path in `alternates.canonical`; `metadataBase` in
  `src/app/layout.tsx` makes it absolute.
- Canonicals are **self-referential** unless you are deliberately consolidating
  duplicates, in which case say why in a comment.
- The canonical host is `https://www.yuitility.app`. The apex redirects 308 to
  www (`next.config.ts`). Never emit an apex-host canonical.

## 5. URLs

- Lowercase, hyphen-separated, no trailing slash, no query parameters.
- `/tools/<tool-id>` for tools, `/category/<category-id>` for hubs,
  `/blog/<slug>` for articles. Do not invent a fourth pattern.
- **A tool's `id` is its URL and is permanent.** Changing an `id` breaks every
  inbound link and requires a 301. Changing a tool's `category` is free — category
  is not part of any URL.
- No date in blog slugs; it makes evergreen content look stale.

## 6. Internal links

- **Links must be `<a>`/`<Link>` elements with an `href`.** A `<div onClick>` that
  calls `router.push` or `window.location.assign` is invisible to a crawler. The
  homepage shipped 128 tool cards this way and passed authority to none of them.
- **Anchor text describes the destination.** "Open the PDF splitter" over "click
  here"; but do not use the identical exact-match anchor on every link to a page.
- **Interactive elements must not nest inside an anchor.** A `<button>` inside an
  `<a>` is invalid HTML. Use a relative wrapper with the anchor stretched via
  `after:absolute after:inset-0`, and position the button above it.
- **Related-tool links are curated, not generated.** Add pairs to `RELATED_TOOLS`
  in `src/lib/toolRegistry.ts` based on what someone actually needs next in the
  same task. Do not generate a cross-product of same-category tools.
- **Every internal link target must resolve and be live.** Enforced:
  `broken-internal-link` checks `RELATED_TOOLS` and every blog `toolId`.
- **No orphans.** Every category with live tools is linked from the footer.
  Enforced: `orphan-category`. Every live tool is linked from `/tools` and from
  its category page.
- Client-side pagination creates no crawlable URLs. If a listing is paginated,
  there must be a server-rendered hub that links everything — that is what
  `/tools` is for.

## 7. Structured data

- **Only mark up what is visibly on the page and factually true.**
- **Never emit `aggregateRating`, `ratingValue`, `reviewCount` or
  `"@type": "Review"`.** Yuitility collects no ratings. Publishing them is
  fabricated structured data and a policy violation — this site was already doing
  it on all 128 tool pages, and Search Console confirms Google consumed it
  ("Review snippet", 10 impressions). Enforced: `fabricated-schema` fails the
  build. If real reviews are ever collected, they must come from real users, be
  visible on the page, and be re-enabled deliberately with this rule rewritten.
- **`FAQPage` only where the FAQs were written for that specific page.** Gated by
  `hasHandWrittenFaqs()`. Category-template FAQs still render as visible content;
  they just do not claim to be distinct FAQ entities.
- **No `HowTo`.** Google retired the rich result in 2023.
- **Author must match reality.** Team bylines are `Organization`, not `Person`.
  Do not invent a named author.
- **`sameAs` only for profiles that exist and that Yuitility controls.** A
  `sameAs` that 404s fails to corroborate identity and is worse than omitting it.
- **No placeholder verification tokens in metadata.** Enforced:
  `placeholder-meta`.
- Types in use: `WebSite`, `Organization`, `SoftwareApplication`, `WebPage`,
  `CollectionPage`, `BreadcrumbList`, `BlogPosting`, `FAQPage` (conditional).
- Breadcrumb schema must match the visible breadcrumb and point at real routes.

## 8. Sitemap

- Sources tool URLs from `LIVE_TOOLS` only. Enforced: `sitemap`.
- Contains no `noindex` page, no duplicate URL, no empty category.
- Omits `priority` and `changeFrequency` — Google ignores both.
- Legal pages are indexable but intentionally excluded; they need no prompting.

## 9. Indexation

- **Default is indexable. Non-indexable is a deliberate, commented decision.**
- `noindex, follow` (never `noindex, nofollow`) for: tools with no
  implementation, categories with no live tools. `follow` keeps equity moving
  through the page.
- Enforced: `indexation` fails if the tool route stops noindexing unbuilt tools.
- Before making anything `noindex`, check GSC for existing impressions and record
  the change in `SEO_EXPERIMENTS.md`.

## 10. Content quality

- **Do not add words to hit a length.** If a section has nothing to say, delete it.
- **Every priority page should contain something a competitor's page does not:**
  the formula, a worked example with real arithmetic, the mistake that changes the
  answer, an edge case, a screenshot. That is the bar in
  `src/lib/toolDeepContent.ts`.
- **Verify every number you publish.** The worked examples in `toolDeepContent.ts`
  were each computed and checked. A wrong worked example is worse than none.
- **Never invent a fact you cannot verify** — an interest rate, a tax slab, a
  regulatory cap, a statistic. Write a `CONTENT TODO` comment naming what needs
  citing, and leave the claim unmade. There are live examples of this in
  `toolDeepContent.ts` for EPF, PPF, gold-loan LTV and HRA regime rules.
- **No `keywords` meta tag.** Google has ignored it since 2009; ~100 stuffed
  phrases per page was pure downside. Warned: `meta-keywords`.
- Health and finance pages state their limits plainly. A BMI page that does not
  say BMI ignores body composition is not being helpful.

## 11. New tool pages — required order

1. Build the component and verify its output against a hand-computed case.
2. Add the entry to `TOOLS` in `src/types.ts` with a real description.
3. Add the `case` to `ToolRenderer` in `src/components/ToolPageClient.tsx`.
4. Add a unique title to `TOOL_SEO_TITLES` and description to
   `TOOL_SEO_DESCRIPTIONS`.
5. Add contextual entries to `RELATED_TOOLS` — in *and* out.
6. Add a `toolDeepContent.ts` entry if the page is a priority target.
7. **Only now** add the id to `IMPLEMENTED_TOOL_IDS`.
8. Run `npm run seo:audit`.

Adding to `IMPLEMENTED_TOOL_IDS` without step 3 fails the build
(`registry-drift`). That is the gate, and it is the point.

## 12. Programmatic pages

- Permitted **only** when each generated page carries substantially unique and
  genuinely useful content or data.
- Swapping a name into a template is not unique content.
- A route with no working tool behind it is not a page.
- Page count is not a goal. `docs/tools_roadmap_checklist.md` targets "500+
  tools"; treat that as a wish list, not a plan, and never tick an item before the
  tool works.

## 13. Duplicate content and cannibalization

- **Before creating a page, check whether an existing page targets that intent.**
  If one does, improve it instead.
- Two pages may cover the same subject only if they serve *different intents*, and
  the difference must be visible in the title, the H1 and the opening paragraph.
  `emi-calculator` (amortization schedule) vs `loan-calculator`
  (principal/interest split) is the model.
- **No duplicate tool ids.** Enforced: `duplicate-tool-id`.
- Blog posts must not restate their tool page. The tool does; the article explains
  why, when and what goes wrong.

## 14. Redirects

- Removing or renaming an indexable URL requires a `301`/`308` to the closest
  equivalent — never to the homepage unless nothing closer exists.
- Consolidating cannibalizing pages: 301 the weaker into the stronger, and move
  any unique content across *before* redirecting.
- Redirect chains must be at most one hop. The apex → www redirect already uses
  one; do not stack on it.

## 15. Image SEO

- Every content image has `alt` text describing the image, not the keyword. A
  decorative image takes `alt=""`.
- Serve appropriately sized images; do not ship a 4000px file to an 800px slot.
- Descriptive filenames — `og-emi-calculator.png`, not `img_04.png`.
- Open Graph images are 1200×630 and per-page where one exists.

---

## Automated checks

`npm run seo:audit` (also `prebuild`). **ERROR fails the build; WARN reports only.**

| Check | Level | Detects |
| --- | --- | --- |
| `duplicate-tool-id` | ERROR | Same tool id declared twice → duplicate URLs |
| `registry-drift` | ERROR | Tool marked live with no renderer case, or vice versa |
| `duplicate-title` | ERROR | Two pages sharing a title |
| `title-spam` | ERROR | Stacked pipe-separated phrases in a title |
| `duplicate-description` | ERROR | Two pages sharing a meta description |
| `fabricated-schema` | ERROR | `aggregateRating` / `ratingValue` / `reviewCount` / `Review` |
| `placeholder-meta` | ERROR | Placeholder verification tokens in `layout.tsx` |
| `missing-canonical` | ERROR | An indexable route with no canonical |
| `sitemap` | ERROR | Sitemap not sourced from `LIVE_TOOLS` |
| `category-meta` | ERROR | A category with no `CATEGORY_META` entry |
| `orphan-category` | ERROR | A category with live tools not linked from the footer |
| `broken-internal-link` | ERROR | `RELATED_TOOLS` or blog `toolId` pointing nowhere |
| `indexation` | ERROR | Tool route stopped noindexing unbuilt tools |
| `title-length` | WARN | Title over 60 chars before the brand suffix |
| `description-length` | WARN | Description under 70 or over 190 chars |
| `missing-title` / `missing-description` | WARN | Live tool without hand-written metadata |
| `orphan-title` | WARN | Metadata entry for a tool that does not exist |
| `meta-keywords` | WARN | A `keywords` meta tag reintroduced |

### Not covered by the script

These need a crawl of the built or live site and are not automated here:

- Broken *outbound* links and 404s from rendered HTML
- Multiple `<h1>` elements per rendered page
- Structured-data validation against Google's Rich Results Test
- Core Web Vitals
- Actual index coverage (Search Console only)

Run these manually before a significant release.
