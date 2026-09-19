import { forwardGddl } from "../../lib/gddl-proxy.js";

export default function handler(req, res) {
  return forwardGddl(req, res, "/levels");
}