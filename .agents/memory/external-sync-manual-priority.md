---
name: External sync manual priority
description: External list refreshes must update only source-owned metadata and never replace Staff-controlled presentation or ordering fields.
---

External GDDL/AREDL refreshes must be limited to source-owned metadata such as IDs, ratings, rankings, and source payloads. Thumbnail, video, background, name, description, tags, position, and manually chosen tier remain Staff-controlled; an explicit override marker is used when a field needs protection across later lookups.

**Why:** Automatic refreshes previously replaced manual thumbnails and other edits, making a bulk update destructive even when the external lookup succeeded.

**How to apply:** When adding another sync path, build its update payload from automatic fields only and preserve the existing level document for all manual fields. Respect manual tier overrides during tier recalculation.