---
name: Tier scoring compatibility
description: Rule for calculating Tier points and handling levels created before the Tier field existed.
---

Classic scoring uses one continuous global curve based only on the level’s position. The 39 Tiers classify difficulty and remain stored/displayed metadata; they do not select separate point ranges or curves. Pemon levels keep Lunas as their value; their Tier is metadata only.

**Why:** BufferList’s definitive scoring model must distinguish every level by global position, keep Top difficulty valuable, and avoid discontinuities or duplicated scoring caused by Tier-local curves.

**How to apply:** Recompute Classic values from position whenever deriving stats or displaying points. When a legacy Classic level lacks `tier`, infer its Tier from the old stored value only for metadata compatibility. Owner’s bulk point update writes `value` only, preserving Tier and source-owned level fields.

All profile, leaderboard, country, and rank calculations must build scores from the complete levels catalog, not only levels referenced by one user’s records.

**Why:** Tier values depend on each Tier’s relative ordering across the whole catalog; a partial per-user catalog assigns different points for the same level.

**How to apply:** Load the full levels collection before creating the shared record aggregate, then use that aggregate everywhere.