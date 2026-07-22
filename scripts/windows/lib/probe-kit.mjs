// Shared CDP probe helpers for scripts/windows/*.mjs (dev-plane only).
// Not published into versions/<id>. Prefer this path over packages/probe-kit
// until a second consumer needs a workspace package.

export const DEFAULT_CDP_PORT = 9335;

/**
 * @param {string} url
 * @param {number} port
 * @returns {string}
 */
export function validatedWs(url, port) {
  const parsed = new URL(url);
  if (
    parsed.protocol !== "ws:" ||
    parsed.hostname !== "127.0.0.1" ||
    Number(parsed.port) !== port
  ) {
    throw new Error(`Rejected debugger URL: ${url}`);
  }
  return url;
}

/**
 * Minimal CDP session over global WebSocket (Node 20+).
 * Methods: open(), send(method, params?), evaluate(expression), close()
 */
export class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("ws open timeout")), 5000);
      this.ws.addEventListener(
        "open",
        () => {
          clearTimeout(t);
          resolve();
        },
        { once: true },
      );
      this.ws.addEventListener(
        "error",
        () => {
          clearTimeout(t);
          reject(new Error("ws open failed"));
        },
        { once: true },
      );
    });
    this.ws.addEventListener("message", (event) => {
      let msg;
      try {
        msg = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (!msg.id) return;
      const waiter = this.pending.get(msg.id);
      if (!waiter) return;
      clearTimeout(waiter.timeout);
      this.pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(msg.error.message));
      else waiter.resolve(msg.result);
    });
    await this.send("Runtime.enable");
    return this;
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`timeout ${method}`));
      }, 12000);
      this.pending.set(id, { resolve, reject, timeout });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    }
    return result.result?.value;
  }

  close() {
    try {
      this.ws.close();
    } catch {
      // ignore
    }
  }
}

/**
 * @param {{ port?: number, startedAt?: string }} [opts]
 * @returns {{ startedAt: string, port: number, pass: false, checks: {}, notes: [], ... }}
 */
export function buildReport(opts = {}) {
  return {
    startedAt: opts.startedAt || new Date().toISOString(),
    port: opts.port ?? DEFAULT_CDP_PORT,
    pass: false,
    checks: {},
    notes: [],
  };
}

/**
 * @param {object} report  — mutated: failed, pass, notes
 * @param {string[]} requiredKeys — keys in report.checks that must be truthy
 * @returns {object} report
 */
export function finalizePass(report, requiredKeys) {
  const failed = requiredKeys.filter((k) => !report.checks[k]);
  report.failed = failed;
  report.pass = failed.length === 0;
  if (!report.pass) {
    report.notes.push(`failed checks: ${failed.join(", ")}`);
  }
  return report;
}

/**
 * Connect to first app:// page on CDP port.
 * @param {{ port?: number }} [opts]
 * @returns {Promise<{ session: Cdp, page: object, reportExtras: { targetId, title } }>}
 * throws on CDP down / no page (caller maps to exit 1)
 */
export async function connectCdp(opts = {}) {
  const port = opts.port ?? DEFAULT_CDP_PORT;
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = list.find(
    (item) => item.type === "page" && String(item.url || "").startsWith("app://"),
  );
  if (!page) throw new Error("no app:// page");
  const session = await new Cdp(validatedWs(page.webSocketDebuggerUrl, port)).open();
  return {
    session,
    page,
    reportExtras: {
      targetId: page.id,
      title: page.title,
    },
  };
}
