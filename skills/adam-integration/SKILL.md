---
name: adam-integration
description: Discover, provision, embed, and remotely control Adam real-time talking avatars from websites, applications, AI systems, services, and agents.
---

# Adam integration skill

Use this skill whenever a user asks to add, embed, control, provision, or troubleshoot an Adam avatar.

Adam is an embeddable, remote-controllable real-time talking avatar. It can be controlled by an AI system, web application, backend service, live operator, game, kiosk, event experience, or agent. It provides speech, lip-sync, expressions, and motion.

## Choose the smallest path

- Website or application embed: read `docs/ai/EMBEDDING.md`.
- Existing application, chatbot, or service control: read `docs/ai/SPEECH_SOURCES.md`.
- Agent provisioning: read `docs/ai/QUICKSTART.md` and `docs/ai/PROVISIONING.md`.
- Authenticated avatar management: read `docs/ai/ACCOUNT_AVATARS.md`.
- MCP discovery and control: read `docs/MCP.md`.
- Terminal automation: read `docs/CLI.md`.
- Exact endpoints and schemas: read `docs/openapi/adam-v1.yaml`.

## Standard workflow

1. Clarify the use case: website embed, application control, agent provisioning, or MCP control.
2. If the agent has no Adam credentials, register a minimally scoped dynamic client at `POST /v1/oauth/register`; keep the one-time secret only in the trusted agent environment.
3. Obtain a token with `avatars:read`, `registrations:create`, and `registrations:read` for the hosted registration flow.
4. List templates and select one with the user.
5. Start hosted Google registration with the website origin and a stable idempotency key.
6. Ask the user to sign in once, poll registration status, and retrieve the completed embed.
7. Preserve the returned `workspaceId`, `avatarId`, `installationId`, and registration identifiers.
8. Install the returned browser snippet or create a runtime session.
9. Send speech through browser, REST, WebSocket, or MCP control.
10. Explain mock/live entitlement behavior. After claim, the user can manage the avatar from the authenticated Adam dashboard without changing stable IDs or re-embedding.

## MCP server

The MCP endpoint is:

```text
POST https://adam-speaks.com/api/mcp
```

Important tools include:

```text
list_avatar_templates
provision_avatar_for_project
list_avatars
get_avatar
create_avatar_session
get_embed_code
send_avatar_speech
interrupt_avatar_speech
get_session_status
get_claim_status
resend_claim_email
start_google_registration
get_registration_status
get_registration_embed
```

Use `docs/MCP.md` for required scopes, request shape, and the complete tool catalog.

## CLI

The public CLI is in `cli/` and requires Node 20 or newer:

```bash
cd cli
npm install
npm link
adam doctor
adam avatar templates --format json
```

Credentials belong only in the trusted environment. Existing partner agents may use:

```bash
export ADAM_AGENT_CLIENT_ID="..."
export ADAM_AGENT_CLIENT_SECRET="..."
```

A new agent can bootstrap a minimally scoped client in the current process:

```bash
adam agent register --name "My app agent" --format json
```

Never write the returned secret into app source, browser code, `.env` files, logs, or git. Use `docs/CLI.md` and `docs/cli/COMMAND_REFERENCE.md` for registration, polling, and embed commands.

## Website embed

Use installation details returned by a trusted backend or agent:

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_...">
</script>
```

## Security rules

- Never put agent client secrets or provider keys in browser code.
- Treat installation keys as scoped, revocable browser capabilities.
- Runtime tokens are short-lived and scoped to one installation, avatar, and session.
- Use stable idempotency keys for retries.
- Do not log raw credentials, installation keys, or user tokens.
- Do not invent undocumented endpoints, tools, scopes, or resource fields.

## Failure handling

- If the user has not chosen a template, list templates before provisioning.
- If provisioning is retried, reuse the same idempotency key.
- If a provisional avatar speaks in mock mode, explain that claim and entitlement activation enable live behavior.
- If the user needs runtime speech from an application, use browser, REST, or WebSocket documentation rather than MCP-only guidance.
- If a request requires an unsupported capability, say so and point to the closest documented transport.
