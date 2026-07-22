/**
 * U3 spike client (Node, not Tauri): shell → core boundary without a second injector.
 *
 * Usage:
 *   node scripts/windows/shell-probe-client.mjs list
 *   node scripts/windows/shell-probe-client.mjs doctor
 *   node scripts/windows/shell-probe-client.mjs kick
 *   node scripts/windows/shell-probe-client.mjs all
 */
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CONTROL_TOKEN_HEADER = "x-codex-skin-token";
const DEFAULT_CONTROL_PORT = 9336;
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const cliPath = join(repoRoot, "packages", "core", "cli.mjs");

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

async function readTextTrim(p) {
  try {
    const text = await readFile(p, "utf8");
    return text.replace(/^﻿/, "").trim();
  } catch {
    return null;
  }
}

function resolveStateRoot() {
  const local = process.env.LOCALAPPDATA;
  if (!local) {
    throw new Error("LOCALAPPDATA is not set (Windows-only shell probe)");
  }
  return join(local, "CodexDreamSkin");
}

/**
 * @param {string} stateRoot
 * @returns {Promise<{ port: number, token: string|null, stateRoot: string }>}
 */
async function resolveControl(stateRoot) {
  const portRaw = await readTextTrim(join(stateRoot, "control.port"));
  const portNum = Number(portRaw);
  const port =
    Number.isInteger(portNum) && portNum >= 1024 && portNum <= 65535
      ? portNum
      : DEFAULT_CONTROL_PORT;
  const token = await readTextTrim(join(stateRoot, "control.token"));
  return { port, token: token || null, stateRoot };
}

/**
 * Spawn core CLI and parse stdout JSON.
 * @param {string[]} args
 */
async function runCliJson(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      cwd: repoRoot,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        const err = new Error(
          stderr.trim() || stdout.trim() || `cli exit ${code}`,
        );
        err.code = code ?? 1;
        err.stderr = stderr;
        err.stdout = stdout;
        reject(err);
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (parseError) {
        const err = new Error(
          `CLI stdout is not JSON: ${String(parseError?.message || parseError)}`,
        );
        err.stdout = stdout;
        err.stderr = stderr;
        reject(err);
      }
    });
  });
}

async function cmdList() {
  const result = await runCliJson(["list"]);
  const themes = Array.isArray(result?.themes) ? result.themes : [];
  return {
    ok: true,
    count: typeof result?.count === "number" ? result.count : themes.length,
    themes: themes.map((t) => ({
      id: t?.id ?? null,
      name: t?.name ?? null,
    })),
  };
}

async function cmdDoctor() {
  const doctor = await runCliJson(["doctor"]);
  return {
    ok: true,
    fresh: Boolean(doctor?.injectorPathFreshness?.fresh),
    injectorAlive: Boolean(doctor?.dreamSkin?.injectorAlive),
    control: doctor?.control ?? null,
    themeCount: doctor?.themeCount ?? null,
  };
}

async function cmdKick() {
  let stateRoot;
  try {
    stateRoot = resolveStateRoot();
  } catch (error) {
    return {
      ok: false,
      reason: "no-localappdata",
      detail: String(error?.message || error),
    };
  }

  const { port, token } = await resolveControl(stateRoot);
  if (!token) {
    return {
      ok: false,
      reason: "token-missing",
      port,
      stateRoot,
    };
  }

  try {
    const response = await fetch(`http://127.0.0.1:${port}/kick`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CONTROL_TOKEN_HEADER]: token,
      },
      body: "{}",
      signal: AbortSignal.timeout(4000),
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 409 || body?.reason === "paused") {
      return {
        ok: false,
        reason: "paused",
        status: response.status,
        body,
        port,
      };
    }
    return {
      ok: Boolean(response.ok && body?.ok),
      status: response.status,
      body,
      port,
      reason:
        response.ok && body?.ok
          ? undefined
          : body?.reason || `http-${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unreachable",
      port,
      detail: String(error?.message || error),
    };
  }
}

async function main() {
  const command = process.argv[2] || "help";
  if (!["list", "doctor", "kick", "all", "help"].includes(command)) {
    printJson({ ok: false, reason: "unknown-command", command });
    process.exitCode = 1;
    return;
  }
  if (command === "help") {
    printJson({
      ok: true,
      usage: [
        "node scripts/windows/shell-probe-client.mjs list",
        "node scripts/windows/shell-probe-client.mjs doctor",
        "node scripts/windows/shell-probe-client.mjs kick",
        "node scripts/windows/shell-probe-client.mjs all",
      ],
    });
    return;
  }

  if (command === "list") {
    try {
      printJson(await cmdList());
    } catch (error) {
      if (error?.stderr) process.stderr.write(String(error.stderr));
      printJson({
        ok: false,
        reason: "cli-failed",
        detail: String(error?.message || error),
      });
      process.exitCode = error?.code || 1;
    }
    return;
  }

  if (command === "doctor") {
    try {
      printJson(await cmdDoctor());
    } catch (error) {
      if (error?.stderr) process.stderr.write(String(error.stderr));
      printJson({
        ok: false,
        reason: "cli-failed",
        detail: String(error?.message || error),
      });
      process.exitCode = error?.code || 1;
    }
    return;
  }

  if (command === "kick") {
    const result = await cmdKick();
    printJson(result);
    if (!result.ok) {
      process.exitCode =
        result.reason === "no-localappdata" ? 1 : 2;
    }
    return;
  }

  // all: list + doctor + kick (report each; kick failure does not spawn injector)
  const out = { ok: true, list: null, doctor: null, kick: null };
  try {
    out.list = await cmdList();
  } catch (error) {
    if (error?.stderr) process.stderr.write(String(error.stderr));
    out.list = {
      ok: false,
      reason: "cli-failed",
      detail: String(error?.message || error),
    };
    out.ok = false;
  }
  try {
    out.doctor = await cmdDoctor();
  } catch (error) {
    if (error?.stderr) process.stderr.write(String(error.stderr));
    out.doctor = {
      ok: false,
      reason: "cli-failed",
      detail: String(error?.message || error),
    };
    out.ok = false;
  }
  out.kick = await cmdKick();
  if (!out.kick.ok) out.ok = false;
  printJson(out);
  if (!out.ok) {
    process.exitCode =
      out.list?.reason === "cli-failed" || out.doctor?.reason === "cli-failed"
        ? 1
        : out.kick?.reason === "no-localappdata"
          ? 1
          : 2;
  }
}

main().catch((error) => {
  process.stderr.write(`${String(error?.stack || error)}\n`);
  process.exitCode = 1;
});
