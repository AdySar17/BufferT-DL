/*
 * GDDL API — integración pública de consulta.
 * Documentación oficial: https://gdladder.com/api/docs
 * Esquema oficial: https://registry.scalar.com/@gddemonladder/apis/gddl-api
 */

const GDDL_API_BASE = "/api/gddl";
let gddlTagsCache = null;

async function request(path) {
  const response = await fetch(`${GDDL_API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    credentials: "omit",
  });
  if (!response.ok) {
    const error = new Error(`GDDL respondió ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+\((?:2P|Solo)\)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function youtubeThumbnail(videoId) {
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
}

async function getGddlTags() {
  if (!gddlTagsCache) {
    const tags = await request("/tags");
    gddlTagsCache = Array.isArray(tags) ? tags : [];
  }
  return gddlTagsCache;
}

async function findLevel({ gdLevelId, name }) {
  if (gdLevelId) {
    try {
      return await request(`/levels/${encodeURIComponent(gdLevelId)}`);
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  if (!name) return null;
  const result = await request(`/levels?name=${encodeURIComponent(name)}&limit=25`);
  const matches = Array.isArray(result?.data) ? result.data : [];
  const exact = matches.filter(item => normalizeName(item.name) === normalizeName(name));
  const candidate = exact.length === 1 ? exact[0] : (matches.length === 1 ? matches[0] : null);
  return candidate ? request(`/levels/${encodeURIComponent(candidate.id)}`) : null;
}

export async function lookupGddlLevel({ gdLevelId = "", name = "" } = {}) {
  const requestedId = String(gdLevelId || "").trim();
  const requestedName = String(name || "").trim();
  if (!requestedId && !requestedName) {
    throw new Error("Indica el ID de Geometry Dash o el nombre del nivel.");
  }

  const detail = await findLevel({ gdLevelId: requestedId, name: requestedName });
  if (!detail) throw new Error("No se encontró un nivel coincidente en GDDL.");

  const [tagRows, allTags, packs] = await Promise.all([
    request(`/levels/${encodeURIComponent(detail.ID)}/tags`).catch(() => []),
    getGddlTags().catch(() => []),
    request(`/levels/${encodeURIComponent(detail.ID)}/packs`).catch(() => []),
  ]);
  const tagNames = new Map(allTags.map(tag => [Number(tag.ID), tag.Name]));
  const tags = Array.isArray(tagRows)
    ? tagRows.map(tag => tagNames.get(Number(tag.TagID))).filter(Boolean)
    : [];
  const rating = Number.isFinite(Number(detail.Rating))
    ? Number(detail.Rating)
    : (Number.isFinite(Number(detail.DefaultRating)) ? Number(detail.DefaultRating) : null);

  return {
    gddlId: detail.ID != null ? String(detail.ID) : requestedId,
    gddlPosition: rating,
    gddlRating: rating,
    gddlDefaultRating: Number.isFinite(Number(detail.DefaultRating))
      ? Number(detail.DefaultRating) : null,
    gddlDifficulty: detail.Meta?.Difficulty || "",
    gddlShowcase: detail.Showcase || "",
    gdLevelId: detail.Meta?.ID != null ? String(detail.Meta.ID) : requestedId,
    name: detail.Meta?.Name || requestedName,
    author: detail.Meta?.Publisher?.name || "",
    creators: detail.Meta?.Publisher?.name ? [detail.Meta.Publisher.name] : [],
    description: detail.Meta?.Description || "",
    tags,
    thumbnail: youtubeThumbnail(detail.Showcase),
    twoPlayer: !!detail.Meta?.IsTwoPlayer,
    gddlData: {
      rating,
      defaultRating: Number.isFinite(Number(detail.DefaultRating)) ? Number(detail.DefaultRating) : null,
      enjoyment: detail.Enjoyment ?? null,
      deviation: detail.Deviation ?? null,
      ratingCount: detail.RatingCount ?? 0,
      enjoymentCount: detail.EnjoymentCount ?? 0,
      submissionCount: detail.SubmissionCount ?? 0,
      popularity: detail.Popularity ?? null,
      difficulty: detail.Meta?.Difficulty || "",
      rarity: detail.Meta?.Rarity ?? null,
      isTwoPlayer: !!detail.Meta?.IsTwoPlayer,
      showcase: detail.Showcase || "",
      song: detail.Meta?.Song ? {
        id: detail.Meta.Song.ID ?? null,
        name: detail.Meta.Song.Name || "",
        author: detail.Meta.Song.Author || "",
      } : null,
      tags,
      packs: Array.isArray(packs) ? packs.map(pack => ({
        id: pack.ID ?? null,
        name: pack.Name || "",
      })) : [],
    },
  };
}

/*
 * GDDL califica los niveles por dificultad (1 = más fácil, 39 = más difícil).
 * BufferList ordena de más difícil a más fácil, por eso los niveles con un
 * rating mayor ocupan posiciones anteriores.
 */
export function suggestGddlBufferPosition(gddlLevel, bufferLevels = [], excludeId = "") {
  const target = Number(gddlLevel?.gddlPosition);
  if (!Number.isFinite(target)) return null;
  const ahead = bufferLevels
    .filter(level => level?.id !== excludeId)
    .map(level => Number(level.gddlPosition ?? level.gddlRating))
    .filter(position => Number.isFinite(position) && position > target);
  return ahead.length + 1;
}

export function gddlStatusText(level) {
  const rating = Number(level?.gddlPosition);
  return Number.isFinite(rating)
    ? `GDDL · rating ${rating.toFixed(2)} · datos encontrados`
    : "Datos encontrados en GDDL";
}