# Provisioning

`POST /v1/provisioning/workspaces` creates a provisional workspace, stable avatar, installation key, and mock entitlement.

The caller must authenticate as an agent client with `workspaces:provision` scope. The email is used for a later ownership handoff and is not proof of ownership.

Provisioning is idempotent. Always provide a stable `idempotencyKey`. Concurrent requests with the same key resolve to one resource result.

Provisioning and resend email are rate-limited independently by target email, agent client, origin, IP, and global mail budget.
