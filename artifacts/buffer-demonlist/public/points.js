/* ============================================================
 *  BFT Demon List — puntuación por Tier
 *
 *  Los niveles Classic usan 39 Tiers. El valor indicado para cada Tier es
 *  su límite superior/base; dentro del Tier cada nivel recibe un valor
 *  individual según su posición relativa.
 * ============================================================ */

export const TIER_BASE_VALUES = [
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

export const TIERS = TIER_BASE_VALUES.map((max, index) => ({
  id: index + 1,
  label: TIER_LABELS[index] || "Demon",
  min: index === 0 ? 1 : TIER_BASE_VALUES[index - 1] + 0.000001,
  max,
  curve: 0.92
}));

export const DEFAULT_TIER = 10;
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
    const match = TIERS.find(tier => points >= tier.min && points <= tier.max);
    if (match) return match.id;
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
  const legacyTop = TIER_BASE_VALUES[TIER_BASE_VALUES.length - 1];
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

function round2(value) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 100) / 100;
}

export function formatPoints(value) {
  const points = Number(value);
  return Number.isFinite(points) ? points.toFixed(2) : "—";
}

/**
 * Calcula el valor de un nivel dentro de su Tier.
 * tierPosition es 1-indexed y tierCount es la cantidad total del Tier.
 */
export function computeTierPoints(tier, tierPosition = 1, tierCount = 1) {
  const definition = getTier(tier);
  const count = Math.max(1, Math.floor(Number(tierCount) || 1));
  const rank = Math.min(count, Math.max(1, Math.floor(Number(tierPosition) || 1)));
  const progress = count === 1 ? 0 : (rank - 1) / (count - 1);
  const curvedProgress = Math.pow(progress, definition.curve);
  return round2(
    definition.max - (definition.max - definition.min) * curvedProgress
  );
}

/**
 * Devuelve los valores Classic calculados para un conjunto de niveles.
 * Los niveles sin tier conservan compatibilidad mediante su valor anterior.
 */
export function calculateClassicScores(levels) {
  const groups = new Map();
  levels.forEach((level, index) => {
    const tier = resolveTier(level);
    if (!groups.has(tier)) groups.set(tier, []);
    groups.get(tier).push({ level, index, tier });
  });

  const result = new Map();
  groups.forEach((items, tier) => {
    items.sort((a, b) => {
      const positionA = Number(a.level.position);
      const positionB = Number(b.level.position);
      const validA = Number.isFinite(positionA) && positionA > 0;
      const validB = Number.isFinite(positionB) && positionB > 0;
      if (validA && validB && positionA !== positionB) return positionA - positionB;
      if (validA !== validB) return validA ? -1 : 1;
      return a.index - b.index;
    });
    items.forEach((entry, index) => {
      result.set(entry.level.id, {
        tier,
        value: computeTierPoints(tier, index + 1, items.length),
      });
    });
  });
  return result;
}

/* Alias descriptivo para código que necesita recalcular una lista Classic. */
export const calculateTierScores = calculateClassicScores;