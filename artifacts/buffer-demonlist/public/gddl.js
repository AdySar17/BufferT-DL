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

function firstFiniteNumber(...values) {
  return values
    .map(value => Number(value))
    .find(value => Number.isFinite(value) && value > 0) ?? null;
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
  const ranking = firstFiniteNumber(
    detail.AREDLPosition,
    detail.Position,
    detail.Rank,
    detail.Ranking,
  );

  return {
    gddlId: detail.ID != null ? String(detail.ID) : requestedId,
    gddlPosition: ranking,
    gddlRanking: ranking,
    gddlPositionType: ranking != null ? "ranking" : "rating",
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
      ranking,
      positionType: ranking != null ? "ranking" : "rating",
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
 * GDDL puede entregar una posición/ranking (menor número = más difícil) y,
 * cuando no existe, un rating (mayor número = más difícil). La comparación
 * se hace contra todos los niveles demonios de BufferList, sin filtrar por Tier.
 */
export function suggestGddlBufferPosition(gddlLevel, bufferLevels = [], excludeId = "") {
  const targetRanking = firstFiniteNumber(
    gddlLevel?.gddlRanking,
    gddlLevel?.gddlPositionType === "ranking" ? gddlLevel?.gddlPosition : null,
  );
  const targetRating = firstFiniteNumber(
    gddlLevel?.gddlRating,
    gddlLevel?.gddlData?.rating,
    targetRanking == null ? gddlLevel?.gddlPosition : null,
  );
  const existing = bufferLevels.filter(level => level?.id !== excludeId);

  if (targetRanking != null && gddlLevel?.gddlPositionType !== "rating") {
    const ahead = existing
      .map(level => firstFiniteNumber(level?.gddlRanking, level?.gddlData?.ranking,
        level?.gddlPositionType === "ranking" ? level?.gddlPosition : null))
      .filter(position => position != null && position < targetRanking);
    if (ahead.length || existing.some(level =>
      firstFiniteNumber(level?.gddlRanking, level?.gddlData?.ranking,
        level?.gddlPositionType === "ranking" ? level?.gddlPosition : null) != null)) {
      return ahead.length + 1;
    }
  }

  if (targetRating == null) return null;
  const aheadByRating = existing
    .map(level => firstFiniteNumber(
      level?.gddlRating,
      level?.gddlData?.rating,
      level?.gddlPositionType === "ranking" ? null : level?.gddlPosition,
    ))
    .filter(rating => rating != null && rating > targetRating);
  return aheadByRating.length + 1;
}

export function gddlStatusText(level) {
  const ranking = Number(level?.gddlRanking ??
    (level?.gddlPositionType === "ranking" ? level?.gddlPosition : null));
  if (Number.isFinite(ranking)) {
    return `GDDL · posición #${ranking} · datos encontrados`;
  }
  const rating = Number(level?.gddlRating ?? level?.gddlData?.rating ?? level?.gddlPosition);
  return Number.isFinite(rating)
    ? `GDDL · rating ${rating.toFixed(2)} · datos encontrados`
    : "Datos encontrados en GDDL";
}