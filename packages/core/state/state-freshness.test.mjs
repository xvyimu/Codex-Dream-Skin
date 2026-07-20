/**
 * Pure-function gate for injector path freshness (no CDP / network).
 * Run: node packages/core/state/state-freshness.test.mjs  |  npm run test:freshness
 */
import { evaluateInjectorPathFreshness } from "./state-freshness.mjs";

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:", msg);
  }
}

const basePath = "C:\\Apps\\CodexDreamSkin\\versions\\1.3.25\\scripts\\injector.mjs";
const basePathAltCase = "c:\\apps\\codexdreamskin\\versions\\1.3.25\\scripts\\injector.mjs";
const otherPath = "C:\\Apps\\CodexDreamSkin\\versions\\old\\scripts\\injector.mjs";

// 1. path same (case-insensitive) + runtimeId same → ok
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: basePathAltCase,
    expectedRuntimeId: "1.3.25-107b0e",
    actualRuntimeId: "1.3.25-107B0E",
  });
  assert(d.fresh === true, "path+id match → fresh=true");
  assert(d.reason === "ok", "path+id match → reason=ok");
}

// 2. path same + runtimeId different → runtimeId-drift
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: basePath,
    expectedRuntimeId: "1.3.25-107b0e",
    actualRuntimeId: "1.3.25-d14cf4",
  });
  assert(d.fresh === false, "runtimeId mismatch → fresh=false");
  assert(d.reason === "runtimeId-drift", "runtimeId mismatch → runtimeId-drift");
}

// 3. path different + runtime same → injector-path-drift
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: otherPath,
    expectedRuntimeId: "1.3.25-107b0e",
    actualRuntimeId: "1.3.25-107b0e",
  });
  assert(d.fresh === false, "path mismatch → fresh=false");
  assert(d.reason === "injector-path-drift", "path mismatch → injector-path-drift");
}

// 4. path same + expectedRuntimeId missing → expected-runtimeId-missing
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: basePath,
    expectedRuntimeId: null,
    actualRuntimeId: "1.3.25-107b0e",
  });
  assert(d.fresh === false, "expected missing → fresh=false");
  assert(
    d.reason === "expected-runtimeId-missing",
    "expected missing → expected-runtimeId-missing",
  );
}

// 5. path same + actualRuntimeId missing → actual-runtimeId-missing
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: basePath,
    expectedRuntimeId: "1.3.25-107b0e",
    actualRuntimeId: null,
  });
  assert(d.fresh === false, "actual missing → fresh=false");
  assert(
    d.reason === "actual-runtimeId-missing",
    "actual missing → actual-runtimeId-missing",
  );
}

// 6. path same + both missing → expected-runtimeId-missing (expected first)
{
  const d = evaluateInjectorPathFreshness({
    expectedInjectorPath: basePath,
    actualInjectorPath: basePath,
    expectedRuntimeId: null,
    actualRuntimeId: null,
  });
  assert(d.fresh === false, "both missing → fresh=false");
  assert(
    d.reason === "expected-runtimeId-missing",
    "both missing → expected-runtimeId-missing first",
  );
}

if (failed) {
  console.error(`\n${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("\nall passed");
