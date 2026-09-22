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

A trusted backend or agent provisions an installation and returns an installation ID and browser-visible embed key:

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_...">
</script>
```

The browser exchanges the key for a short-lived runtime session. Never put provider keys, agent secrets, Firebase credentials, owner IDs, or account credentials in browser code.

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

The public CLI source is in [`cli/`](cli/). It requires Node 20 or newer and supports discovery, hosted registration, status polling, and embed generation:

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
  → choose a template
  → start hosted Google registration
  → user signs in once
  → poll registration and install the returned embed
  → connect browser, REST, WebSocket, or MCP control
  → user manages the claimed avatar later
```

Provisional workspaces may begin in mock mode. Claiming updates workspace, avatar, installation, and entitlement ownership. `workspaceId`, `avatarId`, and `installationId` remain stable, and later dashboard edits do not require re-embedding.

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
- Runtime tokens are short-lived and scoped to one installation, avatar, and session.
- Provisioning is idempotent and rate-limited.
- Provider credentials never enter the embed or runtime configuration.

See [`docs/security/INSTALLATION_KEYS.md`](docs/security/INSTALLATION_KEYS.md), [`docs/security/AUTHORIZATION.md`](docs/security/AUTHORIZATION.md), and [`docs/security/BYOK_ISOLATION.md`](docs/security/BYOK_ISOLATION.md).
