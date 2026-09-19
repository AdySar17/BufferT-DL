---
name: GDDL API integration
description: GDDL public API details and the browser CORS constraint used by BufferList.
---

The official GDDL API is documented through the Scalar OpenAPI registry and exposes level data at `/api/levels/{levelID}`, search at `/api/levels`, level tags at `/api/levels/{levelID}/tags`, and tag definitions at `/api/tags`. Its browser CORS policy is restricted to gdladder.com, so BufferList must query it through the API server's narrow read-only proxy.

**Why:** Direct browser requests from BufferList are blocked by GDDL's `Access-Control-Allow-Origin` policy.

**How to apply:** Keep the proxy limited to the known read-only levels and tags paths; never turn it into a generic URL forwarder or store GDDL credentials.