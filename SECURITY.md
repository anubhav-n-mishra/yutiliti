# Security Policy

## Supported Versions

Only the latest release on the primary branch is officially supported with security updates and bug fixes:

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |
| < 1.0   | No        |

---

## Security Architecture and Privacy Invariants

Yuitility is fundamentally engineered with a **zero-trust, zero-server-upload** philosophy:
* **Client-Side Boundary**: File processing (PDF manipulation, image resizing, document viewing, data conversions) takes place inside the browser thread using native Web APIs, Web Workers, and WebAssembly.
* **No Server Storage**: Documents and user inputs are held temporarily in volatile browser memory and are discarded when the tab is closed.
* **Cross-Site Scripting (XSS) Prevention**: Tools that render user-supplied HTML or Markdown (such as the Markdown Previewer or HTML to Markdown converters) implement strict HTML entity encoding and DOM sanitization to block script injection.

---

## Reporting a Vulnerability

We take the security and privacy of our users seriously. If you believe you have discovered a security vulnerability or privacy leak in Yuitility, please report it responsibly.

### How to Report
1. **GitHub Security Advisory (Preferred)**:
   Please open a private report via [GitHub Security Advisories](https://github.com/anubhav-n-mishra/yuitility/security/advisories/new).
2. **Alternative Method**:
   If private advisories are unavailable, contact the repository maintainer through the contact information listed on GitHub.

### What to Include
Please provide sufficient detail to help us understand and reproduce the issue:
* A clear description of the vulnerability and its potential impact.
* The specific tool or URL path affected (e.g., `/tools/markdown-viewer`).
* Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
* Any browser or OS specifics (e.g., Chrome 128 on macOS).

### What NOT to Do
* **Do NOT open a public GitHub issue** for undisclosed security vulnerabilities.
* Do NOT attempt to access or compromise other users' data.

---

## Response Protocol

* **Acknowledgment**: We strive to acknowledge vulnerability reports within **48 hours**.
* **Assessment**: We will investigate and confirm the severity and scope of the report.
* **Resolution and Disclosure**: We will prepare and deploy a patch to `master`. Once deployed, we will coordinate public disclosure with appropriate credit to the reporter.
