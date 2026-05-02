/**
 * Vercel Serverless Function: POST /api/discord/notify
 *
 * Recibe { content?, embeds?, target? } desde el cliente y reenvía
 * al webhook de Discord correspondiente. Las URLs del webhook nunca
 * salen al navegador.
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

/* ── helpers ──────────────────────────────────────────────────────────── */

function headerStr(v: string | string[] | undefined): string {
  if (!v) return "";
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

function hostnameFromUrl(url: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

/* ── origin validation ────────────────────────────────────────────────── */

/**
 * Returns true if the hostname is explicitly trusted:
 *   - *.vercel.app / vercel.app
 *   - *.replit.app / *.repl.co
 *   - entries in APP_DOMAINS env var (comma-separated)
 *   - localhost / 127.0.0.1 in non-production
 */
function isTrustedHost(h: string): boolean {
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

function isAllowedOrigin(req: Req): { allowed: boolean; reason: string } {
  // Normalise headers
  const originRaw  = headerStr(req.headers["origin"]);
  const refererRaw = headerStr(req.headers["referer"]);
  const hostRaw    = headerStr(req.headers["host"]).split(":")[0].toLowerCase();

  const originHost  = hostnameFromUrl(originRaw);
  const refererHost = hostnameFromUrl(refererRaw);

  // ── PRIMARY CHECK: same-origin ─────────────────────────────────────
  // If Origin (or Referer) matches the function's own Host header this
  // is a same-origin request from our site — always allow regardless of
  // TLD. This correctly handles custom Vercel domains (e.g. bufferteam.com)
  // and any other custom domain set in the Vercel dashboard.
  if (hostRaw) {
    if (originHost  && originHost  === hostRaw) return { allowed: true,  reason: "same-origin (origin==host)" };
    if (refererHost && refererHost === hostRaw) return { allowed: true,  reason: "same-origin (referer==host)" };
  }

  // ── SECONDARY CHECK: known-trusted TLD allowlist ───────────────────
  if (originHost  && isTrustedHost(originHost))  return { allowed: true,  reason: `trusted-origin: ${originHost}` };
  if (refererHost && isTrustedHost(refererHost)) return { allowed: true,  reason: `trusted-referer: ${refererHost}` };

  // ── TERTIARY: no Origin/Referer — check Host alone (proxy / same-origin no-origin) ──
  if (!originHost && !refererHost && hostRaw && isTrustedHost(hostRaw)) {
    return { allowed: true, reason: `trusted-host: ${hostRaw}` };
  }

  // Fail-open in development, fail-closed in production.
  if (process.env["NODE_ENV"] !== "production") {
    return { allowed: true, reason: "dev-open" };
  }

  return {
    allowed: false,
    reason: `blocked — origin: ${originRaw || "(none)"}, referer: ${refererRaw || "(none)"}, host: ${hostRaw || "(none)"}`,
  };
}

/* ── rate limit (best-effort; resets on cold start) ──────────────────── */

const WINDOW_MS     = 60_000;
const MAX_PER_WINDOW = 30;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(req: Req): { ok: boolean; retryAfter?: number } {
  const xff = req.headers["x-forwarded-for"];
  const ip  = headerStr(xff).split(",")[0].trim() || "unknown";
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
  // ── Step 1: entry log ──────────────────────────────────────────────
  console.log("[discord/notify] request received", {
    method:  req.method,
    origin:  headerStr(req.headers["origin"])  || "(none)",
    referer: headerStr(req.headers["referer"]) || "(none)",
    host:    headerStr(req.headers["host"])    || "(none)",
    vercel:  process.env["VERCEL"] ?? "(not set)",
    nodeEnv: process.env["NODE_ENV"] ?? "(not set)",
    hasWebhook:        !!process.env["DISCORD_WEBHOOK_URL"],
    hasRecordsWebhook: !!process.env["DISCORD_WEBHOOKRECORDS_URL"],
  });

  // ── Step 2: method guard ───────────────────────────────────────────
  if (req.method !== "POST") {
    console.warn("[discord/notify] wrong method:", req.method);
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  // ── Step 3: origin check ───────────────────────────────────────────
  const originResult = isAllowedOrigin(req);
  console.log("[discord/notify] origin check →", originResult);

  if (!originResult.allowed) {
    res.status(403).json({ ok: false, error: "Forbidden origin", detail: originResult.reason });
    return;
  }

  // ── Step 4: rate limit ─────────────────────────────────────────────
  const limit = checkRateLimit(req);
  if (!limit.ok) {
    if (limit.retryAfter) res.setHeader("Retry-After", String(limit.retryAfter));
    console.warn("[discord/notify] rate limited");
    res.status(429).json({ ok: false, error: "Rate limit exceeded" });
    return;
  }

  // ── Step 5: parse body ─────────────────────────────────────────────
  const body = (req.body ?? {}) as {
    content?: unknown;
    embeds?: unknown;
    target?: unknown;
  };

  const target     = body.target === "records" ? "records" : "levels";
  const webhookUrl =
    target === "records"
      ? process.env["DISCORD_WEBHOOKRECORDS_URL"] || process.env["DISCORD_WEBHOOK_URL"]
      : process.env["DISCORD_WEBHOOK_URL"];

  // ── Step 6: env var check ──────────────────────────────────────────
  if (!webhookUrl) {
    console.error("[discord/notify] WEBHOOK NOT CONFIGURED — set DISCORD_WEBHOOK_URL (and optionally DISCORD_WEBHOOKRECORDS_URL) in Vercel environment variables", { target });
    res.status(503).json({ ok: false, error: "Discord webhook not configured" });
    return;
  }

  // ── Step 7: validate payload ───────────────────────────────────────
  const content =
    typeof body.content === "string" && body.content.length > 0
      ? body.content.slice(0, 1900)
      : undefined;
  const embeds =
    Array.isArray(body.embeds) && body.embeds.length > 0
      ? body.embeds.slice(0, 10)
      : undefined;

  if (!content && !embeds) {
    console.warn("[discord/notify] empty payload — content and embeds are both missing/empty");
    res.status(400).json({ ok: false, error: "Either content or embeds is required" });
    return;
  }

  const payload: Record<string, unknown> = {};
  if (content) payload["content"] = content;
  if (embeds)  payload["embeds"]  = embeds;

  // ── Step 8: forward to Discord ─────────────────────────────────────
  console.log("[discord/notify] forwarding to Discord", { target, hasContent: !!content, embedCount: embeds?.length ?? 0 });

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[discord/notify] Discord returned error", {
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

    console.log("[discord/notify] Discord accepted the message", { target, status: response.status });
    res.json({ ok: true });
  } catch (err) {
    console.error("[discord/notify] fetch failed", { err: String(err), target });
    res.status(502).json({ ok: false, error: "Failed to forward notification to Discord" });
  }
}
