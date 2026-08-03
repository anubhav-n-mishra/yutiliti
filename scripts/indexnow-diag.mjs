// IndexNow 403 Diagnostic Script
// Tests multiple submission strategies to isolate the root cause

const KEY = "9f3cfc08d1a3442f84c9387d825e44b5";
const HOST = "www.yuitility.app";
const SITE_URL = "https://www.yuitility.app";
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const TEST_URL = `${SITE_URL}/`;

async function test(label, fn) {
  try {
    const result = await fn();
    console.log(`\n[${label}]`);
    console.log(`  Status: ${result.status}`);
    console.log(`  Body:   ${result.body}`);
  } catch (e) {
    console.log(`\n[${label}] ERROR: ${e.message}`);
  }
}

async function main() {
  console.log("=== IndexNow 403 Diagnostic ===\n");

  // 1. Verify key file is accessible
  console.log("--- Step 1: Verify key file accessibility ---");
  const keyResp = await fetch(KEY_LOCATION);
  const keyBody = await keyResp.text();
  console.log(`  Key file HTTP status: ${keyResp.status}`);
  console.log(`  Key file Content-Type: ${keyResp.headers.get("content-type")}`);
  console.log(`  Key file body (raw bytes): ${Buffer.from(keyBody).length}`);
  console.log(`  Key file body (hex): ${Buffer.from(keyBody).toString("hex")}`);
  console.log(`  Key file body (repr): ${JSON.stringify(keyBody)}`);
  console.log(`  Exact match: ${keyBody === KEY}`);
  console.log(`  Trimmed match: ${keyBody.trim() === KEY}`);

  // 2. Test GET method to api.indexnow.org
  await test("GET api.indexnow.org", async () => {
    const url = `https://api.indexnow.org/IndexNow?url=${encodeURIComponent(TEST_URL)}&key=${KEY}`;
    const r = await fetch(url, { method: "GET" });
    return { status: r.status, body: await r.text() };
  });

  // 3. Test GET method to www.bing.com/indexnow  
  await test("GET www.bing.com/indexnow", async () => {
    const url = `https://www.bing.com/indexnow?url=${encodeURIComponent(TEST_URL)}&key=${KEY}`;
    const r = await fetch(url, { method: "GET" });
    return { status: r.status, body: await r.text() };
  });

  // 4. POST to api.indexnow.org WITH keyLocation
  await test("POST api.indexnow.org (with keyLocation)", async () => {
    const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: [TEST_URL] };
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { status: r.status, body: await r.text() };
  });

  // 5. POST to api.indexnow.org WITHOUT keyLocation
  await test("POST api.indexnow.org (without keyLocation)", async () => {
    const payload = { host: HOST, key: KEY, urlList: [TEST_URL] };
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { status: r.status, body: await r.text() };
  });

  // 6. POST to www.bing.com/indexnow WITH keyLocation
  await test("POST www.bing.com/indexnow (with keyLocation)", async () => {
    const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: [TEST_URL] };
    const r = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { status: r.status, body: await r.text() };
  });

  // 7. POST to www.bing.com/indexnow WITHOUT keyLocation
  await test("POST www.bing.com/indexnow (without keyLocation)", async () => {
    const payload = { host: HOST, key: KEY, urlList: [TEST_URL] };
    const r = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { status: r.status, body: await r.text() };
  });

  // 8. Check if there's a redirect on the key file URL
  console.log("\n--- Step 8: Check redirect chain on key file ---");
  const redirectResp = await fetch(KEY_LOCATION, { redirect: "manual" });
  console.log(`  Direct status (no follow): ${redirectResp.status}`);
  console.log(`  Location header: ${redirectResp.headers.get("location") || "(none)"}`);

  // 9. Check non-www variant
  console.log("\n--- Step 9: Check non-www key file ---");
  const nonWwwResp = await fetch(`https://yuitility.app/${KEY}.txt`, { redirect: "manual" });
  console.log(`  Non-www status: ${nonWwwResp.status}`);
  console.log(`  Non-www Location: ${nonWwwResp.headers.get("location") || "(none)"}`);
}

main().catch(console.error);
