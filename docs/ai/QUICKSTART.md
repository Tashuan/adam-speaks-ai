# AI Agent Quickstart

Adam gives an agent an immediate, origin-bound preview while keeping the ownership handoff private.

## Flow

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

Use the returned credentials to obtain a token with `avatars:read registrations:create registrations:read`.

## 2. Start the preview registration

List templates, choose one with the user, and call `POST /v1/registrations` with the exact website origin, consent, and a stable idempotency key.

The response includes a normal browser embed and a private one-time `claimUrl`. Add only the embed to the website. Show `claimUrl` directly to the user through the trusted agent conversation. Never put the claim URL in HTML, source code, public page text, logs, or git.

## 3. Complete ownership

The user opens the private URL and clicks the Google sign-in button. Adam verifies the Firebase identity, attaches the existing preview workspace/avatar/installation to that account, and starts or recognizes the account trial.

Poll `GET /v1/registrations/{registrationId}` with the agent token until `status` is `completed`. `workspaceId`, `avatarId`, and `installationId` remain stable.

## 4. Embed

```html
<script src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_..."></script>
```

The installation key is a scoped browser capability. It is never an agent or account credential.

## 5. Trial and inactive states

Preview rendering and mock/canned speech can work before ownership is completed. After claim, the server independently evaluates trial/subscription entitlements. When a trial ends without an active subscription, the widget quietly enters its inactive state; it does not show a billing button or redirect public visitors. The owner reactivates from the authenticated Adam account/billing dashboard without re-embedding.

See [claim and activation](./CLAIM_AND_ACTIVATION.md), [embedding](./EMBEDDING.md), and [speech sources](./SPEECH_SOURCES.md).
