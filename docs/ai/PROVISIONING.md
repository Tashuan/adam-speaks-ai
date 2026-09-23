# Provisioning

`GET /v1/avatar-templates` lists the active templates selected by Adam platform administrators. Each template represents an assigned platform avatar configuration and includes its public name, description, model type, thumbnail, and stable `templateId`; agents should present this list before asking the user to choose.

A selected template is used for the preview immediately. After Google claim, Adam clones the administrator-owned avatar configuration into the user's private avatar space, so later user changes do not modify the platform template or other users' avatars.

`POST /v1/provisioning/workspaces` creates a provisional workspace, stable avatar, installation key, and mock entitlement for approved partner agents with `workspaces:provision` scope.

For a new AI coding agent, use the safer hosted registration flow instead: dynamically register a minimal client, obtain `registrations:create` and `registrations:read`, and start `POST /v1/registrations` with the exact website origin and a stable idempotency key. This creates an origin-bound preview installation immediately and returns a private one-time `claimUrl` for the trusted agent to show the user. Dynamic clients cannot call direct workspace provisioning.

The private claim token—not an email supplied by the agent—is the handoff capability. Google/Firebase authentication establishes the verified owner UID. Claim URLs are never part of the browser embed, public page copy, logs, or git.

All provisioning and registration workflows are idempotent; always provide a stable idempotency key. Concurrent retries with the same key resolve to one resource result. Pending preview registrations expire after seven days. Claimed installations preserve stable workspace, avatar, and installation IDs.

Registrations record the calling agent client (`agentClientId`) on the workspace, avatar, and installation. Agent-scoped lifecycle endpoints — `GET /v1/installations/{id}`, `POST .../deactivate`, `POST .../reactivate`, `POST .../verify` — only operate on installations owned by the calling client under `installations:read`; statically configured clients holding `installations:manage` may act on any installation. Records created before agent binding have no owner and return `403` from these endpoints.

Pending registrations report `state: "user_action_required"`, `action: "google_claim"`. `POST /v1/registrations/{id}/wait` waits server-side up to 240 seconds and returns a resumable pending state on timeout. `POST /v1/registrations/{id}/claim-url` mints a fresh one-time private claim URL for an owned pending registration.

The MCP server at `/api/mcp` exposes the same flow as tools. Anonymous `initialize` sessions can call public tools immediately; the first privileged call lazily creates a dynamic client bound to that session — secrets never reach the model.

Provisioning and resend email are rate-limited independently by target email, agent client, origin, IP, and global mail budget. Dynamic client registration has a separate per-fingerprint limit and can be disabled with `ADAM_DYNAMIC_AGENT_REGISTRATION_ENABLED=false`.

Preview assets and mock behavior are bounded. Claimed installations enforce exact website origins and trial/subscription entitlements. An expired trial produces an inactive public widget state without a billing CTA; the owner reactivates from the authenticated Adam account.
