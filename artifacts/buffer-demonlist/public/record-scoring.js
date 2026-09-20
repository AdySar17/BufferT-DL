import { isDemon } from "/list-utils.js";

/**
 * Un nivel Classic solo genera puntos mientras pertenece al Main List.
 * Los records no se borran ni se ocultan; esta regla solo determina si
 * participan en los cálculos de puntos.
 */
export function isScorableDemonLevel(level) {
  if (!level || !isDemon(level)) return false;
  const position = Number(level.position);
  return Number.isFinite(position) && position >= 1 && position <= 50;
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

/**
 * Devuelve un único record aceptado por jugador+nivel.
 * El porcentaje más alto gana; si empata, gana el más reciente.
 *
 * Los records de niveles fuera del Main List se excluyen del resultado,
 * pero permanecen intactos en Firestore y siguen disponibles para el perfil.
 */
export function bestAcceptedDemonRecords(records, levelsById) {
  const best = new Map();

  for (const record of records || []) {
    if (record?.status !== "Accepted") continue;
    const level = levelsById?.get(record.levelId);
    if (!isScorableDemonLevel(level)) continue;

    const percent = Number(record.percent);
    if (!Number.isFinite(percent) || percent <= 0) continue;

    for (const uid of recordPlayers(record)) {
      const key = `${uid}::${record.levelId}`;
      const current = best.get(key);
      const currentPercent = current ? Number(current.record.percent) : -1;
      const currentTime = current ? recordTimestamp(current.record) : -1;
      const timestamp = recordTimestamp(record);
      if (
        !current ||
        percent > currentPercent ||
        (percent === currentPercent && timestamp > currentTime)
      ) {
        best.set(key, { key, uid, record, level });
      }
    }
  }

  return [...best.values()];
}

export function bestAcceptedDemonRecordIds(records, levelsById) {
  return new Set(bestAcceptedDemonRecords(records, levelsById).map(item => item.record.id));
}