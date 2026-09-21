---
name: GDDL Tier source
description: Durable rule for deriving, storing, and displaying Demon List Tiers.
---

For Demon levels, GDDL Rating is the only source for a Tier: round it to the nearest integer in the 1–39 range, store both `gddlRating` and `gddlTier`, and keep the point-scoring `tier` synchronized when a GDDL Tier exists. AREDL position must never derive or overwrite this classification. Extreme levels without a GDDL Rating may inherit only the stored Tier of the adjacent Extreme level; they must not receive a fabricated Rating.

**Why:** The product replaced an older 10-Tier/difficulty classification with the 39-Tier GDDL model, and inconsistent fallback logic caused the list, detail page, and admin panel to disagree.

**How to apply:** Use the shared GDDL Tier resolver and `TIER N` formatter in every Demon-facing view. Keep the 39-tier point curve unchanged, and preserve source-owned metadata when an external lookup fails.