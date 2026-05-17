import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

type DiscordNotifyBody = {
  content?: string;
  embeds?: unknown[];
  target?: "levels" | "records";
};

/**
 * Returns true if the hostname is trusted:
 *   - *.vercel.app / vercel.app
 *   - *.replit.app / *.repl.co  (Replit published + dev domains)
 *   - Entries in APP_DOMAINS env var (comma-separated)
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

function hostFromUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedOrigin(req: Request): boolean {
  const originHost = hostFromUrl(req.get("origin") ?? undefined);
  const refererHost = hostFromUrl(req.get("referer") ?? undefined);
  const hostHeader = (req.get("host") ?? "").split(":")[0]?.toLowerCase() ?? "";

  if (originHost) return isTrustedHost(originHost);
  if (refererHost) return isTrustedHost(refererHost);
  if (hostHeader) return isTrustedHost(hostHeader);
  return process.env["NODE_ENV"] !== "production";
}

/**
 * Tiny in-memory token bucket per IP. Resets each window.
 * 30 requests / minute / IP is plenty for the panel UI and well below
 * Discord's own webhook rate limits.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: Request): { ok: boolean; retryAfter?: number } {
  const ip = (
    req.ip ||
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown"
  ).toString();
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipHits) {
    if (entry.resetAt <= now) ipHits.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS).unref?.();

router.post("/discord/notify", async (req: Request, res: Response) => {
  if (!isAllowedOrigin(req)) {
    req.log.warn(
      { origin: req.get("origin"), referer: req.get("referer"), host: req.get("host") },
      "Rejected Discord notify from disallowed origin",
    );
    res.status(403).json({ ok: false, error: "Forbidden origin" });
    return;
  }

  const limit = rateLimit(req);
  if (!limit.ok) {
    if (limit.retryAfter) res.setHeader("Retry-After", String(limit.retryAfter));
    res.status(429).json({ ok: false, error: "Rate limit exceeded" });
    return;
  }

  const body = (req.body ?? {}) as DiscordNotifyBody;
  const target = body.target === "records" ? "records" : "levels";

  const webhookUrl =
    target === "records"
      ? process.env["DISCORD_WEBHOOKRECORDS_URL"] || process.env["DISCORD_WEBHOOK_URL"]
      : process.env["DISCORD_WEBHOOK_URL"];

  if (!webhookUrl) {
    req.log.warn({ target }, "Discord webhook not configured; dropping notification");
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
      req.log.warn(
        { status: response.status, target, body: text.slice(0, 500) },
        "Discord webhook returned non-2xx",
      );
      res.status(502).json({
        ok: false,
        error: `Discord webhook responded with ${response.status}`,
      });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err, target }, "Failed to forward Discord notification");
    res.status(502).json({ ok: false, error: "Failed to forward notification to Discord" });
  }
});

export default router;
