import { IndexNowProvider } from "./IndexNowProvider";
import { IndexingBatchQueue } from "./IndexingBatchQueue";
import { BatchIndexingResult, IndexingProvider, IndexingResult } from "./types";

/**
 * Service Manager orchestrating all active indexing providers.
 * Supports asynchronous, non-blocking broadcasts to IndexNow and future provider plugins.
 */
export class IndexingServiceManager {
  private static instance: IndexingServiceManager;
  private providers: IndexingProvider[] = [];

  private constructor() {
    // Register default providers
    this.registerProvider(new IndexNowProvider());
  }

  public static getInstance(): IndexingServiceManager {
    if (!IndexingServiceManager.instance) {
      IndexingServiceManager.instance = new IndexingServiceManager();
    }
    return IndexingServiceManager.instance;
  }

  /**
   * Registers a new IndexingProvider adapter.
   */
  public registerProvider(provider: IndexingProvider): void {
    const exists = this.providers.some((p) => p.name === provider.name);
    if (!exists) {
      this.providers.push(provider);
    }
  }

  /**
   * Returns all registered providers.
   */
  public getProviders(): IndexingProvider[] {
    return [...this.providers];
  }

  /**
   * Submits a single URL to all registered providers.
   */
  public async submitUrl(url: string): Promise<IndexingResult[]> {
    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return [];
    }

    const results = await Promise.all(
      this.providers.map((p) => p.submitUrl(url.trim()))
    );

    return results;
  }

  /**
   * Submits a batch of URLs (auto-deduplicated, auto-chunked <= 10,000) to all providers.
   */
  public async submitUrls(urls: string[]): Promise<BatchIndexingResult[]> {
    const deduplicated = IndexingBatchQueue.deduplicate(urls);
    if (deduplicated.length === 0) {
      return [];
    }

    const allBatchResults: BatchIndexingResult[] = [];

    for (const provider of this.providers) {
      const providerResults = await IndexingBatchQueue.processBatch(provider, deduplicated);
      allBatchResults.push(...providerResults);
    }

    return allBatchResults;
  }

  /**
   * Asynchronously notifies search engines of a content change without blocking execution.
   */
  public notifyContentChangeAsync(urls: string | string[], _eventType?: string): void {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    // Fire and forget
    setImmediate(async () => {
      try {
        await this.submitUrls(urlArray);
      } catch (err) {
        console.error("[IndexingServiceManager] Error in async content change notification:", err);
      }
    });
  }
}
