# Contributing to Yuitility

Thank you for your interest in contributing to **Yuitility**! We welcome bug fixes, documentation improvements, performance optimizations, and new client-side tools from the developer community.

---

## 🏛️ Core Architectural Invariants

Before writing code, please understand the non-negotiable architectural principles of Yuitility:

1. **100% Client-Side Execution**: All processing (PDF manipulations, image conversions, calculations, cryptography, parsing) **must** run entirely inside the user's browser.
2. **Zero Server Uploads**: No user data, files, or sensitive information may ever be transmitted to external servers or backend endpoints.
3. **No Unsolicited Telemetry**: Tools must not track user inputs, keystrokes, or document contents.
4. **Offline Capability**: Whenever possible, tools should function offline via the Progressive Web App (PWA) cache.
5. **SEO & Indexation Hygiene**: Every tool route must have complete metadata, FAQ schema, and pass `npm run seo:audit`.

---

## 🛠️ Development Setup

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (LTS recommended).
* **npm**: `v10.x` or higher.
* **Git**: `v2.30+`.

### Step-by-Step Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/yutiliti.git
   cd yutiliti
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *(Note: Local development runs smoothly with default fallback values; no external API keys are required for core tools.)*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

---

## 🧪 Local Quality Gates

Every pull request must pass all automated verification checks. Before committing your code, run:

```bash
# 1. Typecheck (Must pass with 0 errors)
npm run typecheck

# 2. Syntax & Security Lint
npm run lint

# 3. Unit Tests & SEO Guardrail Audit
npm test

# 4. Production Build Verification
npm run build
```

Or run all gates in a single command:
```bash
npm run verify
```

---

## 🌿 Branching & Commit Conventions

### Branch Naming
Use clear, descriptive branch names prefixed by category:
* `feat/new-tool-name`
* `fix/calculator-rounding-edge-case`
* `perf/canvas-batch-render`
* `docs/architecture-update`

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat(tool): add CSV to Markdown table converter`
* `fix(pdf): handle corrupted trailer in PDF split`
* `perf(image): batch canvas rasterization calls`
* `docs(readme): clarify client-side privacy architecture`

---

## ➕ Adding a New Tool

To add a new tool to Yuitility:
1. Review the detailed tutorial in [docs/contributing/adding-a-tool.md](docs/contributing/adding-a-tool.md).
2. Create your interactive client component in `src/components/tools/YourTool.tsx`.
3. Register the tool ID, category, and metadata in `src/types.ts` and `src/lib/site.ts`.
4. Run `npm run seo:audit` to verify that all required metadata, H1s, and schema markup are valid.

---

## 📬 Submitting a Pull Request (PR)

1. Ensure your branch is rebased onto the latest `master` branch.
2. Verify all checks pass via `npm run verify`.
3. Push your branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request against `master` on `anubhav-n-mishra/yutiliti`.
5. Fill out the provided Pull Request template detailing what was changed and how you tested it.

---

## ⚖️ Contributor Terms

By submitting a Pull Request, you agree that your contribution is provided under the terms of the project's [LICENSE](LICENSE).
