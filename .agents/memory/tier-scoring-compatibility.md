---
name: Tier scoring compatibility
description: Rule for calculating Tier points and handling levels created before the Tier field existed.
---

Classic scoring is assigned from the selected Tier, its configured point range, and the level’s relative position among levels in that Tier. Pemon levels keep Lunas as their value; their Tier is metadata only.

**Why:** The product needs independent scoring curves per difficulty band without breaking older Firestore documents that do not have a `tier` field.

**How to apply:** When a legacy Classic level lacks `tier`, infer it from its stored value using the Tier ranges before recalculating. Use the Pemon fallback Tier only as metadata, never to replace Lunas.