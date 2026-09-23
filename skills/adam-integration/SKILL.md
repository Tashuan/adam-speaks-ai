---
name: adam-integration
description: Discover, provision, embed, and remotely control Adam real-time talking avatars from websites, applications, AI systems, services, and agents.
---

# Adam integration skill

Use this skill whenever a user asks to add, embed, control, provision, or troubleshoot an Adam avatar — including requests to generate a page, snippet, or file containing the embed.

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

A working embed requires a real `installationId` and `ek_` embed key returned by a registration response; they cannot be hand-written. Installation, workspace, and avatar IDs are opaque strings with no fixed prefix — do not validate them by prefix. Never emit placeholder embed code — if the values do not exist yet, the provisioning workflow is the task.

1. Clarify the use case: website embed, application control, agent provisioning, or MCP control.
2. If the agent has no Adam credentials, register a minimally scoped dynamic client at `POST /v1/oauth/register`; keep the one-time secret only in the trusted agent environment. MCP users can instead `initialize` an anonymous session — the server bootstraps credentials lazily on first privileged call.
3. Obtain a token with `avatars:read`, `registrations:create`, `registrations:read`, and `installations:read` for the hosted registration flow.
4. List templates and select one with the user.
5. Start an origin-bound preview registration with a stable idempotency key.
6. Install the returned preview embed — the `embed.integration` recipe says it is a `script` placed in `body` — then show the private one-time `claimUrl` only in trusted chat or terminal. Never put it in browser code, public page text, logs, or git.
7. Wait for Google sign-in (`wait_for_claim` / `POST /v1/registrations/{id}/wait`) and preserve the returned `workspaceId`, `avatarId`, `installationId`, and registration identifiers.
8. Verify the live install with `verify_installation` / `POST /v1/installations/{id}/verify` and act on `nextAction`.
9. Explain that preview behavior is bounded and mock/canned; after claim, avatar rendering and speech follow trial/subscription entitlements.
10. If a trial ends, explain that the public widget becomes inactive without a billing CTA and that the owner reactivates from the Adam account dashboard without re-embedding.
11. Send speech through browser, REST, WebSocket, or MCP control.

## MCP server

The MCP endpoint is:

```text
POST https://adam-speaks.com/api/mcp
```

It speaks standard MCP JSON-RPC (`initialize`, `tools/list`, `tools/call`, `DELETE` for session revoke) and also accepts `{ "name": "<tool>", "arguments": {} }`. `initialize` returns an anonymous `Mcp-Session-Id`; privileged calls lazily create a scoped dynamic client server-side, so the model never sees credentials.

Important tools include:

```text
list_avatar_templates          (public)
start_google_registration      composite provisioning; never returns claimUrl
get_claim_url                  sole source of the private claim URL
get_registration_status        state=user_action_required while pending
wait_for_claim                 bounded server-side wait
get_registration_embed         embed + machine-readable install recipe
get_installation               owned installation state
get_runtime_status             embedEnabled / speechMode / inactiveReason
verify_installation            granular checks + nextAction
deactivate_installation        disable owned installation
reactivate_installation        re-enable owned installation
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
```

Discovery: `GET /.well-known/adam-agent.json`, `/.well-known/oauth-protected-resource`, `/.well-known/oauth-authorization-server`.

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

Use only installation details returned by a registration response or a trusted backend. If you do not have a real `installationId` and `ek_` embed key, run the provisioning workflow first — never emit this snippet with placeholders. The same snippet renders the bounded preview before claim and the owned installation after claim:

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="Xy9kPq2mN7wRtVb4cL6d"
  data-embed-key="ek_...">
</script>
```

The private `claimUrl` is not part of the snippet. Show it only in the trusted agent/user channel.

## Security rules

- Never put agent client secrets or provider keys in browser code.
- Treat installation keys as scoped, revocable browser capabilities.
- Treat claim URLs as one-time private handoff credentials; never put them in webpages or logs.
- Runtime tokens are short-lived and scoped to one installation, avatar, and session.
- Enforce exact website origins; origin checks do not replace token scoping.
- Use stable idempotency keys for retries.
- Do not log raw credentials, installation keys, claim tokens, or user tokens.
- Do not invent undocumented endpoints, tools, scopes, or resource fields.

## Failure handling

- If the user has not chosen a template, list templates before provisioning.
- If provisioning is retried, reuse the same idempotency key.
- If a preview avatar speaks in mock mode, explain that the private claim handoff, trial, and subscription entitlements control production behavior.
- If the user needs runtime speech from an application, use browser, REST, or WebSocket documentation rather than MCP-only guidance.
- If a request requires an unsupported capability, say so and point to the closest documented transport.
- If you cannot make network calls, ask for the exact website origin and template choice and give the user the CLI or curl commands to run; do not produce a placeholder page.
