/**
 * Vercel Serverless Function — read-only GDDL proxy.
 *
 * The browser cannot call GDDL directly because GDDL only allows
 * gdladder.com as a CORS origin. Keep this allowlist narrow: this function
 * is not a generic upstream URL forwarder.
 */
const GDDL_API_BASE = "https://gdladder.com/api";

function getPathSegments(req) {
  /*
   * Vercel's catch-all query parameter is not stable for this deployment:
   * production may omit it or let a user query parameter override it.
   * Parse the request pathname as a compatibility fallback.
   */
  const raw = req.query?.path;
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  if (values.length) {
    return values.map(value => decodeURIComponent(String(value)));
  }

  const pathname = new URL(
    req.url || "",
    "https://bufferteamdl.vercel.app",
  ).pathname;
  const prefix = "/api/gddl/";
  if (!pathname.startsWith(prefix)) return [];
  return pathname
    .slice(prefix.length)
    .split("/")
    .filter(Boolean)
    .map(value => decodeURIComponent(value));
}

function upstreamPath(segments) {
  if (segments.length === 1 && segments[0] === "tags") return "/tags";
  if (segments.length === 1 && segments[0] === "levels") return "/levels";
  if (
    segments.length === 2 &&
    segments[0] === "levels" &&
    segments[1]
  ) {
    return `/levels/${encodeURIComponent(segments[1])}`;
  }
  if (
    segments.length === 3 &&
    segments[0] === "levels" &&
    segments[1] &&
    segments[2] === "tags"
  ) {
    return `/levels/${encodeURIComponent(segments[1])}/tags`;
  }
  if (
    segments.length === 3 &&
    segments[0] === "levels" &&
    segments[1] &&
    segments[2] === "packs"
  ) {
    return `/levels/${encodeURIComponent(segments[1])}/packs`;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const path = upstreamPath(getPathSegments(req));
  if (!path) {
    res.status(404).json({ error: "GDDL route not found" });
    return;
  }

  const query = new URL(req.url || "", "https://bufferteamdl.vercel.app").search;
  try {
    const upstream = await fetch(`${GDDL_API_BASE}${path}${query}`, {
      headers: { Accept: "application/json" },
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json",
    );
    res.send(body);
  } catch (error) {
    console.error("[api/gddl] upstream request failed:", error?.message || error);
    res.status(502).json({ error: "No se pudo consultar GDDL." });
  }
}