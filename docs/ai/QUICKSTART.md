# AI Agent Quickstart

Adam lets an authenticated agent provision a provisional avatar before the user has an Adam account.

## Flow

```text
dynamic agent client
  → obtain minimal bearer token
  → list avatar templates
  → start hosted Google registration
  → user signs in once
  → poll registration and add generated embed
  → send text to the speech endpoint
  → user manages the claimed avatar later
```

## 1. Bootstrap an agent client

If the agent does not already have Adam credentials, register a minimally scoped client. Keep the returned secret in the trusted agent environment only; never put it in the app or browser bundle.

```bash
curl -X POST https://adam-speaks.com/api/v1/oauth/register \
  -H 'Content-Type: application/json' \
  -d '{"client_name":"My app agent","idempotency_key":"my-app-adam-setup-001"}'
```

Use the returned client credentials to obtain a token with `avatars:read registrations:create registrations:read`.

## 2. Start hosted registration

The agent should list templates, ask the user to choose one, and call `POST /v1/registrations` with the user's website origin and stable idempotency key. Show the returned `authorizationUrl` to the user and poll the registration status after Google sign-in.

## 3. Retrieve the completed embed

After the user completes Google sign-in, poll `GET /v1/registrations/{registrationId}` until `status` is `completed`. The response contains the stable avatar and installation IDs plus the generated embed payload. The agent can then add the embed to the user's app.

## 4. Embed

```html
<script src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_..."></script>
```

## 5. Speak

The provisional avatar accepts speech immediately but uses a canned mock response. Live speech becomes available after the workspace is claimed and its entitlements permit it.

See [speech sources](./SPEECH_SOURCES.md) for browser, REST, WebSocket, and MCP usage.
