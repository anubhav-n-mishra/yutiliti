import { BatchIndexingResult, IndexingProvider } from "./types";

/**
 * Manages URL deduplication and chunks large url submissions into batches of up to 10,000 URLs.
 */
export class IndexingBatchQueue {
  private static readonly MAX_BATCH_SIZE = 10000;

  /**
   * Cleans and deduplicates a list of URLs.
   */
  public static deduplicate(urls: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const url of urls) {
      if (!url || typeof url !== "string") continue;
      const trimmed = url.trim();
      if (trimmed.length > 0 && !seen.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      }
    }

    return result;
  }

  /**
   * Splits an array of URLs into chunks of specified maximum size (default 10,000).
   */
  public static chunk<T>(items: T[], chunkSize: number = this.MAX_BATCH_SIZE): T[][] {
    if (chunkSize <= 0) chunkSize = this.MAX_BATCH_SIZE;
    const chunks: T[][] = [];

    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    return chunks;
  }

  /**
   * Processes a bulk list of URLs using the given provider in batches of up to 10,000.
   */
  public static async processBatch(
    provider: IndexingProvider,
    urls: string[]
  ): Promise<BatchIndexingResult[]> {
    const deduplicated = this.deduplicate(urls);
    const chunks = this.chunk(deduplicated, this.MAX_BATCH_SIZE);
    const batchResults: BatchIndexingResult[] = [];

    for (const chunk of chunks) {
      const res = await provider.submitUrls(chunk);
      batchResults.push(res);
    }

    return batchResults;
  }
}
