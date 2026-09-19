/**
 * Shared Vercel proxy for the official GDDL API.
 *
 * Keep the upstream base and the allowed paths here so every explicit
 * serverless route uses the same read-only behavior.
 */
const GDDL_API_BASE = "https://gdladder.com/api";

export async function forwardGddl(req, res, upstreamPath) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const requestUrl = new URL(req.url || "", "https://bufferteamdl.vercel.app");
    const upstream = await fetch(
      `${GDDL_API_BASE}${upstreamPath}${requestUrl.search}`,
      { headers: { Accept: "application/json" } },
    );
    const body = await upstream.text();

    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json",
    );
    res.send(body);
  } catch (error) {
    console.error(
      "[api/gddl] upstream request failed:",
      error?.message || error,
    );
    res.status(502).json({ error: "No se pudo consultar GDDL." });
  }
}