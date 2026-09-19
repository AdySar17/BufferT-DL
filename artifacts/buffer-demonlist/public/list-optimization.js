const STORAGE_KEY = "bft-list-optimization";

const DEFAULTS = Object.freeze({
  hideThumbnails: false,
  hideBackgrounds: false,
  hideDifficulty: false
});

export function readListOptimization() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      hideThumbnails: !!stored.hideThumbnails,
      hideBackgrounds: !!stored.hideBackgrounds,
      hideDifficulty: !!stored.hideDifficulty
    };
  } catch (_) {
    return { ...DEFAULTS };
  }
}

export function writeListOptimization(preferences) {
  const next = {
    hideThumbnails: !!preferences.hideThumbnails,
    hideBackgrounds: !!preferences.hideBackgrounds,
    hideDifficulty: !!preferences.hideDifficulty
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (_) {}
  return next;
}