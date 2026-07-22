import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parsePalette,
  parsePaletteWithSurface,
  safeParsePalette,
  parseDoctorSlice,
  parseControlError,
  isCssColor,
  parseKickResult,
  safeParseKickResult,
  parseThemeInjectConfig,
  parseThemeCatalogEntry,
  EARLY_GENERATION_KEY,
  EARLY_APPLIED_KEY,
} from "./index.js";

describe("isCssColor", () => {
  it("accepts hex and functional colors", () => {
    assert.equal(isCssColor("#0a0a0a"), true);
    assert.equal(isCssColor("#abc"), true);
    assert.equal(isCssColor("oklab(0.2 0 0)"), true);
  });
  it("rejects empty and injection-ish", () => {
    assert.equal(isCssColor(""), false);
    assert.equal(isCssColor("red;}"), false);
  });
});

describe("parsePalette", () => {
  it("accepts genshin-night-like palette", () => {
    const p = parsePalette({
      accent: "#E0B458",
      secondary: "#8a7a50",
      surface: "#0a0a0a",
      text: "#F0E6C8",
    });
    assert.equal(p.surface, "#0a0a0a");
  });

  it("allows partial palette (accent only) for legacy paths", () => {
    const p = parsePalette({ accent: "#E0B458" });
    assert.equal(p.accent, "#E0B458");
    assert.equal(p.surface, undefined);
  });

  it("rejects illegal color", () => {
    const r = safeParsePalette({ surface: "not-a-color" });
    assert.equal(r.success, false);
  });

  it("parsePaletteWithSurface requires surface", () => {
    assert.throws(() => parsePaletteWithSurface({ accent: "#fff" }), /surface/i);
    assert.equal(
      parsePaletteWithSurface({ accent: "#fff", surface: "#111111" }).surface,
      "#111111",
    );
  });
});

describe("doctor slice", () => {
  it("parses control + freshness subset", () => {
    const d = parseDoctorSlice({
      control: { port: 9336, tokenPresent: true },
      injectorPathFreshness: { fresh: true, reason: "ok" },
      themeCount: 11,
      skippedThemeCount: 0,
      extraIgnored: true,
    });
    assert.equal(d.control?.tokenPresent, true);
    assert.equal(d.injectorPathFreshness?.fresh, true);
    assert.equal(d.themeCount, 11);
  });
});

describe("control error", () => {
  it("parses token-required body", () => {
    const e = parseControlError({
      ok: false,
      reason: "token-required",
      detail: "provide header x-codex-skin-token",
    });
    assert.equal(e.reason, "token-required");
  });
});

describe("inject / kick surface (W2)", () => {
  it("parses watch-kick success body", () => {
    const k = parseKickResult({
      ok: true,
      mode: "watch-kick",
      applied: 1,
      sessions: 1,
      fingerprint: "a".repeat(64),
      ms: 12,
      note: "applied",
      extra: true,
    });
    assert.equal(k.ok, true);
    assert.equal(k.applied, 1);
    assert.equal(k.fingerprint?.length, 64);
  });

  it("parses paused kick failure", () => {
    const k = parseKickResult({ ok: false, reason: "paused", ms: 1 });
    assert.equal(k.ok, false);
    assert.equal(k.reason, "paused");
  });

  it("rejects non-boolean ok", () => {
    const r = safeParseKickResult({ ok: "yes" });
    assert.equal(r.success, false);
  });

  it("parses theme inject config with bubbleStyle", () => {
    const t = parseThemeInjectConfig({
      id: "preset-arina-hashimoto",
      name: "桥本有菜",
      palette: { accent: "#E8A0BF", surface: "#1A1218" },
      bubbleStyle: "card",
      art: { focusX: 0.72, focusY: 0.45, safeArea: "left" },
    });
    assert.equal(t.bubbleStyle, "card");
    assert.equal(t.palette?.surface, "#1A1218");
  });

  it("parses catalog entry with data URL art", () => {
    const e = parseThemeCatalogEntry({
      key: "active",
      name: "A",
      config: { id: "a", palette: { accent: "#fff" } },
      artDataUrl: "data:image/png;base64,xx",
    });
    assert.equal(e.key, "active");
  });

  it("exports early-apply marker keys", () => {
    assert.equal(EARLY_GENERATION_KEY, "__CODEX_DREAM_SKIN_EARLY_GENERATION__");
    assert.equal(EARLY_APPLIED_KEY, "__CODEX_DREAM_SKIN_EARLY_APPLIED__");
  });
});
