# Yuitility Architecture & System Design

Yuitility is engineered from the ground up as a **100% client-side, privacy-first web utility platform**. This document describes its technical architecture, runtime model, build pipeline, and design constraints.

---

## 🏛️ High-Level System Architecture

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                       Next.js App Router (SSG)                    |  |
|  |   - /tools/[slug]         (Full Interactive Tool Suite)          |  |
|  |   - /tools/[slug]/[preset] (Deep-linked Presets & Scenario Engine) |  |
|  |   - /embed/[slug]         (Lightweight Iframe Embeds)             |  |
|  +-------------------------------------------------------------------+  |
|                                     |                                   |
|                                     v                                   |
|  +-------------------------------------------------------------------+  |
|  |                     Client-Side Execution Engine                  |  |
|  |  +---------------------+  +-----------------+  +---------------+  |  |
|  |  | PDF-Lib (In-Memory) |  | Canvas2D / WASM |  | Web Crypto API|  |  |
|  |  | (Merge, Split, Opt) |  | (Image/Media)   |  | (Keys, Pass)  |  |  |
|  |  +---------------------+  +-----------------+  +---------------+  |  |
|  +-------------------------------------------------------------------+  |
|                                     |                                   |
|                                     x (NO DATA OUTBOUND)                |
+-------------------------------------------------------------------------+
                                      |
                           Static Content Delivery
                                      v
+-------------------------------------------------------------------------+
|                  EDGE HOSTING & CDN (Cloudflare / Vercel)               |
|  - Pre-rendered Static HTML, CSS, JS Chunks                             |
|  - Zero User-Data Storage or Backend Ingestion Endpoints                |
+-------------------------------------------------------------------------+
```

---

## 🔑 Core Architectural Pillars

### 1. Zero-Server Ingestion (True Client-Side Execution)
Unlike traditional web utilities that upload user files to cloud storage or server-side microservices, Yuitility processes **everything locally**:
* **PDF Operations**: Uses [`pdf-lib`](https://pdf-lib.js.org/) to parse, manipulate, and compile PDF byte arrays directly within browser memory.
* **Image Processing**: Utilizes HTML5 Canvas, the OffscreenCanvas API, and client-side WebAssembly models (`@imgly/background-removal`).
* **Calculators & Converters**: Run mathematical algorithms synchronously with zero network hops.
* **Temporary Memory**: Input files are held exclusively in volatile RAM (`ArrayBuffer` / `Uint8Array`) and are garbage-collected as soon as the tab or view is reset.

### 2. Next.js App Router & Full Static Generation (SSG)
All 350+ routes across the application are statically generated at build time:
* **Tool Routes (`/tools/[slug]`)**: 132+ live utility routes pre-rendered with complete semantic HTML, accessibility attributes, and schema markup.
* **Programmatic Presets (`/tools/[slug]/[preset]`)**: 36+ deep-linked scenario calculators (e.g. VTU, Anna University, Mumbai University CGPA conversion formulas, mortgage prepayment models).
* **Embed Routes (`/embed/[slug]`)**: Minimalist, distraction-free views designed for iframe embedding into external documentation and blogs without ads or external tracking.

### 3. Static SEO & Guardrails Engine
To maintain high search quality and prevent phantom or broken URLs from indexing:
* `scripts/seo-audit.mjs` runs as a mandatory `prebuild` hook.
* It verifies that every tool declared in `src/types.ts` is backed by a fully functional component in `ToolPageClient.tsx`.
* It verifies that all meta titles remain under 60 characters, descriptions between 70–190 characters, and that structured schema (`FAQPage`, `SoftwareApplication`) is syntactically sound.

---

## 📦 Directory Structure

```
yutiliti/
├── .github/                 # Workflows (CI, CodeQL, Dependabot) and issue templates
├── docs/                    # Architecture, security, and contribution guides
├── public/                  # Static brand assets, fonts, PWA manifest, and icons
├── scripts/                 # Build-time audit, verification, and IndexNow sync tools
│   ├── lint.mjs             # Fast repository syntax and safety linter
│   ├── seo-audit.mjs        # Static SEO guardrail verification engine
│   ├── indexnow-sync.ts     # Instant search engine submission protocol
│   └── indexnow.test.ts     # Unit tests for queue chunking and deduplication
├── src/
│   ├── app/                 # Next.js App Router pages and route handlers
│   ├── components/
│   │   ├── layout/          # Navigation, Header, Footer, Breadcrumbs
│   │   ├── tools/           # 132+ Interactive Client-Side Tool Components
│   │   └── ui/              # Reusable design system primitives
│   ├── lib/
│   │   ├── site.ts          # Central site configuration and category metadata
│   │   ├── toolContent.ts   # Curated guides, descriptions, and FAQs per tool
│   │   ├── toolPresets.ts   # Official circular-backed conversion presets
│   │   └── indexnow.ts      # IndexNow client implementation
│   └── types.ts             # Domain models, Tool registry, and Category types
├── next.config.ts           # Next.js configuration with security headers
├── package.json             # Scripts, metadata, and dependencies
└── tsconfig.json            # TypeScript configuration
```

---

## ⚡ Performance Optimization

* **Strict Code Splitting**: Heavy client libraries (e.g. `three.js`, `@imgly/background-removal`, `pdf-lib`) are dynamically imported only when the user opens the specific tool requiring them.
* **Canvas Batching**: Image rendering and collage generators batch draw operations to prevent frame drops.
* **Font Optimization**: Fonts are self-hosted in `public/fonts` with `font-display: swap` to eliminate render-blocking stylesheet latency.
