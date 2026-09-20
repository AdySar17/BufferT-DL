---
name: Tier scoring compatibility
description: Rule for calculating Tier points and handling levels created before the Tier field existed.
---

Classic scoring is assigned from the selected Tier, its configured point range, and the level’s relative position among levels in that Tier. Pemon levels keep Lunas as their value; their Tier is metadata only.

**Why:** The product needs independent scoring curves per difficulty band without breaking older Firestore documents that do not have a `tier` field.

**How to apply:** When a legacy Classic level lacks `tier`, infer it from its stored value using the Tier ranges before recalculating. Use the Pemon fallback Tier only as metadata, never to replace Lunas.

All profile, leaderboard, country, and rank calculations must build scores from the complete levels catalog, not only levels referenced by one user’s records.

**Why:** Tier values depend on each Tier’s relative ordering across the whole catalog; a partial per-user catalog assigns different points for the same level.

**How to apply:** Load the full levels collection before creating the shared record aggregate, then use that aggregate everywhere.