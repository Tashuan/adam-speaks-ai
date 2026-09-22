# Adam real-time avatar integration

Adam is an embeddable, remote-controllable real-time talking avatar for websites, applications, products, and interactive experiences.

Connect it to an AI system, application, service, game, kiosk, support flow, educational experience, event, or live control surface. Adam turns commands and text into speech, lip-sync, expressions, and motion without requiring one specific model or framework.

This repository contains the public integration contract for developers and AI agents. It does not contain the private Adam application, admin console, Firebase infrastructure, or runtime source.

- Product: [adam-speaks.com](https://adam-speaks.com/)
- Add an avatar: [adam-speaks.com/add-an-ai-avatar](https://adam-speaks.com/add-an-ai-avatar)
- Human documentation: [adam-speaks.com/documentation](https://adam-speaks.com/documentation)
- API reference: [adam-speaks.com/api-reference](https://adam-speaks.com/api-reference)
- Machine-readable discovery: [`llms.txt`](llms.txt)
- OpenAPI contract: [`docs/openapi/adam-v1.yaml`](docs/openapi/adam-v1.yaml)

## Choose a path

| You want to… | Read |
| --- | --- |
| Add an avatar to a website or application | [`docs/ai/EMBEDDING.md`](docs/ai/EMBEDDING.md) |
| Control an avatar from an application or service | [`docs/ai/SPEECH_SOURCES.md`](docs/ai/SPEECH_SOURCES.md) |
| Provision an avatar for a user | [`docs/ai/PROVISIONING.md`](docs/ai/PROVISIONING.md) |
| Let an AI agent discover and control Adam | [`docs/ai/MCP.md`](docs/ai/MCP.md) |
| Automate onboarding from a terminal | [`docs/cli/README.md`](docs/cli/README.md) |
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

## Agent flow

```text
authenticate agent
  → choose a template
  → provision with an idempotency key
  → install the returned embed
  → connect browser, REST, WebSocket, or MCP control
  → user claims the workspace later
```

Provisional workspaces may begin in mock mode. `avatarId` and `installationId` remain stable through claim and activation.

## Public contract

- [`docs/ai/`](docs/ai/) — agent, provisioning, embedding, speech, and MCP guides
- [`docs/api/`](docs/api/) — sessions, events, and errors
- [`docs/cli/`](docs/cli/) — CLI commands and hosted registration
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
