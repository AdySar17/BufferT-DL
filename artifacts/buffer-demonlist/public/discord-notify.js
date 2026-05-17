/* Helper que envía un mensaje (texto y/o embeds) a Discord a través del
   endpoint serverless /api/discord/notify.
   La URL del webhook se mantiene en el servidor (variable de entorno). */

/**
 * @param {object|string} payload
 *   Si es string → se envía como `content`.
 *   Si es objeto → { content?: string, embeds?: object[], target?: "levels"|"records" }
 *   target "levels"  → DISCORD_WEBHOOK_URL          (por defecto)
 *   target "records" → DISCORD_WEBHOOKRECORDS_URL
 */
export async function notifyDiscord(payload) {
  const body = typeof payload === "string" ? { content: payload } : (payload || {});
  if (body.content) body.content = String(body.content).slice(0, 1900);

  let r;
  try {
    r = await fetch("/api/discord/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.warn("[discord] fallo de red al contactar /api/discord/notify:", e);
    return;
  }

  /* Leer el cuerpo antes de inspeccionarlo */
  const rawText = await r.text().catch(() => "");

  /* Detectar respuesta HTML (caso frecuente cuando el endpoint no existe en producción) */
  const isHtml = rawText.trimStart().startsWith("<!") || rawText.trimStart().startsWith("<html");
  if (isHtml) {
    console.error(
      "[discord] El servidor devolvió HTML en vez de JSON.",
      "Verifica que /api/discord/notify existe (función serverless en Vercel o API server en Replit).",
      "Status:", r.status
    );
    return;
  }

  if (!r.ok) {
    let detail = rawText.slice(0, 300);
    try { detail = JSON.stringify(JSON.parse(rawText)); } catch {}
    console.warn(
      `[discord] /api/discord/notify devolvió ${r.status}:`,
      detail,
      "— target:", body.target ?? "levels"
    );
    return;
  }

  console.log("[discord] notificación enviada correctamente", {
    target: body.target ?? "levels",
    status: r.status,
  });
}
