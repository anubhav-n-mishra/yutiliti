import { getIndexingConfig } from "./config";
import { IndexingLogger } from "./logger";
import {
  BatchIndexingResult,
  IndexingConfig,
  IndexingProvider,
  IndexingResult,
  IndexNowPayload,
  IndexNowResponseCode,
} from "./types";

/**
 * Official IndexNow API Provider implementation.
 * Handles payload formatting, HTTP status codes, exponential backoff retries, and error resilience.
 */
export class IndexNowProvider implements IndexingProvider {
  public readonly name = "IndexNow";
  private config: IndexingConfig;

  constructor(customConfig?: Partial<IndexingConfig>) {
    this.config = { ...getIndexingConfig(), ...customConfig };
  }

  /**
   * Helper method to map HTTP status codes to human-readable explanations.
   */
  private getStatusMessage(statusCode: IndexNowResponseCode): string {
    switch (statusCode) {
      case 200:
        return "OK - URL(s) submitted successfully.";
      case 202:
        return "Accepted - URL(s) received, key location validation pending.";
      case 400:
        return "Bad Request - Invalid payload format or URL syntax.";
      case 403:
        return "Forbidden - Invalid key or key file not accessible at keyLocation.";
      case 422:
        return "Unprocessable Entity - Host mismatch or invalid URLs for domain.";
      case 429:
        return "Too Many Requests - Rate limited by IndexNow API.";
      case 500:
        return "Internal Server Error - IndexNow server processing failure.";
      default:
        return `Unexpected HTTP response status ${statusCode}.`;
    }
  }

  /**
   * Calculates exponential backoff delay with full random jitter.
   */
  private getBackoffDelayMs(attempt: number): number {
    const base = this.config.initialRetryDelayMs;
    const exponential = base * Math.pow(2, attempt);
    const maxDelay = 10000;
    const bounded = Math.min(maxDelay, exponential);
    // Full jitter
    return Math.floor(Math.random() * bounded);
  }

  /**
   * Submits a single URL to the IndexNow API.
   */
  public async submitUrl(url: string): Promise<IndexingResult> {
    const batchResult = await this.submitUrls([url]);
    return (
      batchResult.results[0] || {
        providerName: this.name,
        url,
        success: false,
        statusCode: 500,
        retryCount: 0,
        message: "No response generated",
        timestamp: new Date().toISOString(),
      }
    );
  }

  /**
   * Submits a list of URLs to the IndexNow API with automatic batching and retry logic.
   */
  public async submitUrls(urls: string[]): Promise<BatchIndexingResult> {
    const timestamp = new Date().toISOString();
    const validUrls = urls
      .filter((u) => typeof u === "string" && u.trim().length > 0)
      .map((u) => u.trim());

    if (validUrls.length === 0) {
      return {
        providerName: this.name,
        submittedCount: 0,
        successCount: 0,
        failureCount: 0,
        results: [],
        timestamp,
      };
    }

    const payload: IndexNowPayload = {
      host: this.config.host,
      key: this.config.apiKey,
      keyLocation: this.config.keyLocation,
      urlList: validUrls,
    };

    let attempt = 0;
    let statusCode: IndexNowResponseCode = 500;
    let success = false;
    let failureReason = "";

    while (attempt <= this.config.maxRetries) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Yuitility-IndexNow/1.0",
          },
          body: JSON.stringify(payload),
        });

        statusCode = response.status;
        success = response.status === 200 || response.status === 202;

        if (success) {
          break;
        }

        failureReason = this.getStatusMessage(statusCode);

        // Retry on 429 (rate limit) or 5xx (server error)
        const isRetryable = statusCode === 429 || statusCode >= 500;
        if (!isRetryable || attempt >= this.config.maxRetries) {
          break;
        }
      } catch (err: unknown) {
        statusCode = 500;
        failureReason = err instanceof Error ? err.message : String(err);
        if (attempt >= this.config.maxRetries) {
          break;
        }
      }

      attempt++;
      const delay = this.getBackoffDelayMs(attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const statusMsg = this.getStatusMessage(statusCode);

    IndexingLogger.log({
      timestamp,
      provider: this.name,
      submittedUrlCount: validUrls.length,
      urls: validUrls,
      responseCode: statusCode,
      retryCount: attempt,
      success,
      message: statusMsg,
      failureReason: success ? undefined : failureReason || statusMsg,
    });

    const individualResults: IndexingResult[] = validUrls.map((u) => ({
      providerName: this.name,
      url: u,
      success,
      statusCode,
      retryCount: attempt,
      message: statusMsg,
      timestamp,
    }));

    return {
      providerName: this.name,
      submittedCount: validUrls.length,
      successCount: success ? validUrls.length : 0,
      failureCount: success ? 0 : validUrls.length,
      results: individualResults,
      timestamp,
    };
  }
}
