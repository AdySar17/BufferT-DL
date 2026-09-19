import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();
const GDDL_API_BASE = "https://gdladder.com/api";

function queryString(req: Request): string {
  return new URL(req.url, "http://bufferlist.local").search;
}

async function forward(req: Request, res: Response, path: string): Promise<void> {
  try {
    const upstream = await fetch(`${GDDL_API_BASE}${path}${queryString(req)}`, {
      headers: { Accept: "application/json" },
    });
    const body = await upstream.text();
    res.status(upstream.status);
    res.type(upstream.headers.get("content-type") || "application/json").send(body);
  } catch (error) {
    req.log.error({ err: error, path }, "Failed to query GDDL");
    res.status(502).json({ error: "No se pudo consultar GDDL." });
  }
}

router.get("/gddl/tags", (req, res) => forward(req, res, "/tags"));
router.get("/gddl/levels", (req, res) => forward(req, res, "/levels"));
router.get("/gddl/levels/:levelId/tags", (req, res) =>
  forward(req, res, `/levels/${encodeURIComponent(req.params.levelId)}/tags`),
);
router.get("/gddl/levels/:levelId/packs", (req, res) =>
  forward(req, res, `/levels/${encodeURIComponent(req.params.levelId)}/packs`),
);
router.get("/gddl/levels/:levelId", (req, res) =>
  forward(req, res, `/levels/${encodeURIComponent(req.params.levelId)}`),
);

export default router;