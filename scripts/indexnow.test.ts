import { IndexingBatchQueue, IndexNowProvider, getIndexingConfig } from "../src/lib/indexnow";

async function runTests() {
  console.log("=================================================");
  console.log("       YUITILITY INDEXNOW UNIT TEST SUITE        ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Configuration parsing & host extraction
  try {
    const config = getIndexingConfig();
    assert(config.apiKey === "9f3cfc08d1a3442f84c9387d825e44b5", "Config loads valid API key");
    assert(config.host === "www.yuitility.app", "Config parses correct hostname");
    assert(config.keyLocation.includes(".txt"), "Config generates keyLocation text file URL");
    assert(config.maxBatchSize === 10000, "Config sets max batch size to 10,000");
  } catch (err) {
    assert(false, `Config loading failed: ${err}`);
  }

  // Test 2: URL Deduplication
  try {
    const rawUrls = [
      "https://www.yuitility.app/tools/bmi-calculator",
      "https://www.yuitility.app/tools/bmi-calculator",
      "https://www.yuitility.app/tools/emi-calculator ",
      "",
      "   ",
      "https://www.yuitility.app/tools/json-formatter",
    ];
    const deduplicated = IndexingBatchQueue.deduplicate(rawUrls);
    assert(deduplicated.length === 3, "Deduplicates URLs and removes empty strings");
    assert(deduplicated[0] === "https://www.yuitility.app/tools/bmi-calculator", "Preserves exact valid URL strings");
  } catch (err) {
    assert(false, `Deduplication test failed: ${err}`);
  }

  // Test 3: Batch Chunking
  try {
    const largeUrlList = Array.from({ length: 25000 }, (_, i) => `https://www.yuitility.app/page-${i}`);
    const chunks = IndexingBatchQueue.chunk(largeUrlList, 10000);
    assert(chunks.length === 3, "Splits 25,000 URLs into 3 chunked batches");
    assert(chunks[0].length === 10000, "Chunk 1 has exactly 10,000 URLs");
    assert(chunks[1].length === 10000, "Chunk 2 has exactly 10,000 URLs");
    assert(chunks[2].length === 5000, "Chunk 3 has remaining 5,000 URLs");
  } catch (err) {
    assert(false, `Batch chunking test failed: ${err}`);
  }

  // Test 4: Provider payload generation & safety
  try {
    const provider = new IndexNowProvider();
    assert(provider.name === "IndexNow", "IndexNowProvider exposes name property");

    // Empty list submission does not error
    const emptyRes = await provider.submitUrls([]);
    assert(emptyRes.submittedCount === 0, "Handles empty URL array gracefully");
  } catch (err) {
    assert(false, `Provider payload test failed: ${err}`);
  }

  // Test 5: Invalid / Malformed inputs cause no app crash
  try {
    const provider = new IndexNowProvider();
    const result = await provider.submitUrl("");
    assert(result.success === false, "Invalid empty URL submission fails safely without crashing");
  } catch (err) {
    assert(false, `App safety test failed: ${err}`);
  }

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passed} Passed | ${failed} Failed`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});
