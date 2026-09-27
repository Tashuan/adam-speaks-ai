# Session lifecycle

```text
installation key → session created → runtime connected → speech accepted
                                     ↓
                              reconnect/refresh
                                     ↓
                  ended (client_end | revoked | swept) / expired
```

A session is temporary and scoped to one installation/avatar. Speech acceptance does not imply playback completion; use lifecycle events and `speechId` correlation.

## Session end and duration

Every session has a start log (`createdAt`) and an end log (`endedAt` + `endedReason`). The first end path to fire wins:

- `client_end` — the hosted embed sends `POST /v1/runtime-sessions/{sessionId}/end` via `navigator.sendBeacon` when the page hides. Integrators driving their own runtime may call the same endpoint.
- `revoked` — the session is explicitly ended through `DELETE /v1/runtime-sessions/{sessionId}` or an owner action.
- `swept` — a server-side sweep closes sessions that outlived their expiry or went idle, for clients that never sent an end signal (tab crash, network drop).

Ending is idempotent: repeat `/end` calls return `alreadyEnded`. Ended sessions report `status: "ended"` (or `"revoked"`) and a measured duration (`durationMs`) from `GET /v1/runtime-sessions/{sessionId}` — embeds should poll that endpoint periodically for entitlement and status anyway.

## Usage

Embed activity is metered per workspace: session count/seconds, chat messages and tokens, and speech requests/characters. Agents can read daily totals via `GET /v1/workspaces/{workspaceId}/usage?days=N` — see `docs/openapi/adam-v1.yaml`.
