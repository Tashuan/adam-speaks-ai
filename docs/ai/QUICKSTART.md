# AI Agent Quickstart

Adam gives an agent an immediate, origin-bound preview while keeping the ownership handoff private.

## MCP path (recommended)

The simplest integration is the MCP server at `https://adam-speaks.com/api/mcp`. `initialize` returns an anonymous `Mcp-Session-Id`; no credentials are needed up front. The first privileged tool call lazily creates a minimally scoped dynamic client server-side — the model never handles a `client_secret` or bearer token.

```text
initialize → anonymous MCP session
  → list_avatar_templates
  → start_google_registration (real install_/ek_ embed; no claimUrl in the result)
  → install the embed with your own filesystem/GitHub tools, or hand it to the user
  → get_claim_url (only source of the private URL; show it in this conversation)
  → user signs in with Google once
  → wait_for_claim (server-side wait, resumable)
  → verify_installation (granular checks + nextAction)
```

Pending registrations report `state: "user_action_required"`, `action: "google_claim"` so the agent knows exactly when the human step is outstanding. The REST flow below remains available for agents that manage their own credentials.

## REST flow

```text
dynamic agent client
  → obtain minimal bearer token
  → list avatar templates
  → start a bounded preview registration
  → add the preview embed to the website
  → show the private claimUrl in trusted chat/terminal
  → user signs in with Google once
  → poll registration and retain stable IDs
  → preview becomes an owned installation
  → trial/subscription controls runtime access
```

## 1. Bootstrap an agent client

If the agent does not already have Adam credentials, register a minimally scoped client. Keep the returned secret in the trusted agent environment only.

```bash
curl -X POST https://adam-speaks.com/api/v1/oauth/register \
  -H 'Content-Type: application/json' \
  -d '{"client_name":"My app agent","idempotency_key":"my-app-adam-setup-001"}'
```

Use the returned credentials to obtain a token. The OAuth endpoints use `snake_case` fields; the rest of the API uses `camelCase`.

```bash
curl -X POST https://adam-speaks.com/api/v1/oauth/token \
  -H 'Content-Type: application/json' \
  -d '{"grant_type":"client_credentials","client_id":"ac_...","client_secret":"as_...","scope":"avatars:read registrations:create registrations:read"}'
```

Response: `{ "access_token": "...", "token_type": "Bearer", "expires_in": 3600 }`

## 2. Start the preview registration

List templates and choose one with the user. This endpoint is public and does not require the token:

```bash
curl https://adam-speaks.com/api/v1/avatar-templates
```

Response: `{ "templates": [{ "templateId": "template_friendly_01", "name": "...", "description": "...", "runtimePresetId": "...", "capabilities": [...], "status": "active" }] }`

Then call `POST /v1/registrations` with the exact website origin, consent, and a stable idempotency key. The origin is scheme + host + optional port with no path — e.g. `https://example.com` for a site or `http://localhost:8123` for local development. `displayName` is the site owner's name; `projectName` labels the workspace.

```bash
curl -X POST https://adam-speaks.com/api/v1/registrations \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"displayName":"Site owner","projectName":"My site","templateId":"template_friendly_01","origin":"https://example.com","idempotencyKey":"my-site-adam-001","consent":{"termsAccepted":true,"privacyAccepted":true}}'
```

Response:

```json
{
  "registrationId": "reg_...",
  "status": "google_authorization_required",
  "claimUrl": "https://adam-speaks.com/auth/agent/google?registrationId=reg_...#claim=claim_...",
  "authorizationUrl": "https://adam-speaks.com/auth/agent/google?registrationId=reg_...#claim=claim_...",
  "workspaceId": "wK8pQ2mN9xRtYhB4vC6d",
  "avatarId": "aF3jL7pR1sT9wX2bN5kM",
  "installationId": "Xy9kPq2mN7wRtVb4cL6d",
  "speechMode": "mock",
  "embed": {
    "installationId": "Xy9kPq2mN7wRtVb4cL6d",
    "embedKey": "ek_...",
    "scriptUrl": "https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js",
    "html": "<script src=\"...\" data-installation-id=\"Xy9kPq2mN7wRtVb4cL6d\" data-embed-key=\"ek_...\"></script>"
  },
  "speech": {
    "browserExample": "window.AdamAvatar.speak(\"Hello\");",
    "restEndpoint": "/v1/installations/Xy9kPq2mN7wRtVb4cL6d/speech",
    "websocketEndpoint": "/v1/runtime-sessions/{sessionId}/stream"
  },
  "expiresAt": 1234567890000
}
```

`workspaceId`, `avatarId`, and `installationId` are opaque strings with no fixed prefix. Prefixed values are `registrationId` (`reg_`), `embedKey` (`ek_`), client credentials (`ac_`/`as_`), and claim tokens (`claim_`). Do not validate IDs by prefix.

`embed.html` is the ready-to-paste snippet with real values; `embed.installationId` and `embed.embedKey` are the same values as discrete fields. Add only the embed to the website. Show `claimUrl` directly to the user through the trusted agent conversation. Never put the claim URL in HTML, source code, public page text, logs, or git.

Retry safety uses the body `idempotencyKey`; the optional `X-Request-ID` header is only an echoed tracing ID.

## 3. Complete ownership

The user opens the private URL and clicks the Google sign-in button. Adam verifies the Firebase identity, attaches the existing preview workspace/avatar/installation to that account, and starts or recognizes the account trial.

Poll `GET /v1/registrations/{registrationId}` with the agent token until `status` is `completed`, or call `POST /v1/registrations/{registrationId}/wait` with `{ "timeoutSeconds": 120 }` to wait server-side (MCP: `wait_for_claim`). The status moves from `google_authorization_required` to `completed`, or `expired` once `expiresAt` passes (7 days). While pending, responses carry `state: "user_action_required"`, `action: "google_claim"`. The completed response omits `claimUrl` and sets `authorizationUrl` to `null`. `workspaceId`, `avatarId`, and `installationId` remain stable.

If the user needs the link again, `POST /v1/registrations/{registrationId}/claim-url` (MCP: `get_claim_url`) mints a fresh one-time URL for the pending registration.

## 4. Embed

Emit this file only with the real `installationId` and `ek_` embed key returned in step 2; a page with placeholders cannot create a runtime session.

```html
<script src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="Xy9kPq2mN7wRtVb4cL6d"
  data-embed-key="ek_..."></script>
```

The installation key is a scoped browser capability. It is never an agent or account credential.

The embed block also carries a machine-readable recipe for coding agents: `integration: { type: "script", placement: "body", requires: [] }` and `verification.recommendedPageUrl`. After installing, call `POST /v1/installations/{installationId}/verify` (MCP: `verify_installation`) — it checks installation state, origin binding, entitlements, fetches the page for the embed tag, and optionally smoke-tests a runtime session when you pass `embedKey`. The response reports per-check results and a `nextAction` such as `install_embed` or `fix_installation_id`.

## 5. Trial and inactive states

Preview rendering and mock/canned speech can work before ownership is completed. After claim, the server independently evaluates trial/subscription entitlements. When a trial ends without an active subscription, the widget quietly enters its inactive state; it does not show a billing button or redirect public visitors. The owner reactivates from the authenticated Adam account/billing dashboard without re-embedding.

See [claim and activation](./CLAIM_AND_ACTIVATION.md), [embedding](./EMBEDDING.md), and [speech sources](./SPEECH_SOURCES.md).
