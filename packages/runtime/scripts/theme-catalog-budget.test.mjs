/**
 * Theme catalog budget unit tests (no I/O).
 * Run: node packages/runtime/scripts/theme-catalog-budget.test.mjs
 */
import {
  MAX_THEME_CATALOG_ENTRIES,
  MAX_THEME_CATALOG_BYTES,
  MAX_CATALOG_MEMBER_BYTES,
  evaluateCatalogMemberBudget,
} from "./theme-catalog-budget.mjs";

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

function assertEqual(actual, expected, msg) {
  assert(actual === expected, `${msg} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`);
}

// Constants
assertEqual(MAX_THEME_CATALOG_ENTRIES, 8, "MAX_THEME_CATALOG_ENTRIES === 8");
assertEqual(MAX_THEME_CATALOG_BYTES, 1.6 * 1024 * 1024, "MAX_THEME_CATALOG_BYTES === 1.6 MiB");
assertEqual(MAX_CATALOG_MEMBER_BYTES, 96 * 1024, "MAX_CATALOG_MEMBER_BYTES === 96 KiB");

// 1. Empty catalog, requireFull, oversized member → accept (active full art)
{
  const size = 2 * MAX_CATALOG_MEMBER_BYTES;
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 0,
    currentCatalogImageBytes: 0,
    candidateImageBytes: size,
    requireFull: true,
  });
  assert(d.accept === true, "empty+requireFull oversized: accept");
  assertEqual(d.reason, "ok", "empty+requireFull oversized: reason ok");
  assertEqual(d.nextEntryCount, 1, "empty+requireFull oversized: nextEntryCount 1");
  assertEqual(d.nextCatalogImageBytes, size, "empty+requireFull oversized: next bytes = size");
}

// 2. Empty catalog, not requireFull, size = maxMember + 1 → member-too-large
{
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 0,
    currentCatalogImageBytes: 0,
    candidateImageBytes: MAX_CATALOG_MEMBER_BYTES + 1,
    requireFull: false,
  });
  assert(d.accept === false, "member-too-large: reject");
  assertEqual(d.reason, "member-too-large", "member-too-large: reason");
  assertEqual(d.nextEntryCount, 0, "member-too-large: count unchanged");
  assertEqual(d.nextCatalogImageBytes, 0, "member-too-large: bytes unchanged");
}

// 3. Empty catalog, not requireFull, size === maxMember → ok (boundary inclusive)
{
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 0,
    currentCatalogImageBytes: 0,
    candidateImageBytes: MAX_CATALOG_MEMBER_BYTES,
    requireFull: false,
  });
  assert(d.accept === true, "size === maxMember: accept");
  assertEqual(d.reason, "ok", "size === maxMember: reason ok");
  assertEqual(d.nextEntryCount, 1, "size === maxMember: nextEntryCount 1");
  assertEqual(d.nextCatalogImageBytes, MAX_CATALOG_MEMBER_BYTES, "size === maxMember: next bytes");
}

// 4. currentEntryCount === max entries → max-entries
{
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: MAX_THEME_CATALOG_ENTRIES,
    currentCatalogImageBytes: 0,
    candidateImageBytes: 1024,
  });
  assert(d.accept === false, "max-entries: reject");
  assertEqual(d.reason, "max-entries", "max-entries: reason");
  assertEqual(d.nextEntryCount, MAX_THEME_CATALOG_ENTRIES, "max-entries: count unchanged");
  assertEqual(d.nextCatalogImageBytes, 0, "max-entries: bytes unchanged");
}

// 5. One entry, used near cap, nextBytes > max → catalog-bytes
{
  const used = MAX_THEME_CATALOG_BYTES - 100;
  const size = 200;
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 1,
    currentCatalogImageBytes: used,
    candidateImageBytes: size,
  });
  assert(d.accept === false, "catalog-bytes over: reject");
  assertEqual(d.reason, "catalog-bytes", "catalog-bytes over: reason");
  assertEqual(d.nextEntryCount, 1, "catalog-bytes over: count unchanged");
  assertEqual(d.nextCatalogImageBytes, used, "catalog-bytes over: bytes unchanged");
}

// 6. One entry, used + size === max → ok (boundary inclusive)
{
  const size = 1024;
  const used = MAX_THEME_CATALOG_BYTES - size;
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 1,
    currentCatalogImageBytes: used,
    candidateImageBytes: size,
  });
  assert(d.accept === true, "catalog-bytes equal: accept");
  assertEqual(d.reason, "ok", "catalog-bytes equal: reason ok");
  assertEqual(d.nextEntryCount, 2, "catalog-bytes equal: nextEntryCount 2");
  assertEqual(d.nextCatalogImageBytes, MAX_THEME_CATALOG_BYTES, "catalog-bytes equal: next bytes at cap");
}

// 7. requireFull true, count > 0, over total budget → still catalog-bytes
{
  const used = MAX_THEME_CATALOG_BYTES - 50;
  const size = 100;
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: 1,
    currentCatalogImageBytes: used,
    candidateImageBytes: size,
    requireFull: true,
  });
  assert(d.accept === false, "requireFull does not waive catalog-bytes: reject");
  assertEqual(d.reason, "catalog-bytes", "requireFull over total: reason catalog-bytes");
  assertEqual(d.nextEntryCount, 1, "requireFull over total: count unchanged");
  assertEqual(d.nextCatalogImageBytes, used, "requireFull over total: bytes unchanged");
}

// max-entries wins over member-too-large (order lock)
{
  const d = evaluateCatalogMemberBudget({
    currentEntryCount: MAX_THEME_CATALOG_ENTRIES,
    currentCatalogImageBytes: 0,
    candidateImageBytes: MAX_CATALOG_MEMBER_BYTES + 1,
    requireFull: false,
  });
  assertEqual(d.reason, "max-entries", "max-entries before member-too-large");
}

if (failed > 0) {
  console.error(`theme-catalog-budget.test: ${failed} failure(s)`);
  process.exit(1);
}
console.log("theme-catalog-budget.test: pass");
