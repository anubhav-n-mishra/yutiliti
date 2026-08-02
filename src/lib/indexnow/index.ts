import { IndexingServiceManager } from "./IndexingServiceManager";
import { BatchIndexingResult, IndexingResult } from "./types";

export * from "./types";
export * from "./config";
export * from "./logger";
export * from "./IndexNowProvider";
export * from "./IndexingBatchQueue";
export * from "./IndexingServiceManager";

/**
 * Submits a single URL to IndexNow and registered search engine providers.
 */
export async function submitUrl(url: string): Promise<IndexingResult[]> {
  return IndexingServiceManager.getInstance().submitUrl(url);
}

/**
 * Submits a batch of URLs to IndexNow and registered search engine providers.
 * Automatically deduplicates and chunks inputs into batches of up to 10,000 URLs.
 */
export async function submitUrls(urls: string[]): Promise<BatchIndexingResult[]> {
  return IndexingServiceManager.getInstance().submitUrls(urls);
}

/**
 * Automatically triggers background asynchronous submission of created, updated, or deleted URLs.
 * Non-blocking execution for zero latency impact.
 */
export function notifyContentChange(urls: string | string[], eventType?: string): void {
  IndexingServiceManager.getInstance().notifyContentChangeAsync(urls, eventType);
}
