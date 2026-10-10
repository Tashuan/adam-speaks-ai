# Authentication

Adam uses three agent authentication stages:

- Dynamic client bootstrap for a new AI agent. `POST /v1/oauth/register` returns a one-time client secret with only `avatars:read`, `registrations:create`, `registrations:read`, and `installations:read`.
- OAuth client credentials for the agent to discover templates and start an origin-bound preview with a private Google claim handoff for a user who has not created an Adam account yet.
- OAuth authorization-code with PKCE/delegated access when an agent acts for an existing Adam user.

Dynamic client secrets belong in the trusted agent environment only. They must not be written into the user's app, browser bundle, `.env` file, logs, or repository. The preview embed is separate from the one-time private `claimUrl`, which must be shown only in trusted agent/user chat or terminal output. Google ownership is what attaches the resulting avatar to the user's Adam account.

The MCP server offers a fourth path: `POST /api/mcp` `initialize` without credentials returns an anonymous `Mcp-Session-Id`. Public tools run immediately; the first privileged call lazily registers the session's dynamic client server-side and scopes the session to the dynamic-client set (`avatars:read`, `registrations:create`, `registrations:read`, `installations:read`). No `client_secret` or bearer token ever appears in a tool result — the model only handles the opaque session header. Sessions are Origin-bound, expire after 24 hours, and are revocable with `DELETE /api/mcp`. MCP OAuth discovery is available at `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server`.

For delegated access, send the authenticated user to `GET /v1/oauth/authorize` with `client_id`, a registered `redirect_uri`, `scope`, `code_challenge`, and `code_challenge_method=S256`. Exchange the one-time code at `POST /v1/oauth/token` with the original `code_verifier`. Authorization codes expire after five minutes and are single-use.

Installation keys are browser-visible, scoped capabilities. They cannot list avatars, change account data, or authorize another workspace. Runtime tokens are short-lived and scoped to one installation/avatar/session — the embed delivers them to the avatar iframe over `postMessage`, never in the iframe URL.

## Agent token handling

The bearer token from `POST /v1/oauth/token` is an **ownership credential**, not just a read credential: anyone holding it can mint fresh private claim URLs for that client's pending registrations, so treat it like the `client_secret` it was minted from — agent environment only, never in page source, logs, or transcripts.

- Tokens expire after **one hour** (`expires_in: 3600`). Mint a fresh one with the stored `client_id`/`client_secret` rather than caching past expiry; a mid-flow `AUTH_INVALID` after an hour is expected, not a broken flow.
- Registration claim tokens are one-time and bound to a registration; the bearer agent token is what authorizes `reissueClaimUrl`, which is why it must stay private.

## Revoking a dynamic client

`POST /v1/oauth/revoke` permanently disables a dynamically registered client. Authenticate with the client credentials — no bearer token required (the token may already be expired or leaked):

```json
{ "client_id": "ac_...", "client_secret": "as_..." }
```

→ `{ "client_id": "ac_...", "status": "revoked" }`

Revocation stops all new token issuance (`AGENT_CLIENT_REVOKED` on `/oauth/token`). Already-issued bearer tokens remain valid until their one-hour expiry — rotate quickly means revoke first, then wait out the hour; sessions and installations are unaffected. Statically provisioned clients cannot be revoked through this endpoint.
