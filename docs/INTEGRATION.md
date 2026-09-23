# Adam integration guide

Adam is an embeddable, remote-controllable real-time talking avatar. Use this page to choose the smallest correct integration path.

## If you are adding Adam to a website or application

1. Get a real installation ID and embed key. If you are an agent, obtain them yourself through the hosted registration flow in [AI quickstart](./ai/QUICKSTART.md); they cannot be hand-written and a page with placeholder values cannot create a runtime session. If you cannot make network calls, ask the user for the exact website origin and template choice and give them the commands to run.
2. Add the installation script to the website or application surface.
3. Send speech and control events from the browser or your server.
4. Keep provider and agent credentials off the page.

Adam can support a product interface, support flow, educational experience, kiosk, event, game, interactive exhibit, branded conversation, or any application that needs a speaking visual presence.

Read [Embedding](./ai/EMBEDDING.md) and [Speech sources](./ai/SPEECH_SOURCES.md).

## If you already have an AI, application, or service

Keep your existing model, application, orchestration, or live control system. Send text and control events to Adam through:

- Browser runtime speech
- REST speech
- WebSocket speech
- MCP tools for agent-controlled workflows

The source can be an AI assistant, backend service, support workflow, product UI, game, kiosk, event operator, or another application. All transports use the same speech lifecycle and server-side orchestration. Read [Speech sources](./ai/SPEECH_SOURCES.md).

## If an AI agent is setting it up

The agent should:

1. Determine whether the user wants a website embed, application control, or agent-managed avatar.
2. If it has no Adam credentials, register a minimally scoped dynamic agent client and keep the returned secret in the trusted agent environment only.
3. Obtain a bearer token with `avatars:read`, `registrations:create`, and `registrations:read`.
4. List templates and choose one with the user.
5. Start an origin-bound preview registration with the user's website origin and a stable idempotency key.
6. Install the returned preview snippet and show the private one-time `claimUrl` only in trusted chat or terminal.
7. Ask the user to sign in once, then poll registration status and preserve the stable workspace, avatar, and installation IDs.
8. Explain bounded preview/mock behavior, trial expiry, inactive public state, and dashboard reactivation without re-embedding.

Read [AI quickstart](./ai/QUICKSTART.md), [Provisioning](./ai/PROVISIONING.md), and [Claim and activation](./ai/CLAIM_AND_ACTIVATION.md).

## If an agent needs direct tool discovery

Use the MCP server at `POST /api/mcp`. It speaks standard MCP JSON-RPC (`initialize`/`tools/list`/`tools/call`), supports anonymous sessions that lazily bootstrap credentials server-side, and exposes tools to discover templates, provision avatars, install and verify embeds, wait for the private claim, manage installation lifecycle, create sessions, and send speech.

Discovery: `GET /.well-known/adam-agent.json` (Adam manifest), `GET /.well-known/oauth-protected-resource` and `GET /.well-known/oauth-authorization-server` (standard OAuth metadata for MCP clients).

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

An AI agent is one controller type; browser code, backend services, applications, and live operators can use the same runtime model. `workspaceId`, `avatarId`, and `installationId` are stable resource identifiers. `sessionId` and runtime tokens are temporary.

## Security checklist

- Never put `ADAM_AGENT_CLIENT_SECRET` in browser code.
- Never put provider API keys in the embed.
- Validate the website origin during provisioning and session creation.
- Use idempotency keys for retries.
- Treat embed keys as revocable browser capabilities.
- Treat claim URLs as one-time private handoff credentials; never put them in browser code or public page content.
- Do not log raw credentials, claim tokens, or user tokens.

See [Authorization](./security/AUTHORIZATION.md), [Installation keys](./security/INSTALLATION_KEYS.md), and [BYOK isolation](./security/BYOK_ISOLATION.md).
