# Adam MCP server

The Adam MCP server lets an AI agent discover, provision, embed, and control real-time talking avatars through the same services used by the REST API.

## Endpoint

```text
POST https://adam-speaks.com/api/mcp
```

The server speaks the MCP JSON-RPC protocol over Streamable HTTP with JSON responses: `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`, and `DELETE` for session revocation. Stateless `tools/call` requests (Bearer token, no `initialize`) are also accepted. For backward compatibility, `{ "name": "<tool>", "arguments": {} }` bodies without a `method` field dispatch directly.

## Authentication

- **Anonymous session**: `initialize` without credentials returns an opaque `Mcp-Session-Id` header. Public tools work immediately; the first privileged call lazily registers a minimally scoped dynamic client server-side. The model never sees a `client_secret` or bearer token.
- **Bearer token**: register a client at `POST /api/v1/oauth/register`, then obtain a token from `/api/v1/oauth/token` and send `Authorization: Bearer <token>`. Sessions created with a bearer token are bound to that client.
- Sessions are bound to the `Origin` seen at `initialize`, expire after 24 hours, and are revocable via `DELETE /api/mcp`. `Origin`/`Host` are validated on every request.

## Tool catalog

| Tool | Purpose | Scope |
| --- | --- | --- |
| `list_avatar_templates` | Discover avatar templates (agent-friendly selection metadata) | public |
| `start_google_registration` | Composite provisioning: workspace + avatar + origin-bound installation + real embed; **never returns `claimUrl`** | `registrations:create` |
| `get_claim_url` | Mint a fresh one-time private claim URL — show the user only | `registrations:read` |
| `get_registration_status` | Registration state; `state: user_action_required` while pending | `registrations:read` |
| `wait_for_claim` | Bounded server-side wait for Google claim completion | `registrations:read` |
| `get_registration_embed` | Embed snippet + machine-readable install recipe | `registrations:read` |
| `get_installation` | Owned installation state, origins, entitlements | `installations:read` |
| `get_runtime_status` | `embedEnabled`, `speechMode`, `inactiveReason` | `installations:read` |
| `verify_installation` | Per-check verification + `nextAction` | `installations:read` |
| `deactivate_installation` | Disable an owned installation | `installations:read` (ownership) |
| `reactivate_installation` | Re-enable an agent-disabled installation | `installations:read` (ownership) |
| `provision_avatar_for_project` | Direct workspace provisioning | `workspaces:provision` |
| `list_avatars` | List avatars in a workspace | `avatars:read` |
| `get_avatar` | Read an avatar | `avatars:read` |
| `create_avatar_session` | Create a short-lived runtime session | `installations:create` |
| `get_embed_code` | Script snippet + install recipe | `installations:create` |
| `send_avatar_speech` | Send text to an active session | `speech:send` |
| `interrupt_avatar_speech` | Interrupt current speech | `speech:interrupt` |
| `get_session_status` | Inspect runtime session state | `avatars:read` |
| `get_claim_status` | Read ownership handoff state | `avatars:read` |
| `resend_claim_email` | Resend the ownership handoff | `workspaces:provision` |

## Request shape

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": { "name": "list_avatar_templates", "arguments": {} } }
```

Results use the MCP `content` + `structuredContent` envelope; tool errors return `isError: true` with the platform error code preserved.

## Recommended agent flow

1. `initialize` an anonymous session (or configure a bearer token).
2. `list_avatar_templates` and choose an avatar with the user.
3. `start_google_registration` with the exact origin, consent, and a stable idempotency key — returns the real `installationId`, `ek_` embed key, and `html`.
4. Install the embed using your own filesystem/GitHub tools (`embed.integration` describes the script placement), or hand the snippet to the user.
5. `get_claim_url` and show the private URL to the user in this conversation — never in a webpage, file, log, or git.
6. `wait_for_claim` until `completed` (timeouts return a resumable `user_action_required` state).
7. `verify_installation` with `installationId` + `embedKey` to confirm the live embed, then report the stable IDs.
8. Explain bounded preview/mock mode, trial expiry, and dashboard reactivation.

Use MCP for discovery and agent control. Use browser, REST, or WebSocket speech when the application itself needs runtime delivery.

See [MCP implementation guidance](./ai/MCP.md), [authentication](./ai/AUTHENTICATION.md), [provisioning](./ai/PROVISIONING.md), and the [OpenAPI contract](./openapi/adam-v1.yaml).
