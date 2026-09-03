#!/usr/bin/env node
/**
 * Static SEO guardrails.
 *
 * Run with `npm run seo:audit`. Exits non-zero on any ERROR so it can gate CI.
 * WARNs are reported but do not fail the build.
 *
 * These checks encode the rules in SEO_STANDARDS.md. They exist because the
 * problems they detect are exactly the ones that put this site at position ~79:
 * pages promising a tool that does not exist, duplicate titles across a large
 * templated corpus, orphaned routes and fabricated structured data.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const errors = [];
const warnings = [];
const err = (check, msg) => errors.push(`${check}: ${msg}`);
const warn = (check, msg) => warnings.push(`${check}: ${msg}`);

// --------------------------------------------------------------------------
// Parse the sources we need without importing TypeScript.
// --------------------------------------------------------------------------

const typesSrc = read("src/types.ts");
const registrySrc = read("src/lib/toolRegistry.ts");
const siteSrc = read("src/lib/site.ts");
const rendererSrc = read("src/components/ToolPageClient.tsx");
const blogsSrc = read("src/lib/blogs.ts");
const sitemapSrc = read("src/app/sitemap.ts");
const layoutSrc = read("src/app/layout.tsx");
const toolPageSrc = read("src/app/tools/[slug]/page.tsx");

/** Tool ids declared in TOOLS (excludes the CATEGORIES block at the end). */
const toolsBlock = typesSrc.slice(
  typesSrc.indexOf("export const TOOLS"),
  typesSrc.indexOf("export const CATEGORIES"),
);
const declaredIds = [...toolsBlock.matchAll(/id: "([a-z0-9-]+)"/g)].map((m) => m[1]);

/** Ids the registry marks as implemented. */
const implementedBlock = registrySrc.slice(
  registrySrc.indexOf("IMPLEMENTED_TOOL_IDS"),
  registrySrc.indexOf("export const isToolLive"),
);
const registryIds = [...implementedBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);

/** Ids the renderer actually has a component for. */
const rendererIds = [...rendererSrc.matchAll(/case "([a-z0-9-]+)":/g)].map((m) => m[1]);

const categoryIds = [
  ...typesSrc
    .slice(typesSrc.indexOf("export const CATEGORIES"))
    .matchAll(/id: "([a-z0-9-]+)"/g),
].map((m) => m[1]).filter((id) => id !== "all");

// --------------------------------------------------------------------------
// 1. Duplicate tool ids -> duplicate URLs and an unreachable second entry
// --------------------------------------------------------------------------
const seen = new Set();
for (const id of declaredIds) {
  if (seen.has(id)) err("duplicate-tool-id", `"${id}" is declared more than once in TOOLS`);
  seen.add(id);
}

// --------------------------------------------------------------------------
// 2. The registry and the renderer must not drift.
//    A tool marked live without a component renders a placeholder while being
//    indexed - that is the failure mode this whole audit exists to prevent.
// --------------------------------------------------------------------------
for (const id of registryIds) {
  if (!rendererIds.includes(id)) {
    err("registry-drift", `"${id}" is marked live but ToolPageClient has no case for it`);
  }
  if (!declaredIds.includes(id)) {
    err("registry-drift", `"${id}" is marked live but is not declared in TOOLS`);
  }
}
for (const id of rendererIds) {
  if (!registryIds.includes(id)) {
    warn("registry-drift", `"${id}" has a component but is not in IMPLEMENTED_TOOL_IDS (it will be noindexed)`);
  }
}

// --------------------------------------------------------------------------
// 3. Titles: present, unique, not boilerplate-stacked, within length budget
// --------------------------------------------------------------------------
const titleBlock = siteSrc.slice(
  siteSrc.indexOf("const TOOL_SEO_TITLES"),
  siteSrc.indexOf("const TOOL_SEO_DESCRIPTIONS"),
);
const titles = [...titleBlock.matchAll(/"([a-z0-9-]+)":\s*"([^"]+)"/g)];
const titleById = new Map(titles.map(([, id, t]) => [id, t]));

const byTitle = new Map();
for (const [, id, title] of titles) {
  if (!declaredIds.includes(id)) {
    warn("orphan-title", `TOOL_SEO_TITLES has an entry for unknown tool "${id}"`);
  }
  // 60 chars for the title itself; the " | Yuitility" suffix is added at render
  if (title.length > 60) {
    warn("title-length", `"${id}" title is ${title.length} chars before the brand suffix: ${title}`);
  }
  if (/\|.*\|/.test(title)) {
    err("title-spam", `"${id}" stacks multiple pipe-separated phrases: ${title}`);
  }
  if (/\b(best|cheap|#1|top)\b/i.test(title)) {
    warn("title-spam", `"${id}" uses a superlative modifier: ${title}`);
  }
  const key = title.toLowerCase();
  if (byTitle.has(key)) {
    err("duplicate-title", `"${id}" and "${byTitle.get(key)}" share the title: ${title}`);
  }
  byTitle.set(key, id);
}

for (const id of registryIds) {
  if (!titleById.has(id)) {
    warn("missing-title", `live tool "${id}" has no entry in TOOL_SEO_TITLES (falls back to tool.title)`);
  }
}

// --------------------------------------------------------------------------
// 4. Meta descriptions: unique, and within the range Google will render
// --------------------------------------------------------------------------
const descBlock = siteSrc.slice(siteSrc.indexOf("const TOOL_SEO_DESCRIPTIONS"));
const descs = [...descBlock.matchAll(/"([a-z0-9-]+)":\s*\n?\s*"([^"]+)"/g)];
const byDesc = new Map();
for (const [, id, d] of descs) {
  if (d.length < 70) warn("description-length", `"${id}" description is only ${d.length} chars`);
  if (d.length > 190) warn("description-length", `"${id}" description is ${d.length} chars and will be truncated`);
  const key = d.toLowerCase();
  if (byDesc.has(key)) {
    err("duplicate-description", `"${id}" and "${byDesc.get(key)}" share a meta description`);
  }
  byDesc.set(key, id);
}
for (const id of registryIds) {
  if (!descs.some(([, did]) => did === id)) {
    warn("missing-description", `live tool "${id}" has no hand-written meta description`);
  }
}

// --------------------------------------------------------------------------
// 5. Fabricated structured data. Never ship ratings or reviews we do not have.
// --------------------------------------------------------------------------
const schemaFiles = [
  "src/app/tools/[slug]/page.tsx",
  "src/app/category/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/layout.tsx",
  "src/app/tools/page.tsx",
];
for (const f of schemaFiles) {
  const src = read(f);
  for (const banned of ["aggregateRating", "ratingValue", "reviewCount", '"@type": "Review"']) {
    // Allow the word inside a comment explaining why it is absent.
    const lines = src.split("\n").filter((l) => l.includes(banned) && !l.trim().startsWith("//"));
    if (lines.length) {
      err(
        "fabricated-schema",
        `${f} emits ${banned}. Yuitility collects no ratings, so this would be fabricated. See SEO_STANDARDS.md.`,
      );
    }
  }
}

// --------------------------------------------------------------------------
// 6. Placeholder verification tokens must never reach production HTML
// --------------------------------------------------------------------------
for (const bad of ["google-site-verification-code", "yandex-verification-code", "yahoo-verification-code"]) {
  if (layoutSrc.includes(bad) && !layoutSrc.split("\n").find((l) => l.includes(bad))?.trim().startsWith("//")) {
    err("placeholder-meta", `layout.tsx still emits the placeholder token "${bad}"`);
  }
}

// --------------------------------------------------------------------------
// 7. Meta keywords: no ranking value, and a reliable stuffing signal
// --------------------------------------------------------------------------
for (const f of [
  "src/app/layout.tsx",
  "src/app/tools/[slug]/page.tsx",
  "src/app/category/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/tools/page.tsx",
]) {
  // Only flag `keywords:` at the top level of a Next Metadata object (<= 4
  // spaces of indent). schema.org's `keywords` property, which sits deep inside
  // a JSON.stringify call, is legitimate and must not be flagged.
  if (/^ {0,4}keywords:/m.test(read(f))) {
    warn("meta-keywords", `${f} sets a keywords meta tag. Google ignores it; remove it.`);
  }
}

// --------------------------------------------------------------------------
// 8. Canonicals on every indexable route
// --------------------------------------------------------------------------
const routesNeedingCanonical = [
  "src/app/layout.tsx",
  "src/app/tools/page.tsx",
  "src/app/tools/[slug]/page.tsx",
  "src/app/category/[slug]/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/about/page.tsx",
];
for (const f of routesNeedingCanonical) {
  if (!read(f).includes("canonical")) err("missing-canonical", `${f} declares no canonical URL`);
}

// --------------------------------------------------------------------------
// 9. Sitemap must not advertise pages we do not want indexed
// --------------------------------------------------------------------------
if (!sitemapSrc.includes("LIVE_TOOLS")) {
  err("sitemap", "sitemap.ts does not source its tool URLs from LIVE_TOOLS - unimplemented tools may be listed");
}
if (!sitemapSrc.includes('absoluteUrl("/tools")')) {
  warn("sitemap", "/tools hub is missing from the sitemap");
}

// --------------------------------------------------------------------------
// 10. Orphan categories: every live category needs a footer link and metadata
// --------------------------------------------------------------------------
const footerSrc = read("src/components/ui/hover-footer.tsx");
for (const cat of categoryIds) {
  if (!siteSrc.includes(`  ${cat}: {`)) {
    err("category-meta", `category "${cat}" has no entry in CATEGORY_META (renders an empty description)`);
  }
  const hasLiveTool = registryIds.some((id) => {
    const entry = toolsBlock.slice(toolsBlock.indexOf(`id: "${id}"`));
    const catMatch = entry.match(/category: "([a-z]+)"/);
    return catMatch && catMatch[1] === cat;
  });
  if (hasLiveTool && !footerSrc.includes(`/category/${cat}`)) {
    err("orphan-category", `/category/${cat} has live tools but is not linked from the footer`);
  }
}

// --------------------------------------------------------------------------
// 11. Internal link targets must resolve
// --------------------------------------------------------------------------
const relatedBlock = registrySrc.slice(registrySrc.indexOf("export const RELATED_TOOLS"));
for (const [, target] of relatedBlock.matchAll(/"([a-z0-9-]+)"(?=[,\]])/g)) {
  if (!registryIds.includes(target)) {
    err("broken-internal-link", `RELATED_TOOLS points at "${target}", which is not a live tool`);
  }
}
for (const [, toolId] of blogsSrc.matchAll(/toolId: "([a-z0-9-]+)"/g)) {
  if (!declaredIds.includes(toolId)) {
    err("broken-internal-link", `blog post references toolId "${toolId}", which does not exist`);
  }
}

// --------------------------------------------------------------------------
// 12. Noindex must be deliberate
// --------------------------------------------------------------------------
if (!toolPageSrc.includes("index: false")) {
  err("indexation", "tool page no longer noindexes unimplemented tools");
}

// --------------------------------------------------------------------------
// Report
// --------------------------------------------------------------------------
const live = registryIds.length;
const planned = declaredIds.filter((id) => !registryIds.includes(id)).length;

console.log("SEO audit\n=========");
console.log(`Tools declared: ${declaredIds.length}  live: ${live}  planned (noindexed): ${planned}`);
console.log(`Categories: ${categoryIds.length}   Blog posts: ${[...blogsSrc.matchAll(/^\s{4}slug: "/gm)].length}`);
console.log("");

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length})`);
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log("");
}

if (errors.length) {
  console.log(`ERRORS (${errors.length})`);
  for (const e of errors) console.log(`  x ${e}`);
  console.log("\nSEO audit failed. See SEO_STANDARDS.md for the rule behind each check.");
  process.exit(1);
}

console.log("All SEO checks passed.");
