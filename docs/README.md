# Adam integration documentation

Adam connects websites, applications, AI systems, and live experiences to a real-time talking avatar. The public contract is organized around a stable avatar, a scoped installation, and short-lived runtime sessions.

## Start here

- [Agent integration prompt](./ai/AGENT_PROMPT.md) — the recommended behavior for an agent asked to add Adam.
- [AI quickstart](./ai/QUICKSTART.md) — bootstrap an agent, register a user, embed, and speak.
- [Integration guide](./INTEGRATION.md) — choose the right path for a website, existing AI, or agent.
- [MCP server guide](./MCP.md) — endpoint, scopes, tool catalog, and agent flow.
- [CLI guide](./CLI.md) — install and use the public Node 20+ command-line client.
- [Agent skills](../skills/README.md) — canonical and platform-specific skills for agents.
- [OpenAPI contract](./openapi/adam-v1.yaml) — canonical machine-readable API definition.

## Avatar and application integration

- [Authentication](./ai/AUTHENTICATION.md)
- [Provisioning](./ai/PROVISIONING.md)
- [Embedding](./ai/EMBEDDING.md)
- [Speech sources](./ai/SPEECH_SOURCES.md)
- [MCP](./ai/MCP.md)
- [Claim and activation](./ai/CLAIM_AND_ACTIVATION.md)
- [Account avatar management](./ai/ACCOUNT_AVATARS.md)

## MCP and automation

- [MCP server](./MCP.md)
- [CLI overview](./CLI.md)
- [CLI command reference](./cli/COMMAND_REFERENCE.md)
- [Hosted registration flow](./cli/REGISTRATION_FLOW.md)

## API, architecture, and security

- [Session lifecycle](./api/SESSION_LIFECYCLE.md)
- [Error codes](./api/ERROR_CODES.md)
- [Webhooks and events](./api/WEBHOOKS_AND_EVENTS.md)
- [Platform overview](./architecture/PLATFORM_OVERVIEW.md)
- [Authorization](./security/AUTHORIZATION.md)
- [Installation keys](./security/INSTALLATION_KEYS.md)
- [BYOK isolation](./security/BYOK_ISOLATION.md)

## Public contract rules

- Keep provider credentials and agent secrets server-side.
- Treat installation keys as browser-visible, scoped capabilities.
- Use a stable idempotency key when provisioning or registering a project.
- Preserve `workspaceId`, `avatarId`, and `installationId` after claim.
- Update the relevant Markdown guide and [`openapi/adam-v1.yaml`](./openapi/adam-v1.yaml) together when an API contract changes.
