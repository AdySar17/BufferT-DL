function youtubeVideoId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || "";
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["shorts", "live", "embed"].includes(parts[0])) {
        return parts[1] || "";
      }
    }
  } catch (_) {
    return "";
  }
  return "";
}

/**
 * Derives a thumbnail only from a video URL stored by BufferList.
 * Non-YouTube videos intentionally produce no thumbnail.
 */
export function youtubeThumbnailFromVideo(video) {
  const id = youtubeVideoId(video);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}