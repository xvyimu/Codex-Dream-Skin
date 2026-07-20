import { lstat, readFile, realpath } from "node:fs/promises";
import {
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
  win32,
} from "node:path";

import { THEME_SCHEMA_VERSION } from "../core/constants.mjs";

const COLOR_KEYS = ["accent", "secondary", "surface", "text"];
const COPY_KEYS = ["brand", "headline", "tagline"];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const HEX_COLOR = /^#[0-9A-F]{6}$/i;
const THEME_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_COLORS = {
  accent: "#4BC2E0",
  secondary: "#AD7ED5",
  surface: "#FAFAFF",
  text: "#122C60",
};
const DEFAULT_ART = {
  focusX: 0.72,
  focusY: 0.45,
  safeArea: "left",
  taskMode: "ambient",
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isInside(root, candidate) {
  const relativePath = relative(root, candidate);
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
  );
}

function normalizeAssetPath(value, field) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    isAbsolute(value) ||
    win32.isAbsolute(value) ||
    value.split(/[\\/]+/).includes("..")
  ) {
    throw new Error(`theme ${field} must be a relative path inside the theme directory`);
  }
  if (!IMAGE_EXTENSIONS.has(extname(value).toLowerCase())) {
    throw new Error(`theme ${field} must be PNG, JPEG, or WebP`);
  }
  return value;
}

function normalizeHero(hero) {
  return normalizeAssetPath(hero, "hero");
}

/**
 * Accept heige `colors` or DreamSkin `palette`.
 * Missing keys fall back to defaults; empty objects still get defaults.
 */
function normalizeColors(colors, palette) {
  const source = isRecord(colors)
    ? colors
    : isRecord(palette)
      ? palette
      : null;
  if (colors != null && !isRecord(colors) && !isRecord(palette)) {
    throw new Error("theme colors/palette must be an object");
  }
  return Object.fromEntries(
    COLOR_KEYS.map((key) => {
      const configured = source?.[key];
      const value = configured === undefined || configured === ""
        ? DEFAULT_COLORS[key]
        : configured;
      if (typeof value !== "string" || !HEX_COLOR.test(value)) {
        throw new Error(`${key} must be a six-digit hex color`);
      }
      return [key, value.toUpperCase()];
    }),
  );
}

/**
 * Accept heige `copy` or DreamSkin brandSubtitle/tagline/quote fields.
 */
function normalizeCopy(input) {
  const copy = isRecord(input.copy) ? input.copy : {};
  const merged = {
    brand:
      (typeof copy.brand === "string" && copy.brand) ||
      (typeof input.brandSubtitle === "string" && input.brandSubtitle) ||
      undefined,
    headline:
      (typeof copy.headline === "string" && copy.headline) ||
      (typeof input.quote === "string" && input.quote) ||
      undefined,
    tagline:
      (typeof copy.tagline === "string" && copy.tagline) ||
      (typeof input.tagline === "string" && input.tagline) ||
      undefined,
  };

  const present = Object.fromEntries(
    COPY_KEYS.filter((key) => typeof merged[key] === "string").map((key) => [
      key,
      merged[key],
    ]),
  );
  return Object.keys(present).length ? present : null;
}

function normalizeArt(art) {
  if (art == null) return { ...DEFAULT_ART };
  if (!isRecord(art)) {
    throw new Error("theme art must be an object");
  }
  const focusX =
    typeof art.focusX === "number" && Number.isFinite(art.focusX)
      ? art.focusX
      : DEFAULT_ART.focusX;
  const focusY =
    typeof art.focusY === "number" && Number.isFinite(art.focusY)
      ? art.focusY
      : DEFAULT_ART.focusY;
  const safeArea =
    typeof art.safeArea === "string" && art.safeArea.trim()
      ? art.safeArea.trim()
      : DEFAULT_ART.safeArea;
  const taskMode =
    typeof art.taskMode === "string" && art.taskMode.trim()
      ? art.taskMode.trim()
      : DEFAULT_ART.taskMode;
  return { focusX, focusY, safeArea, taskMode };
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new Error("string field must be a string when present");
  }
  return value;
}

export function validateThemeManifest(input) {
  if (!isRecord(input)) {
    throw new Error("theme manifest must be an object");
  }
  if (input.schemaVersion !== THEME_SCHEMA_VERSION) {
    throw new Error(`unsupported theme schema ${input.schemaVersion}`);
  }
  if (typeof input.id !== "string" || !THEME_ID.test(input.id)) {
    throw new Error("theme id must use lowercase letters, numbers, and hyphens");
  }
  if (typeof input.name !== "string" || !input.name.trim()) {
    throw new Error("theme name must be a non-empty string");
  }

  // Accept both heige (`hero`) and DreamSkin catalog (`image`) field names.
  const heroSource = input.hero ?? input.image;
  const colors = normalizeColors(input.colors, input.palette);
  const copy = normalizeCopy(input);
  const art = normalizeArt(input.art);
  const appearance =
    typeof input.appearance === "string" && input.appearance.trim()
      ? input.appearance.trim()
      : "auto";

  const manifest = {
    schemaVersion: THEME_SCHEMA_VERSION,
    id: input.id,
    name: input.name.trim(),
    hero: normalizeHero(heroSource),
    logo:
      input.logo === undefined || input.logo === null
        ? null
        : normalizeAssetPath(input.logo, "logo"),
    polaroid:
      input.polaroid === undefined || input.polaroid === null
        ? null
        : normalizeAssetPath(input.polaroid, "polaroid"),
    colors,
    copy,
    art,
    appearance,
  };

  // Preserve DreamSkin-only strings so adapter can round-trip without inventing defaults.
  const statusText = normalizeOptionalString(input.statusText);
  const projectPrefix = normalizeOptionalString(input.projectPrefix);
  const projectLabel = normalizeOptionalString(input.projectLabel);
  if (statusText !== undefined) manifest.statusText = statusText;
  if (projectPrefix !== undefined) manifest.projectPrefix = projectPrefix;
  if (projectLabel !== undefined) manifest.projectLabel = projectLabel;

  return manifest;
}

async function resolveAsset(root, realRoot, relative, field) {
  const assetPath = resolve(root, relative);
  if (!isInside(root, assetPath)) {
    throw new Error(`theme ${field} escapes the theme directory`);
  }
  const realAssetPath = await realpath(assetPath);
  if (!isInside(realRoot, realAssetPath)) {
    throw new Error(`theme ${field} escapes the theme directory`);
  }
  const info = await lstat(assetPath);
  if (!info.isFile() || info.size < 1) {
    throw new Error(`theme ${field} must be a non-empty file`);
  }
  return assetPath;
}

export async function loadTheme(themeDir) {
  const root = resolve(themeDir);
  const raw = JSON.parse(await readFile(join(root, "theme.json"), "utf8"));
  const manifest = validateThemeManifest(raw);
  const realRoot = await realpath(root);
  const heroPath = await resolveAsset(root, realRoot, manifest.hero, "hero");
  const logoPath = manifest.logo
    ? await resolveAsset(root, realRoot, manifest.logo, "logo")
    : null;
  const polaroidPath = manifest.polaroid
    ? await resolveAsset(root, realRoot, manifest.polaroid, "polaroid")
    : null;

  return { manifest, heroPath, logoPath, polaroidPath, root };
}
