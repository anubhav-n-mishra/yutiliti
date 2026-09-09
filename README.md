<div align="center">

# Yuitility

**132+ lightning-fast, client-side web utilities engineered for zero latency and absolute privacy.**  
*Everything runs 100% locally in your browser. No server uploads. No telemetry. No sign-ups.*

[![Yuitility CI](https://github.com/anubhav-n-mishra/yutiliti/actions/workflows/ci.yml/badge.svg)](https://github.com/anubhav-n-mishra/yutiliti/actions/workflows/ci.yml)
[![CodeQL](https://github.com/anubhav-n-mishra/yutiliti/actions/workflows/codeql.yml/badge.svg)](https://github.com/anubhav-n-mishra/yutiliti/actions/workflows/codeql.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Source--Available-amber.svg)](LICENSE)
[![Live Site](https://img.shields.io/badge/Production-yuitility.app-emerald?logo=google-chrome)](https://www.yuitility.app)

[**Explore Live Tools**](https://www.yuitility.app/tools) • [**Architecture**](docs/architecture.md) • [**Threat Model**](docs/security/threat-model.md) • [**Contributing**](CONTRIBUTING.md) • [**Changelog**](CHANGELOG.md)

</div>

---

## Why Yuitility?

Most web calculators, image converters, and PDF tools suffer from two major flaws:
1. **Privacy Exposure**: They force you to upload sensitive files (tax forms, salary slips, private contracts, client images) to unknown cloud servers just to merge a page or resize a photo.
2. **Friction and Bloat**: They clutter the screen with aggressive ads, paywalls, slow round-trips, and artificial rate limits.

**Yuitility solves this fundamentally through browser engineering.**  
By leveraging modern Web standards (HTML5 Canvas, Web Workers, WebAssembly, Web Crypto, and in-memory streams), all operations execute **entirely inside your browser thread**. When you manipulate a 50MB PDF or compute an amortization schedule, **not a single byte of your data ever leaves your computer.**

---

## Features and Capabilities

* **Zero Data Ingestion**: True client-side execution. Files exist strictly in volatile browser RAM and are purged when the tab is closed.
* **Zero Network Latency**: Instant transformations and calculations with zero server round-trips.
* **132+ Interactive Tools**:
  * **Developer Utilities**: JSON Formatter & Validator, Base64 En/Decoder, JWT Inspector, Regex Tester, Hash Generator, QR Code Engine, Fake Data Generator.
  * **PDF Suite**: Merge, Split, Compress, Rotate, Watermark, Image to PDF, Metadata Editor (powered by in-memory `pdf-lib`).
  * **Media & Image Tools**: In-browser AI Background Remover, Image Compressor, Resizer, Format Converter (PNG/JPEG/WebP), Meme Maker, Photo Collage Grid.
  * **Financial Engines**: Home Loan EMI with Prepayment & Tax Savings, SIP Compound Forecaster with Step-Up inflation models, Salary / Take-Home Estimator.
  * **Academic Conversions**: University-specific CGPA-to-Percentage engines calibrated to official circulars (Anna University, VTU, Mumbai University, KTU, CBSE, AICTE).
  * **Math, Lifestyle & Converters**: Scientific Calculator, Unit Converter, Unix Timestamp Engine, Time Zone Calculator, BMI / Body Metric Analyzers.
* **PWA and Offline Ready**: Service worker caching allows tools to work offline on planes, trains, and unstable connections.
* **Embeddable Widgets**: Distraction-free, responsive iframe widgets (`/embed/[slug]`) for documentation and developer blogs.

---

## Architecture and Tech Stack

```
User Input ──> In-Memory File Buffer ──> WebAssembly / Web Workers ──> Instant DOM / Canvas / Blob Output
                                              │
                                     (Zero Server Hops)
```

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Full Static Site Generation (SSG).
* **Language**: [TypeScript 5.8](https://www.typescriptlang.org/) configured with strict type-safety.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with high-contrast Dark Mode support.
* **Core Libraries**: `pdf-lib`, `@imgly/background-removal`, `framer-motion`, `lucide-react`.
* **CI/CD & Security**: GitHub Actions (Node 20 & 22 matrix), GitHub CodeQL SAST, Dependabot.
* **SEO & Guardrails**: Custom static AST validation (`scripts/seo-audit.mjs`) ensuring 100% compliant schema, metadata, and zero broken links across 350+ generated pages.

For full architectural blueprints, see [docs/architecture.md](docs/architecture.md).

---

## Quick Start and Local Development

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (LTS recommended)
* **npm**: `v10.x` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anubhav-n-mishra/yutiliti.git
   cd yutiliti
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:3000](http://localhost:3000).

---

## Quality Gates and NPM Scripts

All code must pass strict verification gates prior to merge:

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the local Turbopack development server on port 3000. |
| `npm run typecheck` | Strict TypeScript compilation check via `tsc --noEmit`. |
| `npm run lint` | Fast static syntax, security marker, emoji prohibition, and path leakage linter. |
| `npm test` | Runs unit tests (batching, deduplication) and static SEO audits. |
| `npm run build` | Compiles optimized production bundle across all 350+ static routes. |
| `npm run verify` | Runs all gates in sequence: `typecheck` $\rightarrow$ `lint` $\rightarrow$ `test` $\rightarrow$ `build`. |
| `npm run seo:audit` | Enforces SEO title lengths, description bounds, and FAQ schema. |

---

## Security and Privacy

We treat user security as a primary invariant. Please refer to our [Security Policy (SECURITY.md)](SECURITY.md) and [Security Threat Model](docs/security/threat-model.md) for details on our trust boundaries and responsible vulnerability disclosure process.

---

## Contributing

We welcome community contributions, bug fixes, UI improvements, and new client-side tools!

1. Please read our [Contribution Guidelines (CONTRIBUTING.md)](CONTRIBUTING.md) and [Code of Conduct (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md).
2. Follow our tutorial on [Adding a New Tool](docs/contributing/adding-a-tool.md).
3. Ensure `npm run verify` passes with zero errors before opening a Pull Request.

---

## License and Terms

This repository is **Source-Available** under the [Yuitility License](LICENSE).
* **You are welcome to**: View, clone, study, fork, and test this software locally, and submit Pull Requests or bug reports back to this repository.
* **You may NOT**: Deploy, host, distribute, or operate public or commercial replicas or competing services using this code or its assets.

Copyright (c) 2026 Anubhav Mishra. All rights reserved.
