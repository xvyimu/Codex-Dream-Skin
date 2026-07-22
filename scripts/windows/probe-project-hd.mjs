/**
 * Live CDP probe: project-route HD art + bubble mode health.
 * Assert-style (not snapshot-only): default pass=false; fail → exit 2; CDP down → exit 1.
 * Run: node scripts/windows/probe-project-hd.mjs
 */
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  DEFAULT_CDP_PORT,
  buildReport,
  connectCdp,
  finalizePass,
} from "./lib/probe-kit.mjs";

const PORT = DEFAULT_CDP_PORT;
const OUT = join(
  process.env.LOCALAPPDATA || "",
  "CodexDreamSkin",
  "probe-project-hd-result.json",
);

async function main() {
  const report = buildReport({ port: PORT });

  const { session, reportExtras } = await connectCdp({ port: PORT });
  report.targetId = reportExtras.targetId;
  report.title = reportExtras.title;

  try {
    const snap = await session.evaluate(`(() => {
      const root = document.documentElement;
      const c = root.className || "";
      const cs = getComputedStyle(root);
      const body = document.body ? getComputedStyle(document.body) : null;
      const task = document.querySelector(".dream-task");
      const before = task ? getComputedStyle(task, "::before") : null;
      const user = document.querySelector(
        '[data-message-author-role*="user"], [data-user-message-bubble], [class*="user-message"]',
      );
      const asst = document.querySelector(
        '[data-message-author-role*="assistant"], [data-local-conversation-final-assistant], [class*="assistant-message"]',
      );
      const u = user ? getComputedStyle(user) : null;
      const a = asst ? getComputedStyle(asst) : null;
      return {
        dark: c.includes("dream-theme-dark"),
        light: c.includes("dream-theme-light"),
        hasSkin: c.includes("codex-dream-skin"),
        wide: c.includes("dream-art-wide"),
        bubbleCard: c.includes("dream-bubble-card"),
        bubbleBorderless: c.includes("dream-bubble-borderless"),
        bubbleAttr: root.getAttribute("data-dream-bubble-style"),
        surfaceLuma: window.__CODEX_DREAM_SKIN_STATE__?.config?.surfaceLuma ?? null,
        bubbleStyleCfg: window.__CODEX_DREAM_SKIN_STATE__?.config?.bubbleStyle ?? null,
        taskAmbient: cs.getPropertyValue("--dream-task-ambient-opacity").trim(),
        taskEdge: cs.getPropertyValue("--dream-task-immersive-edge").trim(),
        bodyBg: body?.backgroundColor || null,
        bodyImg: (body?.backgroundImage || "").slice(0, 48),
        hasTask: Boolean(task),
        taskBeforeOpacity: before?.opacity || null,
        taskBeforeSize: before?.backgroundSize || null,
        userBorder: u ? u.borderTopWidth + " " + u.borderTopStyle : null,
        userRadius: u?.borderRadius || null,
        asstBorder: a ? a.borderTopWidth + " " + a.borderTopStyle : null,
        asstRadius: a?.borderRadius || null,
        hasUser: Boolean(user),
        hasAsst: Boolean(asst),
      };
    })()`);

    report.snapshot = snap;

    report.checks.hasSkin = Boolean(snap.hasSkin);
    report.checks.darkClass = Boolean(snap.dark);
    report.checks.notLightClass = !snap.light;
    report.checks.surfaceLumaPresent =
      typeof snap.surfaceLuma === "number" && Number.isFinite(snap.surfaceLuma);
    // Night themes should stay dark when surfaceLuma is present and low.
    report.checks.surfaceImpliesDark =
      !report.checks.surfaceLumaPresent || snap.surfaceLuma <= 0.45
        ? Boolean(snap.dark) && !snap.light
        : true;
    report.checks.bubbleModeKnown =
      Boolean(snap.bubbleBorderless) || Boolean(snap.bubbleCard);
    // When project task chrome is mounted, expect cover-ish art sizing (HD path).
    if (snap.hasTask) {
      const size = String(snap.taskBeforeSize || "").toLowerCase();
      report.checks.taskArtSized =
        size.includes("cover") || size.includes("%") || size.includes("px");
      const op = Number.parseFloat(snap.taskBeforeOpacity);
      report.checks.taskAmbientVisible =
        Number.isFinite(op) ? op >= 0.2 && op <= 1 : true;
    }

    const required = [
      "hasSkin",
      "darkClass",
      "notLightClass",
      "surfaceLumaPresent",
      "surfaceImpliesDark",
      "bubbleModeKnown",
    ];
    if (snap.hasTask) {
      required.push("taskArtSized", "taskAmbientVisible");
    }

    finalizePass(report, required);
    if (report.checks.surfaceLumaPresent) {
      report.notes.push(`surfaceLuma=${snap.surfaceLuma}`);
    } else {
      report.notes.push(
        "surfaceLuma missing — injector may not pass palette.surface (#rrggbb only for luma)",
      );
    }
    if (snap.hasTask) {
      report.notes.push(
        `task before size=${snap.taskBeforeSize} opacity=${snap.taskBeforeOpacity}`,
      );
    } else {
      report.notes.push(
        "no .dream-task in DOM — open a project/task route for full HD checks",
      );
    }
  } finally {
    session.close();
  }

  report.finishedAt = new Date().toISOString();
  try {
    if (process.env.LOCALAPPDATA) {
      await writeFile(OUT, JSON.stringify(report, null, 2), "utf8");
    }
  } catch {
    // ignore write errors (still print)
  }
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exitCode = 2;
}

main().catch((error) => {
  console.error(String(error?.stack || error));
  process.exitCode = 1;
});
