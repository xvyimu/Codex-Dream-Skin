/**
 * Theme catalog / quality gate (W2).
 * - Bundled themes: schema surface + art on disk
 * - Catalog budget constants stay aligned with inject F6 (MAX_THEME_CATALOG_ENTRIES=8)
 * - Live-preview discipline is documented in docs/CONTRIBUTING.md §C-2 (not automated here)
 *
 * NOTE: no static import of packages/runtime (ADR core↔runtime / themes deps gate).
 * Budget constants are read as source text from theme-catalog-budget.mjs.
 *
 * Run: node packages/themes/theme-catalog-quality.test.mjs
 *      npm run test:catalog-quality
 */
import { readdir, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { validateThemeManifest } from "./theme-schema.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const themesRoot = join(repoRoot, "themes");
const injectPath = join(repoRoot, "packages", "runtime", "assets", "renderer-inject.js");
const budgetPath = join(repoRoot, "packages", "runtime", "scripts", "theme-catalog-budget.mjs");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

// --- budget constants (F6 inject catalog) — source-text pin, no runtime import ---
{
  const budgetSrc = await readFile(budgetPath, "utf8");
  assert(
    /MAX_THEME_CATALOG_ENTRIES\s*=\s*8\b/.test(budgetSrc),
    "MAX_THEME_CATALOG_ENTRIES === 8 (F6 catalog cap)",
  );
  assert(
    /MAX_CATALOG_MEMBER_BYTES\s*=\s*96\s*\*\s*1024\b/.test(budgetSrc),
    "MAX_CATALOG_MEMBER_BYTES === 96 * 1024",
  );
  assert(
    /MAX_THEME_CATALOG_BYTES\s*=\s*1\.6\s*\*\s*1024\s*\*\s*1024\b/.test(budgetSrc),
    "MAX_THEME_CATALOG_BYTES === 1.6 * 1024 * 1024",
  );
}

// renderer still documents catalog channel (setTheme / cycleTheme / F6)
{
  const injectSrc = await readFile(injectPath, "utf8");
  assert(
    injectSrc.includes("setTheme") || injectSrc.includes("cycleTheme") || /catalog/i.test(injectSrc),
    "renderer-inject references catalog / setTheme path",
  );
}

// --- every bundled theme: schema + surface + art on disk ---
{
  const entries = await readdir(themesRoot, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  assert(dirs.length >= 1, `bundled themes present (found ${dirs.length})`);

  for (const id of dirs) {
    const dir = join(themesRoot, id);
    const raw = JSON.parse(await readFile(join(dir, "theme.json"), "utf8"));
    let manifest;
    try {
      manifest = validateThemeManifest(raw);
    } catch (error) {
      assert(false, `${id}: validateThemeManifest — ${error?.message ?? error}`);
      continue;
    }
    assert(
      typeof manifest.colors?.surface === "string" && manifest.colors.surface.length > 0,
      `${id}: surface present after normalize (inject appearance path)`,
    );
    assert(
      typeof manifest.colors?.text === "string" && manifest.colors.text.length > 0,
      `${id}: text present after normalize`,
    );
    const hero = manifest.hero;
    assert(typeof hero === "string" && hero.length > 0, `${id}: hero/image path`);
    try {
      await access(join(dir, hero));
      assert(true, `${id}: art file exists (${hero})`);
    } catch {
      assert(false, `${id}: missing art file ${hero}`);
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\ntheme catalog quality tests passed");
