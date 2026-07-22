import { z } from "zod";
import { paletteSchema } from "./palette.js";

/**
 * Inject / kick public surface (ADR 0004 · W2 expand).
 * Aligns with packages/runtime/scripts/injector.mjs watch-kick JSON
 * and payload-builder early-apply revision markers.
 * Dev-plane only — not shipped into versions/<id>.
 */

/** Conversation chrome preference folded into inject theme JSON. */
export const bubbleStyleSchema = z.enum(["borderless", "card"]);

export type BubbleStyle = z.infer<typeof bubbleStyleSchema>;

/**
 * Theme config shape carried in __DREAM_THEME_JSON__ (subset + bubbleStyle).
 * Injector-side loadTheme does not default-fill missing palette keys (TD-V5).
 */
export const themeInjectConfigSchema = z
  .object({
    id: z.string().min(1).max(80).optional(),
    name: z.string().min(1).max(120).optional(),
    brandSubtitle: z.string().max(80).optional(),
    tagline: z.string().max(160).optional(),
    image: z.string().max(240).optional(),
    appearance: z.enum(["auto", "light", "dark"]).optional(),
    art: z
      .object({
        focusX: z.number().min(0).max(1).nullable().optional(),
        focusY: z.number().min(0).max(1).nullable().optional(),
        safeArea: z.enum(["auto", "left", "right", "center", "none"]).optional(),
        taskMode: z.enum(["auto", "ambient", "banner", "off"]).optional(),
      })
      .passthrough()
      .optional(),
    palette: paletteSchema.optional(),
    bubbleStyle: bubbleStyleSchema.optional(),
  })
  .passthrough();

export type ThemeInjectConfig = z.infer<typeof themeInjectConfigSchema>;

/**
 * One F6 catalog entry (renderer setTheme/cycleTheme).
 * Catalog size is gated by MAX_THEME_CATALOG_ENTRIES (runtime budget module).
 */
export const themeCatalogEntrySchema = z
  .object({
    key: z.string().min(1),
    name: z.string().min(1),
    config: themeInjectConfigSchema,
    artDataUrl: z.string().startsWith("data:"),
  })
  .passthrough();

export type ThemeCatalogEntry = z.infer<typeof themeCatalogEntrySchema>;

/**
 * Kick / watch-kick response body (injector onKick + control-plane POST /kick).
 * Contract: ok / mode / applied / sessions / fingerprint / ms / errors / note
 * (docs/plans/injector-split-2026-07-22.md §4.3).
 */
export const kickResultSchema = z
  .object({
    ok: z.boolean(),
    mode: z.string().optional(),
    applied: z.number().int().nonnegative().optional(),
    sessions: z.number().int().nonnegative().optional(),
    fingerprint: z.string().nullable().optional(),
    ms: z.number().nonnegative().optional(),
    errors: z.array(z.string()).optional(),
    note: z.string().optional(),
    reason: z.string().optional(),
  })
  .passthrough();

export type KickResult = z.infer<typeof kickResultSchema>;

/** Early-apply markers written by earlyPayloadFor (payload-builder). */
export const EARLY_GENERATION_KEY = "__CODEX_DREAM_SKIN_EARLY_GENERATION__" as const;
export const EARLY_APPLIED_KEY = "__CODEX_DREAM_SKIN_EARLY_APPLIED__" as const;

export function parseKickResult(input: unknown): KickResult {
  return kickResultSchema.parse(input);
}

export function safeParseKickResult(input: unknown) {
  return kickResultSchema.safeParse(input);
}

export function parseThemeInjectConfig(input: unknown): ThemeInjectConfig {
  return themeInjectConfigSchema.parse(input);
}

export function parseThemeCatalogEntry(input: unknown): ThemeCatalogEntry {
  return themeCatalogEntrySchema.parse(input);
}
