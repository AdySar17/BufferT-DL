/* ============================================================
 *  BFT Demon List — clasificación por Tier + curva global de puntos
 *
 *  Los 39 Tiers describen dificultad y procedencia de clasificación. Los
 *  puntos Classic se calculan únicamente con una curva global continua de
 *  posición; el Tier nunca selecciona una curva propia.
 * ============================================================ */

export const LEGACY_TIER_MAX_VALUES = [
  5, 40, 75, 100, 120, 143, 171, 204, 244, 291,
  348, 415, 496, 592, 707, 845, 1010, 1210, 1440, 1720,
  2060, 2460, 2940, 3510, 4190, 5000, 5980, 7150, 8550, 10200,
  12200, 14600, 17400, 20800, 24800, 29600, 35300, 42000, 50000
];

const TIER_LABELS = [
  "Free Demons", "Mid Easy Demons", "Easy Demon", "Medium Demon",
  "Hard Demon", "Very Hard Demon", "Insane Demon", "Very Hard Insane",
  "Hard Insane", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon", "Extreme Demon",
  "Extreme Demon", "Extreme Demon", "Extreme Demon"
];

/*
 * Se conserva este umbral únicamente para inferir el Tier de documentos
 * legacy que no guardaban `tier`. No participa en la curva actual.
 */
export const TIERS = TIER_LABELS.map((label, index) => ({
  id: index + 1,
  label: label || "Demon"
}));

export const DEFAULT_TIER = 1;
export const DEFAULT_PEMON_TIER = 1;

const TIER_MAP = new Map(TIERS.map(tier => [tier.id, tier]));

export function normalizeTier(value) {
  const tier = Number(value);
  return Number.isInteger(tier) && TIER_MAP.has(tier) ? tier : null;
}

export function getTier(tier) {
  return TIER_MAP.get(normalizeTier(tier) || DEFAULT_TIER);
}

export function inferTierFromValue(value, fallback = DEFAULT_TIER) {
  const points = Number(value);
  if (Number.isFinite(points)) {
    const match = LEGACY_TIER_MAX_VALUES.findIndex(max => points <= max);
    if (match >= 0) return match + 1;
  }
  return normalizeTier(fallback);
}

export function resolveTier(level, fallback = DEFAULT_TIER) {
  const savedTier = normalizeTier(level?.tier);
  if (savedTier) return savedTier;

  /*
   * Compatibilidad con documentos de la curva anterior: 50,000 era el
   * máximo de Extreme y varios documentos legacy lo guardan sin `tier`.
   * No lo reinterpretamos como Tier 39 antes de que el Owner ejecute la
   * actualización basada en GDDL/AREDL.
   */
  const legacyTop = LEGACY_TIER_MAX_VALUES[LEGACY_TIER_MAX_VALUES.length - 1];
  if (Number(level?.value) >= legacyTop) return normalizeTier(fallback);
  return inferTierFromValue(level?.value, fallback);
}

export function tierFromGddlRating(rating, fallback = null) {
  const value = Number(rating);
  if (!Number.isFinite(value) || value <= 0) {
    return normalizeTier(fallback);
  }
  return Math.min(TIERS.length, Math.max(1, Math.round(value)));
}

export function resolveGddlTier(level, fallback = null) {
  const rating = Number(
    level?.gddlRating ??
    level?.gddlScore ??
    level?.gddlData?.rating ??
    level?.gddlData?.score
  );
  if (Number.isFinite(rating) && rating > 0) {
    return tierFromGddlRating(rating);
  }
  const stored = normalizeTier(level?.gddlTier);
  return stored || normalizeTier(fallback);
}

export function formatTier(tier) {
  const normalized = normalizeTier(tier);
  return normalized ? `TIER ${normalized}` : "—";
}

function round2(value) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100) / 100;
}

export function formatPoints(value) {
  const points = Number(value);
  return Number.isFinite(points) ? points.toFixed(2) : "—";
}

/*
 * Curva global calibrada con los puntos de referencia del producto:
 *   P(pos) = 50000 · exp(-a · ln(pos)^b)
 *
 * Es continua y estrictamente decreciente para posiciones >= 1. La forma
 * logarítmica conserva una diferencia clara entre el Top 1 y Top 10, mantiene
 * valor en el Top 500 y reduce progresivamente hasta aproximadamente 5 pts
 * en el puesto 10,000, sin crear bandas por Tier.
 */
export const GLOBAL_POINTS_TOP = 50000;
export const GLOBAL_POINTS_DECAY = 0.08960423403542903;
export const GLOBAL_POINTS_EXPONENT = 2.087;

export function computeGlobalPoints(position) {
  const rank = Number(position);
  if (!Number.isFinite(rank) || rank < 1) return 0;
  const logarithmicRank = Math.log(rank);
  return round2(
    GLOBAL_POINTS_TOP *
    Math.exp(-GLOBAL_POINTS_DECAY * Math.pow(logarithmicRank, GLOBAL_POINTS_EXPONENT))
  );
}

/*
 * Compatibilidad para imports antiguos. El primer argumento ya no tiene
 * efecto: mantener la firma evita romper páginas legacy, pero la única
 * entrada real de puntos es la posición.
 */
export function computeTierPoints(_tier, tierPosition = 1) {
  return computeGlobalPoints(tierPosition);
}

/**
 * Devuelve el valor individual de cada nivel Classic usando exclusivamente
 * su posición. El Tier existente se conserva como metadata.
 */
export function calculateClassicScores(levels) {
  const result = new Map();
  (levels || []).forEach(level => {
    result.set(level.id, {
      tier: resolveTier(level),
      value: computeGlobalPoints(level.position),
    });
  });
  return result;
}

/* Alias descriptivo para código que necesita recalcular una lista Classic. */
export const calculateTierScores = calculateClassicScores;