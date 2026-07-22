/**
 * Pure probe-kit unit tests (no WebSocket / CDP).
 * Run: node scripts/windows/lib/probe-kit.test.mjs
 */
import {
  DEFAULT_CDP_PORT,
  validatedWs,
  buildReport,
  finalizePass,
} from "./probe-kit.mjs";

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

function assertThrows(fn, msg) {
  let threw = false;
  let error = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    error = err;
  }
  assert(threw, msg);
  return error;
}

// Constants
assertEqual(DEFAULT_CDP_PORT, 9335, "DEFAULT_CDP_PORT === 9335");

// validatedWs — accept loopback ws on matching port
{
  const url = "ws://127.0.0.1:9335/devtools/page/abc";
  assertEqual(validatedWs(url, 9335), url, "validatedWs accepts 127.0.0.1 matching port");
}

// validatedWs — reject non-loopback
{
  const err = assertThrows(
    () => validatedWs("ws://example.com:9335/devtools/page/x", 9335),
    "validatedWs rejects non-loopback host",
  );
  assert(
    String(err?.message || "").includes("Rejected debugger URL"),
    "validatedWs non-loopback error message mentions Rejected debugger URL",
  );
}

// validatedWs — reject wrong port
{
  assertThrows(
    () => validatedWs("ws://127.0.0.1:9336/devtools/page/x", 9335),
    "validatedWs rejects wrong port",
  );
}

// validatedWs — reject non-ws protocol
{
  assertThrows(
    () => validatedWs("wss://127.0.0.1:9335/devtools/page/x", 9335),
    "validatedWs rejects wss protocol",
  );
}

// validatedWs — reject localhost (kit is 127.0.0.1-only, unlike cdp-url-guard)
{
  assertThrows(
    () => validatedWs("ws://localhost:9335/devtools/page/x", 9335),
    "validatedWs rejects localhost (strict 127.0.0.1 only)",
  );
}

// buildReport defaults
{
  const report = buildReport();
  assertEqual(report.pass, false, "buildReport default pass=false");
  assertEqual(report.port, DEFAULT_CDP_PORT, "buildReport default port");
  assert(typeof report.startedAt === "string" && report.startedAt.length > 0, "buildReport startedAt set");
  assert(report.checks && typeof report.checks === "object", "buildReport checks object");
  assert(Array.isArray(report.notes), "buildReport notes array");
}

// buildReport custom opts
{
  const report = buildReport({ port: 9444, startedAt: "2026-01-01T00:00:00.000Z" });
  assertEqual(report.port, 9444, "buildReport custom port");
  assertEqual(report.startedAt, "2026-01-01T00:00:00.000Z", "buildReport custom startedAt");
}

// finalizePass — all required keys truthy → pass
{
  const report = buildReport();
  report.checks = { a: true, b: 1, c: "ok" };
  finalizePass(report, ["a", "b", "c"]);
  assertEqual(report.pass, true, "finalizePass all truthy: pass");
  assertEqual(report.failed.length, 0, "finalizePass all truthy: failed empty");
  assertEqual(report.notes.length, 0, "finalizePass all truthy: no notes");
}

// finalizePass — missing required keys → pass false (failure case)
{
  const report = buildReport();
  report.checks = { a: true, b: false, c: null };
  finalizePass(report, ["a", "b", "c", "d"]);
  assertEqual(report.pass, false, "finalizePass missing keys: pass false");
  assertEqual(report.failed.join(","), "b,c,d", "finalizePass missing keys: failed list");
  assert(
    report.notes.some((n) => String(n).includes("failed checks")),
    "finalizePass missing keys: notes mention failed checks",
  );
}

// finalizePass — empty requiredKeys → pass true
{
  const report = buildReport();
  report.checks = {};
  finalizePass(report, []);
  assertEqual(report.pass, true, "finalizePass empty required: pass");
  assertEqual(report.failed.length, 0, "finalizePass empty required: failed empty");
}

// finalizePass mutates and returns same report
{
  const report = buildReport();
  report.checks = { ok: true };
  const ret = finalizePass(report, ["ok"]);
  assert(ret === report, "finalizePass returns same report object");
}

if (failed > 0) {
  console.error(`probe-kit.test: ${failed} failure(s)`);
  process.exit(1);
}
console.log("probe-kit.test: pass");
