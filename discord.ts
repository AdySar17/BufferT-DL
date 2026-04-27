import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/**
 * POST /api/discord/notify
 * Body: { content?: string, embeds?: object[], target?: "levels" | "records" }
 *
 * Reenvía a Discord usando el webhook que toque:
 *   - target="levels"  (por defecto) → DISCORD_WEBHOOK_URL
 *   - target="records"               → DISCORD_WEBHOOKRECORDS_URL
 *
 * Las URLs viven en variables de entorno y NUNCA se envían al cliente.
 */
router.post("/discord/notify", async (req, res) => {
  const body = (req.body ?? {}) as {
    content?: unknown;
    embeds?: unknown;
    target?: unknown;
  };

  const target = body.target === "records" ? "records" : "levels";
  const envKey = target === "records"
    ? "DISCORD_WEBHOOKRECORDS_URL"
    : "DISCORD_WEBHOOK_URL";
  const url = process.env[envKey];
  if (!url) {
    logger.warn({ envKey }, "Webhook de Discord no configurado");
    return res.status(503).json({ ok: false, error: "webhook_not_configured" });
  }

  const rawContent = typeof body.content === "string"
    ? body.content.slice(0, 1900).trim()
    : "";
  const embeds = Array.isArray(body.embeds) ? body.embeds.slice(0, 10) : undefined;

  if (!rawContent && !embeds) {
    return res.status(400).json({ ok: false, error: "empty_payload" });
  }

  const payload: Record<string, unknown> = {
    allowed_mentions: { parse: [] },
  };
  if (rawContent) payload["content"] = rawContent;
  if (embeds) payload["embeds"] = embeds;

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const text = await r.text().catch(() => "");
      logger.warn({ status: r.status, text, target }, "Discord webhook respondió con error");
      return res.status(502).json({ ok: false, status: r.status });
    }
    return res.json({ ok: true });
  } catch (err) {
    logger.error({ err, target }, "Fallo al reenviar al webhook de Discord");
    return res.status(500).json({ ok: false, error: "forward_failed" });
  }
});

export default router;
