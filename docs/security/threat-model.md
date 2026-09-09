# Yuitility Security Threat Model and Trust Boundaries

This document details the security architecture, threat model, trust boundaries, and mitigations implemented across **Yuitility**.

---

## Assets and Security Objectives

1. **User Data Confidentiality**: Users often process sensitive material (e.g. tax documents, financial disclosures, personal photographs, API keys, passwords). **Confidentiality objective: Zero leakage to network or storage.**
2. **Execution Integrity**: Calculations (e.g. home loan amortization, income tax projections, scientific evaluations) must yield mathematically precise, untampered outputs.
3. **Client Sandbox Isolation**: Prevent malicious files (such as crafted SVGs, PDFs, or Markdown documents) from executing arbitrary JavaScript within the user's browser context.

---

## Trust Boundaries and Attack Surfaces

### 1. In-Browser File Intake
* **Threat**: A user uploads a malicious PDF, image, or text file designed to exploit buffer overflows or parser vulnerabilities.
* **Mitigations**:
  * All file readers use modern browser standard `FileReader` APIs returning strict typed arrays (`ArrayBuffer`, `Uint8Array`).
  * Parsing engines run within the standard Web browser JavaScript sandbox without native desktop execution privileges.
  * No files are ever written to the local filesystem or submitted over the network.

### 2. User Input Rendering (Cross-Site Scripting / XSS)
* **Threat**: Malicious input in Markdown viewers, HTML visualizers, or URL parameter presets containing `<script>` or event handlers (`onload=`, `onerror=`).
* **Mitigations**:
  * Strict entity encoding (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#039;`) is applied before inserting user text into preview DOM elements.
  * URL schemes in hyperlinks and image sources are restricted to safe protocols (`http:`, `https:`, `mailto:`, `data:`). `javascript:` pseudo-protocols are strictly rejected.
  * React JSX handles automatic context-aware escaping for standard component attributes.

### 3. Network and Content Security Policy (CSP) Headers
* **Threat**: Clickjacking, MIME confusion, or cross-origin leakage.
* **Mitigations** configured in `next.config.ts`:
  * `X-Content-Type-Options: nosniff` — Enforces strict MIME type checking.
  * `X-Frame-Options: SAMEORIGIN` — Restricts framing (embed routes `/embed/*` are explicitly scoped for authorized embedding).
  * `Referrer-Policy: strict-origin-when-cross-origin` — Protects referral leakage.
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()` — Completely disables access to hardware sensors.
  * `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` — Enforces HTTPS throughout.

### 4. Dependency Supply-Chain
* **Threat**: Vulnerabilities or malicious code injected through third-party npm packages.
* **Mitigations**:
  * Dependabot scans dependencies weekly and flags outdated packages.
  * GitHub CodeQL static analysis executes automated semantic scanning across every pull request.
  * Strict lockfile (`package-lock.json`) ensures deterministic, reproducible builds.
  * Dependency footprint is kept intentionally minimal.

---

## Explicit Out-of-Scope Risks

Because Yuitility has **no user accounts, no databases, and no server-side ingestion endpoints**:
* SQL Injection on the backend is impossible (no database exists).
* Credential stuffing, session hijacking, or cookie theft are not applicable (no sessions or auth cookies exist).
* Server-Side Request Forgery (SSRF) is eliminated for all client tools.
