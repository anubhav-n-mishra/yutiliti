import { IndexingLogEntry } from "./types";

/**
 * Production structured logger for Indexing Services.
 * Logs submission metrics without exposing secrets or keys.
 */
export class IndexingLogger {
  private static sanitizeSecret(text: string): string {
    return text.replace(/[a-f0-9]{32}/gi, "[REDACTED_KEY]");
  }

  public static log(entry: IndexingLogEntry): void {
    const sanitizedReason = entry.failureReason
      ? this.sanitizeSecret(entry.failureReason)
      : undefined;

    const logPayload = {
      timestamp: entry.timestamp,
      provider: entry.provider,
      submittedUrlCount: entry.submittedUrlCount,
      responseCode: entry.responseCode,
      retryCount: entry.retryCount,
      success: entry.success,
      message: entry.message,
      ...(sanitizedReason ? { failureReason: sanitizedReason } : {}),
    };

    if (entry.success) {
      console.log(`[IndexingService][${entry.provider}] SUCCESS (${entry.responseCode}): Submitted ${entry.submittedUrlCount} URL(s) [Retries: ${entry.retryCount}]`);
    } else {
      console.error(`[IndexingService][${entry.provider}] FAILURE (${entry.responseCode}): Failed to submit ${entry.submittedUrlCount} URL(s) [Retries: ${entry.retryCount}] - ${sanitizedReason || entry.message}`);
    }
  }
}
