/**
 * payload-builder offline regression (injector-split S3).
 * Run: node packages/runtime/scripts/payload-builder.test.mjs
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPayload, earlyPayloadFor } from "./payload-builder.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const runtimeRoot = path.resolve(here, "..");
// scripts/ → runtime/ → packages/ → repo root
const repoRoot = path.resolve(here, "..", "..", "..");

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
  assert(
    actual === expected,
    `${msg} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`,
  );
}

// --- earlyPayloadFor shape ---
{
  const src = earlyPayloadFor("/*payload-body*/", "rev-abc");
  assert(src.includes("__CODEX_DREAM_SKIN_EARLY_GENERATION__"), "earlyPayloadFor has generation key");
  assert(src.includes("__CODEX_DREAM_SKIN_EARLY_APPLIED__"), "earlyPayloadFor has applied key");
  assert(src.includes(JSON.stringify("rev-abc")), "earlyPayloadFor embeds revision literal");
  assert(src.includes("/*payload-body*/"), "earlyPayloadFor inlines payload source");
  assert(src.includes("MutationObserver"), "earlyPayloadFor waits via MutationObserver");
}

// --- loadPayload against runtime assets (always present in repo) ---
{
  const themeDir = path.join(runtimeRoot, "assets");
  const a = await loadPayload(runtimeRoot, themeDir);
  const b = await loadPayload(runtimeRoot, themeDir);
  assert(typeof a.payload === "string" && a.payload.length > 100, "loadPayload returns payload string");
  assert(typeof a.fingerprint === "string" && a.fingerprint.length === 64, "fingerprint sha256 hex");
  assertEqual(a.fingerprint, b.fingerprint, "stable input → equal fingerprint");
  assert(!a.payload.includes("__DREAM_CSS_JSON__"), "CSS placeholder replaced");
  assert(!a.payload.includes("__DREAM_ART_JSON__"), "art placeholder replaced");
  assert(!a.payload.includes("__DREAM_THEME_JSON__"), "theme placeholder replaced");
  assert(!a.payload.includes("__DREAM_THEME_CATALOG_JSON__"), "catalog placeholder replaced");
  assert(a.themeCount >= 1, "themeCount includes active");
  assert(typeof a.catalogSourceStamp === "string", "catalogSourceStamp present");
}

// --- bubbleStyle changes fingerprint ---
{
  const stateRoot = await fs.mkdtemp(path.join(os.tmpdir(), "payload-builder-"));
  try {
    // theme dir must be stateRoot/assets so ui-prefs lives at stateRoot/ui-prefs.json
    const themeDir = path.join(stateRoot, "assets");
    await fs.mkdir(themeDir, { recursive: true });
    const srcAssets = path.join(runtimeRoot, "assets");
    const themeJson = await fs.readFile(path.join(srcAssets, "theme.json"), "utf8");
    const imageName = JSON.parse(themeJson).image || "dream-reference.jpg";
    await fs.writeFile(path.join(themeDir, "theme.json"), themeJson);
    await fs.copyFile(path.join(srcAssets, imageName), path.join(themeDir, imageName));

    const borderless = await loadPayload(runtimeRoot, themeDir);
    await fs.writeFile(
      path.join(stateRoot, "ui-prefs.json"),
      JSON.stringify({ bubbleStyle: "card" }),
    );
    const card = await loadPayload(runtimeRoot, themeDir);
    assert(
      borderless.fingerprint !== card.fingerprint,
      "bubbleStyle card vs default changes fingerprint",
    );
    assert(card.payload.includes('"bubbleStyle":"card"') || card.payload.includes('\\"bubbleStyle\\":\\"card\\"'),
      "card bubbleStyle lands in inject theme JSON");
  } finally {
    await fs.rm(stateRoot, { recursive: true, force: true });
  }
}

// --- optional: DreamSkin-format bundled theme (image/palette), not heige hero/colors ---
{
  const bundled = path.join(repoRoot, "themes", "preset-arina-hashimoto");
  try {
    await fs.access(path.join(bundled, "theme.json"));
    const raw = JSON.parse(await fs.readFile(path.join(bundled, "theme.json"), "utf8"));
    if (typeof raw.image === "string") {
      const loaded = await loadPayload(runtimeRoot, bundled);
      assert(typeof loaded.fingerprint === "string" && loaded.fingerprint.length === 64,
        "bundled arina loadPayload fingerprint");
      assert(loaded.theme?.id === "preset-arina-hashimoto" || loaded.payload.length > 0,
        "bundled arina payload builds");
    } else {
      console.log("skip: arina theme.json is not DreamSkin image/ shape");
    }
  } catch (error) {
    console.log("skip: themes/preset-arina-hashimoto loadPayload:", error?.message ?? error);
  }
}

if (failed > 0) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\npayload-builder tests passed");
