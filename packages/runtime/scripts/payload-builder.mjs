/** Payload build + early-apply wrapper (injector extract S3). Same semantics as former injector Region: ThemeLoad (payload). */
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { loadTheme, loadThemeCatalog, imageDataUrl } from "./theme-load.mjs";

/**
 * Build CDP evaluate source for one themeDir.
 * @param {string} runtimeRoot packages/runtime (has assets/ sibling of scripts/)
 * @param {string} [themeDir]
 * @param {object|null} [candidateTheme] preloaded loadTheme result
 */
export async function loadPayload(
  runtimeRoot,
  themeDir = path.join(runtimeRoot, "assets"),
  candidateTheme = null,
) {
  const loadedTheme = candidateTheme ?? (await loadTheme(themeDir));
  const [css, template, themeCatalog] = await Promise.all([
    fs.readFile(path.join(runtimeRoot, "assets", "dream-skin.css"), "utf8"),
    fs.readFile(path.join(runtimeRoot, "assets", "renderer-inject.js"), "utf8"),
    loadThemeCatalog(themeDir, loadedTheme),
  ]);
  // Active art rides __DREAM_ART_JSON__ as a data URL so the renderer paints the
  // right-half hero (heige-style). __DREAM_THEME_JSON__ carries the active theme
  // config (art focus + palette + brand copy) that drives the ::before/::after
  // brand overlay. Catalog stays the F6 channel (best-effort; may be dropped by
  // older renderers that only read 3 args).
  // bubbleStyle from ui-prefs.json (borderless|card) — conversation chrome.
  let bubbleStyle = "borderless";
  try {
    const stateRoot = path.dirname(path.resolve(themeDir));
    const prefsPath = path.join(stateRoot, "ui-prefs.json");
    const prefsRaw = await fs.readFile(prefsPath, "utf8");
    const prefs = JSON.parse(prefsRaw.replace(/^﻿/, ""));
    if (prefs && typeof prefs.bubbleStyle === "string") {
      const bs = prefs.bubbleStyle.trim().toLowerCase();
      if (bs === "card" || bs === "borderless") bubbleStyle = bs;
    }
  } catch {
    // missing prefs → borderless default
  }
  const themeForInject = { ...loadedTheme.theme, bubbleStyle };
  const activeArtDataUrl = imageDataUrl(loadedTheme);
  const payload = template
    .replace("__DREAM_CSS_JSON__", JSON.stringify(css))
    .replace("__DREAM_ART_JSON__", JSON.stringify(activeArtDataUrl))
    .replace("__DREAM_THEME_JSON__", JSON.stringify(themeForInject))
    .replace("__DREAM_THEME_CATALOG_JSON__", JSON.stringify(themeCatalog.entries));
  const fingerprint = createHash("sha256")
    .update(loadedTheme.fingerprint)
    .update("\0")
    .update(themeCatalog.fingerprint)
    .update("\0")
    .update(bubbleStyle)
    .digest("hex");
  const { imageBytes: _imageBytes, ...themeState } = loadedTheme;
  return {
    ...themeState,
    activeThemeFingerprint: loadedTheme.fingerprint,
    catalogSourceStamp: themeCatalog.catalogSourceStamp,
    fingerprint,
    imageBytes: loadedTheme.imageBytes.length,
    catalogImageBytes: themeCatalog.catalogImageBytes,
    themeCount: themeCatalog.entries.length,
    catalogSkippedLarge: themeCatalog.skippedLarge ?? 0,
    catalogSkippedBudget: themeCatalog.skippedBudget ?? 0,
    catalogThumbCount: themeCatalog.thumbCount ?? 0,
    payload,
  };
}

/** Early document script: wait for Codex shell markers then run payload; stamp generation. */
export function earlyPayloadFor(payload, revision) {
  return `(() => {
    const generationKey = "__CODEX_DREAM_SKIN_EARLY_GENERATION__";
    const appliedKey = "__CODEX_DREAM_SKIN_EARLY_APPLIED__";
    const generation = ${JSON.stringify(revision)};
    window[generationKey] = generation;
    let observer = null;
    let timeout = null;
    const stop = () => {
      observer?.disconnect();
      observer = null;
      if (timeout) clearTimeout(timeout);
      timeout = null;
    };
    const install = () => {
      if (window[generationKey] !== generation) { stop(); return true; }
      const root = document.documentElement;
      if (!root || !document.body) return false;
      // Adaptive readiness for Codex DOM renames after Store updates.
      const shell = document.querySelector('main.main-surface, main[class*="main-surface"], main[class*="MainSurface"], main');
      const sidebar = document.querySelector('aside.app-shell-left-panel, aside[class*="left-panel"], aside[class*="sidebar"], nav[class*="sidebar"]');
      const composer = document.querySelector('.composer-surface-chrome, [class*="composer-surface"], [class*="ComposerSurface"]');
      const mainRole = document.querySelector('[role="main"]');
      const ready =
        (shell && sidebar) ||
        (document.getElementById('root') && (shell || composer || mainRole));
      if (!ready) return false;
      stop();
      ${payload};
      window[appliedKey] = generation;
      return true;
    };
    if (install()) return;
    if (typeof MutationObserver === "function" && document.documentElement) {
      observer = new MutationObserver(install);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    timeout = setTimeout(stop, 10000);
  })()`;
}
