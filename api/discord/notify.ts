/**
 * Vercel Serverless Function: POST /api/discord/notify
 *
 * Recibe { content?, embeds?, target? } desde el cliente y reenvía
 * al webhook de Discord correspondiente. Las URLs del webhook nunca
 * salen al navegador.
 *
 * Compatibilidad: Vercel (serverless) + Express (Replit dev, via api-server).
 */

/* ── tipos mínimos compatibles con el runtime de Vercel ──────────────── */
type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

/* ── origin validation ────────────────────────────────────────────────── */

/**
 * Returns true if the hostname is one we trust:
 *   - *.vercel.app / vercel.app
 *   - *.replit.app / *.repl.co  (Replit published + dev domains)
 *   - entries in APP_DOMAINS env var (comma-separated)
 *   - localhost / 127.0.0.1 in non-production
 */
function isTrustedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().split(":")[0] ?? "";
  if (!h) return false;

  if (h === "vercel.app" || h.endsWith(".vercel.app")) return true;
  if (h.endsWith(".replit.app") || h.endsWith(".repl.co")) return true;

  if (process.env["NODE_ENV"] !== "production") {
    if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0") return true;
  }

  const appDomains = process.env["APP_DOMAINS"] ?? "";
  for (const d of appDomains.split(",")) {
    if (d.trim().toLowerCase() === h) return true;
  }

  return false;
}

function hostFromHeader(value: string | string[] | undefined): string | null {
  const str = Array.isArray(value) ? value[0] : value;
  if (!str) return null;
  try {
    return new URL(str).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedOrigin(req: Req): boolean {
  const originHost = hostFromHeader(req.headers["origin"]);
  const refererHost = hostFromHeader(req.headers["referer"]);
  const hostHeader = (() => {
    const v = req.headers["host"];
    return ((Array.isArray(v) ? v[0] : v) ?? "").split(":")[0].toLowerCase();
  })();

  if (originHost) return isTrustedHost(originHost);
  if (refererHost) return isTrustedHost(refererHost);
  // No Origin / Referer → trust if the Host header is ours (same-origin via proxy)
  if (hostHeader) return isTrustedHost(hostHeader);
  // Nothing at all → open in dev, closed in prod
  return process.env["NODE_ENV"] !== "production";
}

/* ── rate limit (best-effort; resets on cold start) ──────────────────── */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(req: Req): { ok: boolean; retryAfter?: number } {
  const xff = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(xff) ? xff[0] : xff ?? "unknown")
    .split(",")[0]
    .trim();
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

/* ── handler ──────────────────────────────────────────────────────────── */

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  if (!isAllowedOrigin(req)) {
    console.warn("[discord/notify] rejected origin", {
      origin: req.headers["origin"],
      referer: req.headers["referer"],
      host: req.headers["host"],
    });
    res.status(403).json({ ok: false, error: "Forbidden origin" });
    return;
  }

  const limit = checkRateLimit(req);
  if (!limit.ok) {
    if (limit.retryAfter) res.setHeader("Retry-After", String(limit.retryAfter));
    res.status(429).json({ ok: false, error: "Rate limit exceeded" });
    return;
  }

  const body = (req.body ?? {}) as {
    content?: unknown;
    embeds?: unknown;
    target?: unknown;
  };

  const target = body.target === "records" ? "records" : "levels";
  const webhookUrl =
    target === "records"
      ? process.env["DISCORD_WEBHOOKRECORDS_URL"] || process.env["DISCORD_WEBHOOK_URL"]
      : process.env["DISCORD_WEBHOOK_URL"];

  if (!webhookUrl) {
    console.warn("[discord/notify] webhook not configured", { target });
    res.status(503).json({ ok: false, error: "Discord webhook not configured" });
    return;
  }

  const content =
    typeof body.content === "string" ? body.content.slice(0, 1900) : undefined;
  const embeds =
    Array.isArray(body.embeds) && body.embeds.length > 0
      ? body.embeds.slice(0, 10)
      : undefined;

  if (!content && !embeds) {
    res.status(400).json({ ok: false, error: "Either content or embeds is required" });
    return;
  }

  const payload: Record<string, unknown> = {};
  if (content) payload["content"] = content;
  if (embeds) payload["embeds"] = embeds;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.warn("[discord/notify] Discord responded with error", {
        status: response.status,
        target,
        body: text.slice(0, 500),
      });
      res.status(502).json({
        ok: false,
        error: `Discord webhook responded with ${response.status}`,
      });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("[discord/notify] failed to forward", { err, target });
    res.status(502).json({ ok: false, error: "Failed to forward notification to Discord" });
  }
}
