# Adam integration guide

Use this page to choose the smallest correct integration path.

## If you are adding Adam to a website

1. Obtain an installation ID and embed key from a trusted backend or agent.
2. Add the installation script to the website.
3. Send speech from the browser or your server.
4. Keep provider and agent credentials off the page.

Read [Embedding](./ai/EMBEDDING.md) and [Speech sources](./ai/SPEECH_SOURCES.md).

## If you already have an AI or chatbot

Keep your existing model and orchestration. Send completed text to Adam through:

- Browser runtime speech
- REST speech
- WebSocket speech
- MCP tools for agent-controlled workflows

All transports use the same speech lifecycle and server-side orchestration. Read [Speech sources](./ai/SPEECH_SOURCES.md).

## If an AI agent is setting it up

The agent should:

1. Authenticate with Adam agent credentials.
2. List templates and choose one with the user.
3. Ask for the user's email and website origin.
4. Provision with a stable idempotency key.
5. Return the installation snippet and preserve the returned IDs.
6. Explain that the initial workspace may use mock speech.
7. Let the user claim the workspace later.

Read [AI quickstart](./ai/QUICKSTART.md), [Provisioning](./ai/PROVISIONING.md), and [Claim and activation](./ai/CLAIM_AND_ACTIVATION.md).

## If an agent needs direct tool discovery

Use the MCP contract to discover templates, provision avatars, create sessions, retrieve embed code, send speech, and check claim status.

Read [MCP](./ai/MCP.md).

## If you need terminal automation

The CLI provides checks, template discovery, hosted registration, registration polling, and embed generation. It requires Node 20 or newer.

Read [CLI overview](./cli/README.md).

## Resource model

```text
agent credentials
  → workspace
  → stable avatar
  → scoped installation
  → short-lived runtime session
  → speech and animation events
```

`avatarId` and `installationId` are stable resource identifiers. `sessionId` and runtime tokens are temporary.

## Security checklist

- Never put `ADAM_AGENT_CLIENT_SECRET` in browser code.
- Never put provider API keys in the embed.
- Validate the website origin during provisioning and session creation.
- Use idempotency keys for retries.
- Treat embed keys as revocable browser capabilities.
- Do not log raw credentials or user tokens.

See [Authorization](./security/AUTHORIZATION.md), [Installation keys](./security/INSTALLATION_KEYS.md), and [BYOK isolation](./security/BYOK_ISOLATION.md).
