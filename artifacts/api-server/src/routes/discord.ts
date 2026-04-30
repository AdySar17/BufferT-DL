import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

type DiscordNotifyBody = {
  content?: string;
  embeds?: unknown[];
  target?: "levels" | "records";
};

router.post("/discord/notify", async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as DiscordNotifyBody;
  const target = body.target === "records" ? "records" : "levels";

  const webhookUrl =
    target === "records"
      ? process.env["DISCORD_WEBHOOKRECORDS_URL"] ||
        process.env["DISCORD_WEBHOOK_URL"]
      : process.env["DISCORD_WEBHOOK_URL"];

  if (!webhookUrl) {
    req.log.warn(
      { target },
      "Discord webhook not configured; dropping notification",
    );
    res.status(503).json({
      ok: false,
      error: "Discord webhook not configured on the server",
    });
    return;
  }

  const content =
    typeof body.content === "string" ? body.content.slice(0, 1900) : undefined;
  const embeds = Array.isArray(body.embeds) ? body.embeds.slice(0, 10) : undefined;

  if (!content && (!embeds || embeds.length === 0)) {
    res.status(400).json({
      ok: false,
      error: "Either content or embeds is required",
    });
    return;
  }

  const payload: Record<string, unknown> = {};
  if (content) payload["content"] = content;
  if (embeds && embeds.length > 0) payload["embeds"] = embeds;

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
    res.status(502).json({
      ok: false,
      error: "Failed to forward notification to Discord",
    });
  }
});

export default router;
