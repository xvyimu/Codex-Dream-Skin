/**
 * listThemes includeSkipped / default array shape (no test framework).
 * Run: node packages/themes/theme-store.test.mjs  |  npm run test:store
 */
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { listThemes } from "./theme-store.mjs";

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

const root = await mkdtemp(join(tmpdir(), "codex-skin-store-"));
try {
  const goodDir = join(root, "good-theme");
  const badJsonDir = join(root, "bad-json");
  const missingIdDir = join(root, "missing-id");
  await mkdir(goodDir, { recursive: true });
  await mkdir(badJsonDir, { recursive: true });
  await mkdir(missingIdDir, { recursive: true });

  await writeFile(
    join(goodDir, "theme.json"),
    JSON.stringify({
      schemaVersion: 1,
      id: "good-theme",
      name: "Good Theme",
      hero: "hero.webp",
    }),
    "utf8",
  );
  await writeFile(join(badJsonDir, "theme.json"), "{ not json", "utf8");
  await writeFile(
    join(missingIdDir, "theme.json"),
    JSON.stringify({ schemaVersion: 1, name: "No Id" }),
    "utf8",
  );

  // Default: still a sorted array; bad dirs silent.
  const defaultList = await listThemes({ roots: [root], dedupe: true });
  assert(Array.isArray(defaultList), "default listThemes returns array");
  assert(defaultList.length === 1, "default list only includes valid themes");
  assert(defaultList[0].id === "good-theme", "default list has good-theme");

  // Detailed: object with themes + skipped
  const detailed = await listThemes({
    roots: [root],
    dedupe: true,
    includeSkipped: true,
  });
  assert(!Array.isArray(detailed), "includeSkipped returns object");
  assert(Array.isArray(detailed.themes), "detailed.themes is array");
  assert(Array.isArray(detailed.skipped), "detailed.skipped is array");
  assert(detailed.themes.length === 1, "detailed.themes has good theme only");
  assert(detailed.skipped.length >= 2, "skipped includes bad dirs");

  const reasons = detailed.skipped.map((s) => s.reason);
  assert(
    detailed.skipped.every((s) => typeof s.dir === "string" && s.dir.length > 0),
    "skipped.dir is absolute-ish path string",
  );
  assert(
    reasons.includes("invalid-json") || reasons.some((r) => /json/i.test(r)),
    "bad JSON recorded as invalid-json (or message)",
  );
  assert(reasons.includes("missing-id-or-name"), "shape-guard → missing-id-or-name");

  // ENOENT root: not recorded as skipped
  const missingRoot = join(root, "does-not-exist-root");
  const withMissingRoot = await listThemes({
    roots: [missingRoot, root],
    dedupe: true,
    includeSkipped: true,
  });
  assert(
    !withMissingRoot.skipped.some((s) => s.dir === missingRoot),
    "ENOENT root is not skipped entry",
  );
  assert(withMissingRoot.themes.length === 1, "ENOENT root still lists other roots");
} finally {
  await rm(root, { recursive: true, force: true });
}

if (failed > 0) {
  console.error(`\ntheme-store.test: ${failed} failed`);
  process.exit(1);
}
console.log("\ntheme-store.test: all passed");
