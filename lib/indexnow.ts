import { submitUrl as submitUrlCore, submitUrls as submitUrlsCore } from "../src/lib/indexnow";
import { BatchIndexingResult, IndexingResult } from "../src/lib/indexnow/types";

/**
 * Submits a single URL to IndexNow.
 *
 * @param url The full URL string to submit (e.g. 'https://www.yuitility.app/tools/bmi-calculator')
 */
export async function submitUrl(url: string): Promise<IndexingResult[]> {
  return submitUrlCore(url);
}

/**
 * Submits a batch of URLs to IndexNow (automatically deduplicated & chunked to 10,000 max).
 *
 * @param urls Array of URL strings to submit
 */
export async function submitUrls(urls: string[]): Promise<BatchIndexingResult[]> {
  return submitUrlsCore(urls);
}

export * from "../src/lib/indexnow";
