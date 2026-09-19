/* ============================================================
 *  BFT Demon List — puntuación por Tier
 *
 *  Cada Tier tiene su propio rango de puntos y su propia curva.
 *  Dentro de un Tier, los niveles se ordenan por posición global:
 *  el primero recibe el máximo y el último el mínimo.
 * ============================================================ */

export const TIERS = [
  { id: 1,  label: "Free Demons",                         min: 5,     max: 100,   curve: 0.72 },
  { id: 2,  label: "Mid Easy Demons",                     min: 101,   max: 200,   curve: 0.78 },
  { id: 3,  label: "Easy Demon → Free Medium Demon",      min: 201,   max: 400,   curve: 0.84 },
  { id: 4,  label: "Medium Demon",                        min: 401,   max: 750,   curve: 0.90 },
  { id: 5,  label: "Easy Hard Demon",                     min: 751,   max: 1400,  curve: 0.96 },
  { id: 6,  label: "Very Hard Demon",                     min: 1401,  max: 2500,  curve: 1.02 },
  { id: 7,  label: "Easy Insane Demon",                   min: 2501,  max: 5000,  curve: 1.08 },
  { id: 8,  label: "Insane Demon",                        min: 5001,  max: 7500,  curve: 1.16 },
  { id: 9,  label: "Hard Insane Demon → Easy Extreme Demon", min: 7501, max: 10000, curve: 1.28 },
  { id: 10, label: "Extreme Demons",                      min: 10001, max: 50000, curve: 1.42 },
];

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
  return normalizeTier(fallback) || DEFAULT_TIER;
}

export function resolveTier(level, fallback = DEFAULT_TIER) {
  return normalizeTier(level?.tier) || inferTierFromValue(level?.value, fallback);
}

function round1(value) {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value * 10) / 10;
}

export function computeTierPoints(tier, tierPosition = 1, tierCount = 1) {
  const definition = getTier(tier);
  const count = Math.max(1, Math.floor(Number(tierCount) || 1));
  const rank = Math.min(count, Math.max(1, Math.floor(Number(tierPosition) || 1)));
  const progress = count === 1 ? 0 : (rank - 1) / (count - 1);
  const curvedProgress = Math.pow(progress, definition.curve);
  return round1(definition.max - (definition.max - definition.min) * curvedProgress);
}

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

export const calculateTierScores = calculateClassicScores;