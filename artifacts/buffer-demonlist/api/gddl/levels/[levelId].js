import { forwardGddl } from "../../../lib/gddl-proxy.js";

export default function handler(req, res) {
  const levelId = String(req.query?.levelId || "").trim();
  if (!levelId) {
    res.status(400).json({ error: "GDDL level ID is required." });
    return;
  }
  return forwardGddl(req, res, `/levels/${encodeURIComponent(levelId)}`);
}