export function gdBgUrl(gdId) {
  const id = String(gdId || "").trim();
  return id ? `https://levelthumbs.prevter.me/thumbnail/${id}` : "";
}

export function levelBackgroundUrl(level = {}, record = {}) {
  return level.background
    || gdBgUrl(level.gdLevelId || level.gdId || record.claimedLevelId)
    || level.imageURL
    || level.thumbnail
    || "";
}