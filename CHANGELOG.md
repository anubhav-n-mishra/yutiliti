# Changelog

All notable changes to **Yuitility** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Comprehensive open-source governance documents (`CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`).
- Fast deterministic syntax, security, and quality linter (`scripts/lint.mjs`).
- Strict TypeScript verification (`npm run typecheck`) and standardized quality gates (`npm run verify`).
- GitHub Actions CodeQL static application security testing workflow (`.github/workflows/codeql.yml`).
- Automated Dependabot dependency update configuration (`.github/dependabot.yml`).
- Structured GitHub issue templates for bug reports, tool requests, and PR guidelines.
- Architecture blueprint (`docs/architecture.md`) and security threat model (`docs/security/threat-model.md`).

### Fixed
- Resolved out-of-scope `escapeHtml` reference in `src/components/tools/MarkdownViewer.tsx`.
- Corrected invalid `FAQItem` import path in `src/lib/toolPresets.ts`.
- Removed broken unauthenticated email dispatch action from CI workflow.
- Enabled strict TypeScript build verification in `next.config.ts`.

---

## [1.0.0] - 2026-09-07

### Added
- Suite of 132+ client-side utility tools spanning PDF manipulation, media processing, finance, math, and developer utilities.
- 100% in-browser offline processing engine with zero server data storage.
- Programmatic presets for mortgage amortization, retirement forecasting, and educational conversions (Anna University, VTU, Mumbai University, KTU).
- Embeddable responsive widget routes (`/embed/[slug]`) for documentation and third-party embedding.
- Automated IndexNow instant search engine synchronization protocol.
- Static SEO auditing guardrail (`scripts/seo-audit.mjs`) ensuring perfect metadata and schema compliance.
- High-performance PageSpeed optimizations achieving 100 mobile/desktop benchmark score.
