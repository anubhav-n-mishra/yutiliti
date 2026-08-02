# IndexNow Protocol Integration Guide

Production-grade integration of the official **IndexNow Protocol** for Yuitility. IndexNow instantly notifies participating search engines (Bing, Yandex, Seznam, Naver, etc.) whenever web pages or tools are created, updated, or deleted.

---

## 1. Architecture Overview

The system is built on an extensible **Provider/Adapter Pattern** to support future indexing APIs (e.g. Google Indexing API, Bing Webmaster API) without modifying business logic.

```
┌──────────────────────────────────────────────────────────┐
│                   Yuitility Application                  │
│     (Tool Change / Sitemap Sync / Content Webhooks)      │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│               IndexingServiceManager                     │
│    - Non-blocking async broadcasts                       │
│    - Provider registry                                   │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                IndexingBatchQueue                        │
│    - URL Deduplication (Set<string>)                     │
│    - Batch Chunking (max 10,000 URLs / request)          │
└────────────────────────────┬─────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│   IndexNowProvider    │         │  FutureGoogleProvider │
│ (https://api.indexnow)│         │     (Placeholder)     │
└───────────────────────┘         └───────────────────────┘
```

### Core Components
- **`lib/indexnow.ts`**: Top-level API entrypoint exposing `submitUrl(url)` and `submitUrls(urls)`.
- **`src/lib/indexnow/IndexNowProvider.ts`**: Implements the IndexNow POST protocol, status code parsing, and exponential backoff retry loop.
- **`src/lib/indexnow/IndexingBatchQueue.ts`**: Handles deduplication and chunks large url submissions into 10,000-item payloads.
- **`src/lib/indexnow/IndexingServiceManager.ts`**: Singleton coordinator managing registered indexing adapters.
- **`src/lib/indexnow/logger.ts`**: Structured logger logging timestamps, status codes, and retry counts without leaking secrets.

---

## 2. Environment Variables & Setup

Add the following environment variables to your `.env.local` or deployment platform (Vercel/Netlify):

```env
# IndexNow Secret API Key (32-character hex)
INDEXNOW_KEY=9f3cfc08d1a3442f84c9387d825e44b5

# Canonical Website URL
SITE_URL=https://www.yuitility.app
```

### Verification File Setup
IndexNow requires an HTTP verification key text file hosted on your domain.

1. **Static Verification File**: Hosted at `/public/9f3cfc08d1a3442f84c9387d825e44b5.txt` containing `9f3cfc08d1a3442f84c9387d825e44b5`.
2. **Dynamic Route Fallback**: Route handler `src/app/[key].txt/route.ts` dynamically serves text for any key set in `INDEXNOW_KEY`.

Verification URL format:
`https://www.yuitility.app/9f3cfc08d1a3442f84c9387d825e44b5.txt`

---

## 3. Usage & Integration

### Programmatic Submissions

```typescript
import { submitUrl, submitUrls, notifyContentChange } from '@/lib/indexnow';

// 1. Submit a single URL
await submitUrl('https://www.yuitility.app/tools/bmi-calculator');

// 2. Submit a batch of URLs
await submitUrls([
  'https://www.yuitility.app/tools/bmi-calculator',
  'https://www.yuitility.app/tools/emi-calculator',
]);

// 3. Fire-and-forget background notification (non-blocking)
notifyContentChange('https://www.yuitility.app/tools/new-tool', 'created');
```

---

## 4. Manual CLI Sync Command

To scan your sitemap and submit all active pages in batches of up to 10,000 URLs:

```bash
# Using npm script
npm run indexnow:sync

# Or direct execution using tsx
npx tsx scripts/indexnow-sync.ts
```

### Output Example
```text
=================================================
       YUITILITY INDEXNOW CLI SYNC UTILITY       
=================================================

[Config] Site Host    : www.yuitility.app
[Config] Target URL   : https://www.yuitility.app
[Config] Key Location : https://www.yuitility.app/9f3cfc08d1a3442f84c9387d825e44b5.txt
[Config] Batch Limit  : 10000 URLs/request

[Sitemap] Extracted 58 raw URLs -> 58 unique deduplicated URLs.
[Queue] Prepared 1 batch payload(s) for submission.

[Batch 1/1] Submitting 58 URL(s)...
  -> Provider  : IndexNow
  -> Status    : SUCCESS
  -> Submitted : 58 | Succeeded: 58 | Failed: 0

=================================================
               FINAL SYNC SUMMARY               
=================================================
Total URLs Discovered  : 58
Total URLs Submitted   : 58
Successfully IndexNow'd : 58
Failed Submissions     : 0
=================================================
```

---

## 5. HTTP Status Code Handling & Troubleshooting

| Status Code | Meaning | Action Taken |
| :--- | :--- | :--- |
| **200** | OK | URL submission processed successfully. |
| **202** | Accepted | Payload accepted; key file verification pending. |
| **400** | Bad Request | Invalid JSON format or URL syntax. Check payload. |
| **403** | Forbidden | Key invalid or verification `.txt` file inaccessible. |
| **422** | Unprocessable | Host mismatch (URL domain does not match `host`). |
| **429** | Too Many Requests | Rate limited. Automatically retried with exponential backoff. |
| **500** | Internal Error | Server issue. Automatically retried with exponential backoff. |

---

## 6. Testing

To run the unit test suite covering payload validation, deduplication, 10k batching, and retry logic:

```bash
npx tsx scripts/indexnow.test.ts
```
