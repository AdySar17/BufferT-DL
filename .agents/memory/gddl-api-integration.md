---
name: GDDL API integration
description: GDDL public API details and the browser CORS constraint used by BufferList.
---

The official GDDL API is documented through the Scalar OpenAPI registry and exposes level data at `/api/levels/{levelID}`, search at `/api/levels`, level tags at `/api/levels/{levelID}/tags`, and tag definitions at `/api/tags`. Its browser CORS policy is restricted to gdladder.com, so BufferList must query it through the API server's narrow read-only proxy.

**Why:** Direct browser requests from BufferList are blocked by GDDL's `Access-Control-Allow-Origin` policy.

**How to apply:** Keep the proxy limited to the known read-only levels and tags paths; never turn it into a generic URL forwarder or store GDDL credentials.

For level ordering and display, use only the detailed response field `Rating` as GDDL's numeric Score. A missing `Rating` remains null; never substitute `DefaultRating`, `DifficultyIndex`, `AREDLPosition`, or another rank-like field.

**Why:** GDDL's detailed schema identifies `Rating` as the community score, while the other indexes represent different concepts and can incorrectly place a level at the top.

**How to apply:** Normalize the GDDL difficulty and compare a positive `Rating` only with existing BufferList levels of that same difficulty. Keep the resulting BufferList position as an editable suggestion, and derive GDDL Tier by nearest-integer rounding only when Rating exists.

Vercel production did not reliably populate the catch-all `req.query.path` for `/api/gddl/[...path].js`; explicit functions for `/tags`, `/levels`, `/levels/{id}`, and the nested tags/packs routes are the reliable deployment shape.

**Why:** Production returned the proxy's own route-not-found response until a manual `?path=levels` query was added, while the official GDDL endpoints were healthy.

**How to apply:** Keep the shared read-only proxy in the artifact and route each known GDDL path explicitly; retain the catch-all only as a compatibility fallback.