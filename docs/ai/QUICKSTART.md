# AI Agent Quickstart

Adam lets an authenticated agent provision a provisional avatar before the user has an Adam account.

## Flow

```text
agent client credentials
  → list avatar templates
  → collect user email
  → provision workspace
  → add generated embed
  → send text to the speech endpoint
  → mock response now
  → user claims/configures later
```

## 1. Get an agent token

Use the client-credentials endpoint with an Adam-issued client ID and secret:

```bash
curl -X POST https://adam-speaks.com/api/v1/oauth/token \
  -H 'Content-Type: application/json' \
  -d '{"grant_type":"client_credentials","client_id":"...","client_secret":"...","scope":"workspaces:provision"}'
```

## 2. Provision

```bash
curl -X POST https://adam-speaks.com/api/v1/provisioning/workspaces \
  -H "Authorization: Bearer AGENT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","templateId":"template_friendly_01","origin":"https://example.com","projectName":"My site","idempotencyKey":"project-install-001"}'
```

The response contains `avatarId`, `installationId`, `embedKey`, mock status, claim instructions, and speech-source instructions.

## 3. Embed

```html
<script src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_..."></script>
```

## 4. Speak

The provisional avatar accepts speech immediately but uses a canned mock response. Live speech becomes available after the workspace is claimed and its entitlements permit it.

See [speech sources](./SPEECH_SOURCES.md) for browser, REST, WebSocket, and MCP usage.
