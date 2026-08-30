export const DEMON_LIST_TYPE = "demon";
export const PEMON_LIST_TYPE = "pemon";

/* Legacy levels without listType are part of the original Demon List. */
export function getListType(value) {
  return value && value.listType === PEMON_LIST_TYPE
    ? PEMON_LIST_TYPE
    : DEMON_LIST_TYPE;
}

export function isPemon(value) {
  return getListType(value) === PEMON_LIST_TYPE;
}

export function isDemon(value) {
  return getListType(value) === DEMON_LIST_TYPE;
}

/* PemonList currently follows the same position curve as Demon List.
   Keeping this as a separate function makes the Luna system independent. */
export function computeLunas(position) {
  const p = Number(position);
  if (!Number.isFinite(p) || p < 1) return 0;
  if (p >= 10000) return 5;
  const anchors = [
    [1, 50000], [5, 42500], [25, 20000], [75, 7500],
    [150, 4000], [300, 1000], [600, 800], [1000, 500],
    [3000, 250], [6000, 100], [7500, 50], [10000, 5],
  ];
  for (let i = 1; i < anchors.length; i += 1) {
    const [p1, v1] = anchors[i - 1];
    const [p2, v2] = anchors[i];
    if (p <= p2) {
      if (p === p1) return v1;
      if (p === p2) return v2;
      const t = (Math.log(p) - Math.log(p1)) / (Math.log(p2) - Math.log(p1));
      return Math.round((v1 + (v2 - v1) * t) * 10) / 10;
    }
  }
  return 5;
}