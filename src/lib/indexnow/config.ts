import { IndexingConfig } from "./types";

const DEFAULT_KEY = "9f3cfc08d1a3442f84c9387d825e44b5";
const DEFAULT_SITE_URL = "https://www.yuitility.app";

/**
 * Validates a URL string and returns a clean URL instance.
 */
function parseUrl(urlStr: string): URL {
  try {
    const formatted = urlStr.startsWith("http://") || urlStr.startsWith("https://")
      ? urlStr
      : `https://${urlStr}`;
    return new URL(formatted);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

/**
 * Loads and validates environment configuration for IndexNow and Indexing Services.
 */
export function getIndexingConfig(): IndexingConfig {
  const envKey = process.env.INDEXNOW_KEY || process.env.NEXT_PUBLIC_INDEXNOW_KEY;
  const envSiteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;

  const apiKey = (envKey && envKey.trim().length > 0) ? envKey.trim() : DEFAULT_KEY;
  const rawSiteUrl = (envSiteUrl && envSiteUrl.trim().length > 0) ? envSiteUrl.trim() : DEFAULT_SITE_URL;

  const siteUrlObj = parseUrl(rawSiteUrl);
  const siteUrl = siteUrlObj.origin;
  const host = siteUrlObj.hostname;
  const keyLocation = `${siteUrl}/${apiKey}.txt`;

  return {
    apiKey,
    siteUrl,
    host,
    keyLocation,
    endpoint: "https://yandex.com/indexnow",
    maxRetries: 3,
    initialRetryDelayMs: 1000,
    maxBatchSize: 10000,
  };
}
