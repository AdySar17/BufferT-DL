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
  return {
    gddlId: detail.ID != null ? String(detail.ID) : requestedId,
    /*
     * `Rating` is the numeric score shown by GDDL. DifficultyIndex and
     * AREDLPosition are different indexes and must never become a
     * BufferList position.
     */
    gddlScore: rating,
    gddlPosition: null,
    gddlRanking: null,
    gddlPositionType: "rating",
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
      score: rating,
      rating,
      positionType: "rating",
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
 * GDDL `Rating` es el Score numérico que aparece en la ficha del nivel.
 * Un Score mayor significa mayor dificultad. La comparación se hace sólo
 * contra niveles de la misma dificultad y nunca usa Tier, DifficultyIndex
 * ni un ranking externo para construir la posición de BufferList.
 */
export function suggestGddlBufferPosition(gddlLevel, bufferLevels = [], excludeId = "") {
  const targetScore = firstFiniteNumber(
    gddlLevel?.gddlScore,
    gddlLevel?.gddlRating,
    gddlLevel?.gddlData?.score,
    gddlLevel?.gddlData?.rating,
  );
  if (targetScore == null) return null;

  function normalizeDifficulty(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+demon$/, "");
  }

  function levelDifficulty(level) {
    return normalizeDifficulty(
      level?.gddlDifficulty ||
      level?.gddlData?.difficulty ||
      level?.difficulty
    );
  }

  const targetDifficulty = levelDifficulty(gddlLevel);
  if (!targetDifficulty) return null;

  const sameDifficulty = bufferLevels
    .filter(level =>
      level?.id !== excludeId &&
      levelDifficulty(level) === targetDifficulty
    )
    .map((level, index) => ({
      level,
      score: firstFiniteNumber(
        level?.gddlScore,
        level?.gddlRating,
        level?.gddlData?.score,
        level?.gddlData?.rating,
      ),
      position: Number(level?.position),
      index,
    }))
    .filter(item => item.score != null && Number.isFinite(item.position) && item.position > 0)
    .sort((a, b) =>
      b.score - a.score ||
      a.position - b.position ||
      a.index - b.index
    );

  if (!sameDifficulty.length) return null;

  /*
   * Insert before the first existing level whose score is <= the new score.
   * Its current BufferList position is the editable suggestion: writing at
   * that position shifts it and the following levels down automatically.
   * Equal scores therefore resolve deterministically before the older entry.
   */
  const boundary = sameDifficulty.find(item => item.score <= targetScore);
  if (boundary) {
    const isStrictlyAboveTop =
      boundary === sameDifficulty[0] && targetScore > boundary.score;
    return Math.max(
      1,
      Math.floor(boundary.position) - (isStrictlyAboveTop ? 1 : 0),
    );
  }

  const last = sameDifficulty[sameDifficulty.length - 1];
  return Math.max(1, Math.floor(last.position) + 1);
}

export function gddlStatusText(level) {
  const score = Number(
    level?.gddlScore ??
    level?.gddlRating ??
    level?.gddlData?.score ??
    level?.gddlData?.rating
  );
  return Number.isFinite(score)
    ? `GDDL · Score ${score.toFixed(2)} · datos encontrados`
    : "Datos encontrados en GDDL";
}