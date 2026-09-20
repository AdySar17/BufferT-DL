import { computeLunas, isDemon, isPemon } from "/list-utils.js";
import { calculateClassicScores } from "/points.js";

/**
 * Cualquier nivel Classic con un valor de puntos válido puede puntuar.
 * La posición sólo participa en la curva de 39 Tiers; no limita el cálculo
 * al Main List. Los records no se borran ni se ocultan.
 */
export function isScorableDemonLevel(level) {
  if (!level || !isDemon(level)) return false;
  const value = Number(level.value);
  return Number.isFinite(value) && value > 0;
}

/**
 * Build the one level map used by every statistics consumer.
 * Classic values are recomputed from the current Tier assignments and the
 * individual Tier curve instead of trusting stale values stored in Firestore.
 */
export function buildScoredLevelMap(levelsById) {
  const entries = levelsById instanceof Map
    ? [...levelsById.entries()]
    : Array.isArray(levelsById)
      ? levelsById.map(level => [level.id, level])
      : Object.entries(levelsById || {});
  const normalized = entries
    .filter(([id, level]) => id && level)
    .map(([id, level]) => ({ id, level: { id, ...level } }));
  const classicLevels = normalized
    .filter(entry => isDemon(entry.level))
    .map(entry => entry.level);
  const classicScores = calculateClassicScores(classicLevels);
  const result = new Map();

  normalized.forEach(({ id, level }) => {
    const score = isDemon(level) ? classicScores.get(id) : null;
    result.set(id, {
      ...level,
      ...(score ? { tier: score.tier, value: score.value } : {}),
      _scoreComputed: true
    });
  });
  return result;
}

export function recordPlayers(record) {
  return [...new Set([record?.userId, record?.player2Id].filter(Boolean))];
}

/**
 * Devuelve los puntos de un record individual. El valor del nivel ya es la
 * completion (100%); un progreso parcial recibe exactamente su proporción.
 * Nunca se suman varios documentos del mismo jugador+nivel: el llamador debe
 * usar bestAcceptedDemonRecords antes de invocar esta función.
 */
export function computeRecordPoints(record, level) {
  if (!isScorableDemonLevel(level)) return 0;
  const percent = Number(record?.percent);
  const base = Number(level?.value);
  if (!Number.isFinite(percent) || percent <= 0 || !Number.isFinite(base) || base <= 0) {
    return 0;
  }
  const clampedPercent = Math.min(100, Math.max(0, percent));
  return Math.round(base * (clampedPercent / 100) * 100) / 100;
}

function recordTimestamp(record) {
  const values = [record?.acceptedAt, record?.updatedAt, record?.createdAt];
  for (const value of values) {
    if (value?.toMillis) return value.toMillis();
    if (value instanceof Date) return value.getTime();
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return 0;
}

function isBetterDemonRecord(candidate, current) {
  const percent = Number(candidate.record.percent);
  const currentPercent = current ? Number(current.record.percent) : -1;
  return !current ||
    percent > currentPercent ||
    (percent === currentPercent &&
      recordTimestamp(candidate.record) > recordTimestamp(current.record));
}

/**
 * Devuelve un único record aceptado por jugador+nivel.
 * El porcentaje más alto gana; si empata, gana el más reciente.
 *
 * Los records de niveles fuera del Main List también participan cuando el
 * nivel tiene puntos válidos. El mejor porcentaje gana; un 100% reemplaza
 * cualquier progreso anterior del mismo jugador y nivel.
 */
export function bestAcceptedDemonRecords(records, levelsById) {
  const scoredLevels = buildScoredLevelMap(levelsById);
  const best = new Map();

  for (const record of records || []) {
    if (record?.status !== "Accepted") continue;
    const level = scoredLevels.get(record.levelId);
    if (!isScorableDemonLevel(level)) continue;

    const percent = Number(record.percent);
    if (!Number.isFinite(percent) || percent <= 0 || percent > 100) continue;

    for (const uid of recordPlayers(record)) {
      const key = `${uid}::${record.levelId}`;
      const current = best.get(key);
      if (isBetterDemonRecord({ record }, current)) {
        best.set(key, { key, uid, record, level });
      }
    }
  }

  return [...best.values()];
}

export function bestAcceptedDemonRecordIds(records, levelsById) {
  return new Set(bestAcceptedDemonRecords(records, levelsById).map(item => item.record.id));
}

/** Select one accepted Platformer record per player and level (fastest wins). */
export function bestAcceptedPemonRecords(records, levelsById) {
  const scoredLevels = buildScoredLevelMap(levelsById);
  const best = new Map();
  for (const record of records || []) {
    if (record?.status !== "Accepted") continue;
    const level = scoredLevels.get(record.levelId);
    const timeMs = Number(record.timeMs);
    if (!isPemon(level) || !Number.isFinite(timeMs) || timeMs <= 0) continue;
    for (const uid of recordPlayers(record)) {
      const key = `${uid}::${record.levelId}`;
      const current = best.get(key);
      const currentTime = current ? Number(current.record.timeMs) : Infinity;
      if (!current ||
          timeMs < currentTime ||
          (timeMs === currentTime &&
            recordTimestamp(record) > recordTimestamp(current.record))) {
        best.set(key, { key, uid, record, level });
      }
    }
  }
  return [...best.values()];
}

/**
 * Shared live aggregate for profiles, Leaderboards, country pages and rank
 * calculations. It intentionally returns one entry per player+nivel.
 */
export function aggregatePlayerStats(records, levelsById) {
  const scoredLevels = buildScoredLevelMap(levelsById);
  const players = new Map();
  const ensure = (uid) => {
    if (!players.has(uid)) {
      players.set(uid, {
        uid,
        points: 0,
        lunas: 0,
        records: 0,
        pemonRecords: 0,
        completions: 0,
        "Extreme Demon": 0,
        "Insane Demon": 0,
        "Hard Demon": 0,
        "Medium Demon": 0,
        "Easy Demon": 0,
        hardest: null,
        hardestPos: Infinity,
        platformerHardest: null,
        platformerHardestPos: Infinity
      });
    }
    return players.get(uid);
  };
  const difficultyKeys = new Set([
    "Extreme Demon", "Insane Demon", "Hard Demon", "Medium Demon", "Easy Demon"
  ]);

  bestAcceptedDemonRecords(records, scoredLevels).forEach(item => {
    const earned = computeRecordPoints(item.record, item.level);
    if (earned <= 0) return;
    const stats = ensure(item.uid);
    const percent = Number(item.record.percent);
    stats.points += earned;
    stats.records += 1;
    if (percent !== 100) return;
    const difficulty = difficultyKeys.has(item.level.difficulty)
      ? item.level.difficulty
      : "Extreme Demon";
    stats[difficulty] += 1;
    stats.completions += 1;
    const position = Number(item.level.position);
    if (Number.isFinite(position) && position > 0 && position < stats.hardestPos) {
      stats.hardestPos = position;
      stats.hardest = item.level;
    }
  });

  bestAcceptedPemonRecords(records, scoredLevels).forEach(item => {
    const stats = ensure(item.uid);
    const position = Number(item.level.position);
    const computedLunas = computeLunas(item.level.position);
    const lunas = computedLunas || Number(item.level.value) || 0;
    /* Pemon values are already Lunas and are never replaced by Classic tiers. */
    stats.lunas += lunas;
    stats.pemonRecords += 1;
    if (Number.isFinite(position) && position > 0 && position < stats.platformerHardestPos) {
      stats.platformerHardestPos = position;
      stats.platformerHardest = item.level;
    }
  });

  players.forEach(stats => {
    stats.points = Math.round(stats.points * 100) / 100;
    stats.lunas = Math.round(stats.lunas * 100) / 100;
  });
  return { players, levels: scoredLevels };
}