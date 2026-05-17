/**
 * Vercel Serverless Function — POST /api/discord/notify
 *
 * Forwards a Discord notification payload to the configured webhook URL.
 * Env vars (set in Vercel dashboard + Replit secrets):
 *   DISCORD_WEBHOOK_URL          — for changelog / level events
 *   DISCORD_WEBHOOKRECORDS_URL   — for record events (falls back to DISCORD_WEBHOOK_URL)
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const body = req.body ?? {};
  const target = body.target === "records" ? "records" : "levels";

  const webhookUrl =
    target === "records"
      ? process.env.DISCORD_WEBHOOKRECORDS_URL || process.env.DISCORD_WEBHOOK_URL
      : process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[discord/notify] webhook URL not configured for target:", target);
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

  const payload = {};
  if (content) payload.content = content;
  if (embeds) payload.embeds = embeds;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    /* Discord returns 204 No Content on success */
    if (response.status === 204 || response.ok) {
      console.log("[discord/notify] sent OK:", { target, status: response.status });
      res.status(200).json({ ok: true });
      return;
    }

    const text = await response.text().catch(() => "");
    console.warn(
      "[discord/notify] Discord non-2xx:",
      response.status,
      text.slice(0, 400)
    );
    res.status(502).json({
      ok: false,
      error: `Discord responded with ${response.status}`,
      discordStatus: response.status,
      discordBody: text.slice(0, 400),
    });
  } catch (err) {
    console.error("[discord/notify] fetch failed:", err?.message ?? err);
    res.status(502).json({ ok: false, error: "Failed to reach Discord webhook" });
  }
}
