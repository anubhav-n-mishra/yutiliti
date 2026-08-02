/**
 * Production-Grade Indexing & IndexNow Protocol Type Definitions
 */

export type IndexNowResponseCode = 200 | 202 | 400 | 403 | 422 | 429 | 500 | number;

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexingResult {
  providerName: string;
  url: string;
  success: boolean;
  statusCode: IndexNowResponseCode;
  retryCount: number;
  message: string;
  timestamp: string;
}

export interface BatchIndexingResult {
  providerName: string;
  submittedCount: number;
  successCount: number;
  failureCount: number;
  results: IndexingResult[];
  timestamp: string;
}

export interface IndexingProvider {
  /** Provider identifier (e.g., 'IndexNow', 'GoogleIndexing') */
  readonly name: string;
  
  /** Submit a single URL for indexing */
  submitUrl(url: string): Promise<IndexingResult>;
  
  /** Submit a batch of URLs for indexing */
  submitUrls(urls: string[]): Promise<BatchIndexingResult>;
}

export interface IndexingLogEntry {
  timestamp: string;
  provider: string;
  submittedUrlCount: number;
  urls: string[];
  responseCode: IndexNowResponseCode;
  retryCount: number;
  success: boolean;
  message: string;
  failureReason?: string;
}

export interface IndexingConfig {
  apiKey: string;
  siteUrl: string;
  host: string;
  keyLocation: string;
  endpoint: string;
  maxRetries: number;
  initialRetryDelayMs: number;
  maxBatchSize: number;
}
