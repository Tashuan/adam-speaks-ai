# Adam real-time avatar integration

Adam is an embeddable, remote-controllable real-time talking avatar for websites, applications, products, and interactive experiences.

Connect it to an AI system, application, service, game, kiosk, support flow, educational experience, event, or live control surface. Adam turns commands and text into speech, lip-sync, expressions, and motion without requiring one specific model or framework.

This repository contains the public integration contract for developers and AI agents. It does not contain the private Adam application, admin console, Firebase infrastructure, or runtime source.

- Product: [adam-speaks.com](https://adam-speaks.com/)
- Add an avatar: [adam-speaks.com/add-an-ai-avatar](https://adam-speaks.com/add-an-ai-avatar)
- Human documentation: [adam-speaks.com/documentation](https://adam-speaks.com/documentation)
- API reference: [adam-speaks.com/api-reference](https://adam-speaks.com/api-reference)
- Machine-readable discovery: [`llms.txt`](llms.txt)
- MCP server guide: [`docs/MCP.md`](docs/MCP.md)
- CLI guide: [`docs/CLI.md`](docs/CLI.md)
- Agent skills: [`skills/README.md`](skills/README.md)
- OpenAPI contract: [`docs/openapi/adam-v1.yaml`](docs/openapi/adam-v1.yaml)

## Give this prompt to your AI agent

Paste this into ChatGPT, Claude, or your coding agent to start the real provisioning flow — it returns a working embed, not a placeholder snippet:

```text
I want you to add an Adam talking avatar to my website. The integration contract is at https://github.com/Tashuan/adam-speaks-ai — read llms.txt, docs/ai/AGENT_PROMPT.md, and docs/ai/QUICKSTART.md before doing anything.

Do NOT just give me an embed snippet with placeholder values. Run the actual provisioning flow:

1. Register a minimally scoped dynamic client at POST https://adam-speaks.com/api/v1/oauth/register.
2. Get a bearer token with scopes: avatars:read registrations:create registrations:read.
3. List the avatar templates and let me pick one — if only one exists, use it.
4. Start a preview registration with a stable idempotency key, my website origin, my project name, and consent flags.
5. Give me the final embed snippet using the real installationId and ek_ embed key from the registration response — never placeholders.
6. Show me the private claimUrl here in chat only — never in the webpage or source code.
7. After I complete the Google sign-in, poll the registration status and tell me which IDs to save.

If my website origin below is still a placeholder, ask me for the real origin before registering — the embed only works on the exact origin used at registration.
If you cannot make HTTP requests, give me the exact curl commands to run myself, in order, and tell me where each response value goes.

My website origin: https://your-site.com
Project name: My project
```

If you are the agent reading this: the prompt above is a request to run the flow in [`docs/ai/QUICKSTART.md`](docs/ai/QUICKSTART.md), not to emit a page with placeholder values.

## Choose a path

| You want to… | Read |
| --- | --- |
| Add an avatar to a website or application | [`docs/ai/EMBEDDING.md`](docs/ai/EMBEDDING.md) |
| Control an avatar from an application or service | [`docs/ai/SPEECH_SOURCES.md`](docs/ai/SPEECH_SOURCES.md) |
| Provision an avatar for a user | [`docs/ai/PROVISIONING.md`](docs/ai/PROVISIONING.md) |
| Let an AI agent discover and control Adam | [`docs/MCP.md`](docs/MCP.md) |
| Automate onboarding from a terminal | [`docs/CLI.md`](docs/CLI.md) |
| Understand authentication and ownership | [`docs/ai/AUTHENTICATION.md`](docs/ai/AUTHENTICATION.md) |

Start with [`docs/INTEGRATION.md`](docs/INTEGRATION.md) for the shortest decision guide or [`docs/ai/QUICKSTART.md`](docs/ai/QUICKSTART.md) for the complete provisioning flow.

## Website and application embed

A working embed requires a real `installationId` and `embedKey` returned by the registration flow in [`docs/ai/QUICKSTART.md`](docs/ai/QUICKSTART.md); they cannot be hand-written. If you are an agent asked to produce an embed, snippet, or page and do not already have these values, run the provisioning flow first — never ship placeholders. If you cannot make network calls, ask the user for the exact website origin and template choice, then give them the commands to run.

An agent-created installation starts as an origin-bound preview and becomes owned after the user completes a private Google claim handoff:

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="Xy9kPq2mN7wRtVb4cL6d"
  data-embed-key="ek_...">
</script>
```

The browser exchanges the key for a short-lived runtime session. The separate one-time `claimUrl` is shown only in trusted agent/user chat or terminal output. Never put it, provider keys, agent secrets, Firebase credentials, owner IDs, or account credentials in browser code.

A copied claimed or unclaimed embed is rejected for runtime access on an unauthorized origin. Preview behavior is bounded mock behavior and does not expose account data or claim authority.

## Remote control

Adam can receive speech and control events from:

- An AI assistant or model
- A web application
- A backend service
- A support or education workflow
- A game, kiosk, event, or interactive installation
- An AI agent using MCP

Supported transports include browser, REST, WebSocket, and MCP. Each uses the same server-side speech lifecycle.

## MCP server

Adam's MCP endpoint gives scoped agents a direct control surface for template discovery, embed generation, session creation, speech, registration, and claim status. New agents bootstrap through the REST dynamic-client endpoint before connecting to MCP; direct workspace provisioning remains restricted to approved clients:

```text
POST https://adam-speaks.com/api/mcp
```

Start with [`docs/MCP.md`](docs/MCP.md) for the endpoint, scopes, tool catalog, request shape, and recommended agent flow.

## CLI

The public CLI source is in [`cli/`](cli/). It requires Node 20 or newer and supports discovery, preview registration, private claim handoff, status polling, and embed generation:

```bash
cd cli
npm install
npm link
adam doctor
adam avatar templates --format json
```

Read [`docs/CLI.md`](docs/CLI.md) for installation and [`docs/cli/COMMAND_REFERENCE.md`](docs/cli/COMMAND_REFERENCE.md) for all commands.

## Agent flow

```text
bootstrap a minimally scoped agent client
  → obtain a bearer token
  → choose a template and exact website origin
  → start an origin-bound preview registration
  → embed the returned preview installation
  → show the private claimUrl in trusted chat/terminal
  → user signs in once
  → poll registration and preserve stable IDs
  → connect browser, REST, WebSocket, or MCP control
  → user manages or reactivates the avatar later
```

Preview behavior is bounded and mock/canned. After claim, avatar rendering and speech follow trial/subscription entitlements. When a trial ends without an active subscription, the public widget becomes inactive without a billing CTA; the owner reactivates from the authenticated Adam account without re-embedding. `workspaceId`, `avatarId`, and `installationId` remain stable.

## Public contract

- [`docs/ai/`](docs/ai/) — agent, provisioning, embedding, speech, and MCP guides
- [`docs/api/`](docs/api/) — sessions, events, and errors
- [`cli/`](cli/) — public Node 20+ CLI source
- [`docs/cli/`](docs/cli/) — CLI commands and hosted registration
- [`skills/`](skills/) — canonical and platform-specific agent skills
- [`docs/openapi/`](docs/openapi/) — machine-readable API definition
- [`docs/security/`](docs/security/) — authorization, installation keys, and credential isolation
- [`examples/`](examples/) — minimal integration snippets

## Security principles

- Agent credentials remain server-side.
- Installation keys are scoped browser capabilities, not account credentials.
- Claim URLs are one-time private handoff credentials and never belong in browser code or public page content.
- Runtime tokens are short-lived and scoped to one installation, avatar, and session.
- Exact website origins are enforced for runtime access.
- Provisioning is idempotent and rate-limited.
- Provider credentials never enter the embed or runtime configuration.

See [`docs/security/INSTALLATION_KEYS.md`](docs/security/INSTALLATION_KEYS.md), [`docs/security/AUTHORIZATION.md`](docs/security/AUTHORIZATION.md), and [`docs/security/BYOK_ISOLATION.md`](docs/security/BYOK_ISOLATION.md).
