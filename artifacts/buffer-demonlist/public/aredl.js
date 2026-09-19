/*
 * AREDL API V2 — integración pública de consulta.
 *
 * Sólo usa los endpoints documentados en:
 * https://api.aredl.net/v2/docs
 */

const AREDL_API_BASE = "https://api.aredl.net/v2/api/aredl";
const AREDL_LIST_CACHE_MS = 5 * 60 * 1000;
let levelListCache = null;
let levelListCacheAt = 0;

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+\((?:2P|Solo)\)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

async function request(path) {
  const response = await fetch(`${AREDL_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  if (!response.ok) {
    const error = new Error(`AREDL respondió ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function listAredlLevels(force = false) {
  const fresh = levelListCache && Date.now() - levelListCacheAt < AREDL_LIST_CACHE_MS;
  if (!force && fresh) return levelListCache;
  const levels = await request("/levels?exclude_pending=true&exclude_removed=true");
  if (!Array.isArray(levels)) throw new Error("La respuesta de niveles de AREDL no es válida.");
  levelListCache = levels;
  levelListCacheAt = Date.now();
  return levels;
}

function findByIdentifier(levels, { gdLevelId, name }) {
  const numericId = String(gdLevelId || "").trim();
  if (numericId) {
    const numericMatch = levels.find(level => String(level.level_id || "") === numericId);
    if (numericMatch) return numericMatch;
  }

  const wantedName = normalizeName(name);
  if (!wantedName) return null;
  const exact = levels.filter(level => normalizeName(level.name) === wantedName);
  if (exact.length === 1) return exact[0];
  return null;
}

function getYoutubeVideoId(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return parsed.pathname.slice(1).split("/")[0];
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (["shorts", "live", "embed"].includes(parts[0])) return parts[1] || "";
    }
  } catch (_) {
    return "";
  }
  return "";
}

function firstVisibleVideo(level) {
  const records = Array.isArray(level?.verifications) ? level.verifications : [];
  return records.find(record => record?.video_url && !record.hide_video)?.video_url
    || records.find(record => record?.video_url)?.video_url
    || "";
}

function creatorLabel(creator) {
  return creator?.global_name || creator?.username || "";
}

export async function lookupAredlLevel({ gdLevelId = "", name = "" } = {}) {
  const requestedId = String(gdLevelId || "").trim();
  const requestedName = String(name || "").trim();
  if (!requestedId && !requestedName) {
    throw new Error("Indica el ID de Geometry Dash o el nombre del nivel.");
  }

  let summary = null;
  if (requestedId) {
    try {
      summary = await request(`/levels/${encodeURIComponent(requestedId)}`);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }

  if (!summary) {
    const levels = await listAredlLevels();
    summary = findByIdentifier(levels, {
      gdLevelId: requestedId,
      name: requestedName,
    });
    if (!summary) {
      throw new Error("No se encontró un nivel coincidente en AREDL.");
    }
  }

  const detail = summary.id && !summary.verifications
    ? await request(`/levels/${encodeURIComponent(summary.id)}`)
    : summary;
  const [creatorResponse] = await Promise.all([
    detail.id
      ? request(`/levels/${encodeURIComponent(detail.id)}/creators`).catch(() => [])
      : Promise.resolve([]),
  ]);
  const creators = Array.isArray(creatorResponse)
    ? creatorResponse.map(creatorLabel).filter(Boolean)
    : [];
  const publisher = creatorLabel(detail.publisher);
  const video = firstVisibleVideo(detail);
  const youtubeId = getYoutubeVideoId(video);

  return {
    aredlId: detail.id || summary.id || "",
    aredlPosition: Number.isFinite(Number(detail.position)) ? Number(detail.position) : null,
    gdLevelId: detail.level_id != null ? String(detail.level_id) : requestedId,
    name: detail.name || summary.name || requestedName,
    author: publisher,
    creators,
    description: detail.description || "",
    tags: Array.isArray(detail.tags) ? detail.tags.filter(Boolean).map(String) : [],
    video,
    thumbnail: youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "",
    twoPlayer: !!detail.two_player,
  };
}

/*
 * Sugiere la posición BufferList contando sólo los niveles existentes que
 * están por delante en AREDL. Los niveles antiguos sin metadata AREDL se
 * resuelven contra el listado público usando su GD ID o nombre.
 */
export async function suggestBufferPosition(aredlLevel, bufferLevels = [], excludeId = "") {
  const targetPosition = Number(aredlLevel?.aredlPosition);
  if (!Number.isFinite(targetPosition) || targetPosition < 1) return null;

  const aredlLevels = await listAredlLevels();
  const positionsAhead = bufferLevels
    .filter(level => level?.id !== excludeId)
    .map(level => {
      const savedPosition = Number(level.aredlPosition);
      if (Number.isFinite(savedPosition) && savedPosition > 0) return savedPosition;

      const matched = findByIdentifier(aredlLevels, {
        gdLevelId: level.gdLevelId,
        name: level.name,
      });
      return Number(matched?.position);
    })
    .filter(position => Number.isFinite(position) && position < targetPosition);

  return positionsAhead.length + 1;
}

export function aredlStatusText(level) {
  const position = Number(level?.aredlPosition);
  return Number.isFinite(position)
    ? `AREDl #${position} · datos encontrados`
    : "Datos encontrados en AREDL";
}