# Developer Guide: Adding a New Client-Side Tool

This guide explains how to add a new tool to Yuitility while complying with our architectural principles and automated SEO guardrails.

---

## Checklist Overview

To add a tool called `My Awesome Converter`:
- [ ] 1. Create client-side interactive component in `src/components/tools/MyAwesomeConverter.tsx`.
- [ ] 2. Register the tool ID in `src/types.ts`.
- [ ] 3. Map the component in `src/components/tools/ToolPageClient.tsx`.
- [ ] 4. Add tool metadata in `src/lib/site.ts`.
- [ ] 5. Add curated documentation, usage instructions, and FAQs in `src/lib/toolContent.ts`.
- [ ] 6. Run `npm run verify` to ensure all tests and SEO audits pass.

---

## Step 1: Create the Client Component

Create `src/components/tools/MyAwesomeConverter.tsx`:

```tsx
'use client';

import React, { useState } from 'react';

export default function MyAwesomeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    // 100% Client-Side calculation / transformation
    setOutput(input.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
          Input Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste input here..."
          className="w-full h-32 p-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleConvert}
          className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
        >
          Convert
        </button>
      </div>

      {output && (
        <div className="bg-zinc-100 dark:bg-zinc-800/60 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Output</h3>
          <pre className="text-sm font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## Step 2: Register in `src/types.ts`

Add your unique slug identifier to `ToolId` in `src/types.ts`:

```ts
export type ToolId =
  | 'json-formatter'
  | 'my-awesome-converter' // <-- Add here
  // ...
```

---

## Step 3: Map in `src/components/tools/ToolPageClient.tsx`

Import and add your component to the tool registry switch/map:

```tsx
import MyAwesomeConverter from './MyAwesomeConverter';

// In component registry:
'my-awesome-converter': <MyAwesomeConverter />,
```

---

## Step 4: Add Metadata in `src/lib/site.ts`

Define your tool's discovery and categorization:

```ts
{
  id: 'my-awesome-converter',
  name: 'My Awesome Converter',
  category: 'developer',
  description: 'Convert text instantly with 100% privacy in your browser.',
  icon: 'Wand2',
  isImplemented: true,
}
```

---

## Step 5: Add Curated Content & FAQs in `src/lib/toolContent.ts`

To pass search engine quality checks and our automated build audit (`scripts/seo-audit.mjs`), provide:
* **H1 Title**: Must be descriptive and concise.
* **SEO Meta Title**: Must be **60 characters or fewer**.
* **SEO Meta Description**: Must be between **70 and 190 characters**.
* **3–5 Technical FAQs**: Structured with `question` and `answer` to generate rich `FAQPage` schema.

---

## Step 6: Verify

Run:
```bash
npm run verify
```

If any metadata is missing or lengths violate SEO guardrails, the audit will print the exact issue and prevent bad builds from compiling.
