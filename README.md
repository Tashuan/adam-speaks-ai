# Adam AI integration

Adam gives AI a visible, speaking presence through real-time 3D avatars with speech, lip-sync, expressions, and motion.

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
| Add an avatar to a website | [`docs/ai/EMBEDDING.md`](docs/ai/EMBEDDING.md) |
| Provision an avatar for a user | [`docs/ai/PROVISIONING.md`](docs/ai/PROVISIONING.md) |
| Connect an existing AI or chatbot | [`docs/ai/SPEECH_SOURCES.md`](docs/ai/SPEECH_SOURCES.md) |
| Let an AI agent discover and control Adam | [`docs/ai/MCP.md`](docs/ai/MCP.md) |
| Automate onboarding from a terminal | [`docs/cli/README.md`](docs/cli/README.md) |
| Understand authentication and ownership | [`docs/ai/AUTHENTICATION.md`](docs/ai/AUTHENTICATION.md) |

Start with [`docs/INTEGRATION.md`](docs/INTEGRATION.md) for the shortest decision guide or [`docs/ai/QUICKSTART.md`](docs/ai/QUICKSTART.md) for the complete provisioning flow.

## Website embed

A trusted backend or agent provisions an installation and returns an installation ID and browser-visible embed key:

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_...">
</script>
```

The browser exchanges the key for a short-lived runtime session. Never put provider keys, agent secrets, Firebase credentials, owner IDs, or account credentials in browser code.

## Agent flow

```text
authenticate agent
  → choose a template
  → provision with an idempotency key
  → install the returned embed
  → connect browser, REST, WebSocket, or MCP speech
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

## Repository scope

This is a documentation and integration contract repository. Application source, private infrastructure, deployment configuration, secrets, and the signed-in admin experience remain in the private `adam-speaks` repository.
