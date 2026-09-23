# Adam MCP server

The Adam MCP server lets an AI agent discover, provision, embed, and control real-time talking avatars through the same services used by the REST API.

## Endpoint

```text
POST https://adam-speaks.com/api/mcp
```

Authenticate requests with an Adam agent bearer token. Each tool requires the scope shown below. A new agent can first call `POST https://adam-speaks.com/api/v1/oauth/register` to receive a minimally scoped client credential, then obtain a bearer token from `/api/v1/oauth/token`. The MCP endpoint does not accept unauthenticated provisioning requests.

## Tool catalog

| Tool | Purpose | Scope |
| --- | --- | --- |
| `list_avatar_templates` | Discover available avatar templates | `avatars:read` |
| `provision_avatar_for_project` | Create a workspace, avatar, and installation | `workspaces:provision` |
| `list_avatars` | List avatars in a workspace | `avatars:read` |
| `get_avatar` | Read an avatar | `avatars:read` |
| `create_avatar_session` | Create a short-lived runtime session | `installations:create` |
| `get_embed_code` | Generate the website installation snippet | `installations:create` |
| `send_avatar_speech` | Send text to an active avatar session | `speech:send` |
| `interrupt_avatar_speech` | Interrupt current speech | `speech:interrupt` |
| `get_session_status` | Inspect runtime session state | `avatars:read` |
| `get_claim_status` | Read ownership handoff state | `avatars:read` |
| `resend_claim_email` | Resend the ownership handoff | `workspaces:provision` |
| `start_google_registration` | Start an origin-bound preview and private claim handoff | `registrations:create` |
| `get_registration_status` | Read registration state | `registrations:read` |
| `get_registration_embed` | Retrieve the preview or owned registration embed | `registrations:read` |

## Request shape

```json
{
  "name": "list_avatar_templates",
  "arguments": {}
}
```

Example:

```bash
curl -X POST https://adam-speaks.com/api/mcp \
  -H "Authorization: Bearer $ADAM_AGENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"list_avatar_templates","arguments":{}}'
```

Responses use a JSON content envelope and include a request ID for troubleshooting.

## Recommended agent flow

1. Bootstrap a dynamic client through the REST endpoint if the agent has no Adam credentials; keep the returned secret in the trusted agent environment only.
2. Obtain a bearer token with `avatars:read`, `registrations:create`, and `registrations:read`.
3. List templates and ask the user which avatar and use case they want.
4. Start an origin-bound preview registration with a stable idempotency key and install only the returned embed.
5. Show the one-time private `claimUrl` directly to the user in trusted chat/terminal; never put it in the webpage.
6. Poll registration status until completion, then preserve the stable IDs and retrieve the embed code.
7. Modify the user's app with the embed; send speech through the app/runtime path.
8. Explain bounded preview/mock mode, trial expiry, and dashboard reactivation.

Use MCP for discovery and agent control. Use browser, REST, or WebSocket speech when the application itself needs runtime delivery.

See [MCP implementation guidance](./ai/MCP.md), [authentication](./ai/AUTHENTICATION.md), [provisioning](./ai/PROVISIONING.md), and the [OpenAPI contract](./openapi/adam-v1.yaml).
