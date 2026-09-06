import { CATEGORIES, TOOLS } from "../src/types";
import { absoluteUrl, toolPath } from "../src/lib/site";
import { getIndexingConfig, IndexingBatchQueue, submitUrls } from "../src/lib/indexnow";
import { getAllToolPresets } from "../src/lib/toolPresets";
import { BLOG_POSTS } from "../src/lib/blogs";

/**
 * Admin CLI Utility for sync submitting all site URLs to IndexNow.
 * Reads sitemap entries, batches up to 10,000 URLs per payload, and outputs statistics.
 */
export async function runIndexNowSync(): Promise<void> {
  console.log("=================================================");
  console.log("       YUITILITY INDEXNOW CLI SYNC UTILITY       ");
  console.log("=================================================\n");

  const config = getIndexingConfig();
  console.log(`[Config] Site Host    : ${config.host}`);
  console.log(`[Config] Target URL   : ${config.siteUrl}`);
  console.log(`[Config] Key Location : ${config.keyLocation}`);
  console.log(`[Config] Batch Limit  : ${config.maxBatchSize} URLs/request\n`);

  // Extract all active sitemap URLs
  const urls: string[] = [
    absoluteUrl("/"),
    absoluteUrl("/tools"),
    absoluteUrl("/blog"),
    absoluteUrl("/privacy"),
    absoluteUrl("/terms"),
  ];

  // Category URLs
  CATEGORIES.filter((c) => c.id !== "all").forEach((category) => {
    urls.push(absoluteUrl(`/category/${category.id}`));
  });

  // Tool URLs
  TOOLS.filter((t) => !t.disabled).forEach((tool) => {
    urls.push(absoluteUrl(toolPath(tool.id)));
  });

  // Programmatic Presets (US, UK, Canada, India High-CPC targets)
  getAllToolPresets().forEach((preset) => {
    urls.push(absoluteUrl(`/tools/${preset.toolId}/${preset.presetSlug}`));
  });

  // Deep Blog Tutorial Guides
  BLOG_POSTS.forEach((post) => {
    urls.push(absoluteUrl(`/blog/${post.slug}`));
  });

  const deduplicated = IndexingBatchQueue.deduplicate(urls);
  console.log(`[Sitemap] Extracted ${urls.length} raw URLs -> ${deduplicated.length} unique deduplicated URLs.\n`);

  const chunks = IndexingBatchQueue.chunk(deduplicated, config.maxBatchSize);
  console.log(`[Queue] Prepared ${chunks.length} batch payload(s) for submission.\n`);

  let totalSubmitted = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`[Batch ${i + 1}/${chunks.length}] Submitting ${chunk.length} URL(s)...`);

    try {
      const results = await submitUrls(chunk);
      for (const res of results) {
        totalSubmitted += res.submittedCount;
        totalSuccess += res.successCount;
        totalFailed += res.failureCount;

        console.log(`  -> Provider  : ${res.providerName}`);
        console.log(`  -> Status    : ${res.successCount > 0 ? "SUCCESS" : "FAILED"}`);
        console.log(`  -> Submitted : ${res.submittedCount} | Succeeded: ${res.successCount} | Failed: ${res.failureCount}`);
      }
    } catch (err: unknown) {
      console.error(`  -> [Batch ${i + 1}] Error submitting chunk:`, err instanceof Error ? err.message : String(err));
      totalFailed += chunk.length;
    }
    console.log("");
  }

  console.log("=================================================");
  console.log("               FINAL SYNC SUMMARY               ");
  console.log("=================================================");
  console.log(`Total URLs Discovered  : ${deduplicated.length}`);
  console.log(`Total URLs Submitted   : ${totalSubmitted}`);
  console.log(`Successfully IndexNow'd : ${totalSuccess}`);
  console.log(`Failed Submissions     : ${totalFailed}`);
  console.log("=================================================\n");
}

runIndexNowSync()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("IndexNow Sync CLI fatal error:", err);
    process.exit(1);
  });
