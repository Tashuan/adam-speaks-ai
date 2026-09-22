# Adam MCP server

The Adam MCP server lets an AI agent discover, provision, embed, and control real-time talking avatars through the same services used by the REST API.

## Endpoint

```text
POST https://adam-speaks.com/api/mcp
```

Authenticate requests with an Adam agent bearer token. Each tool requires the scope shown below.

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
| `start_google_registration` | Start hosted user registration | `registrations:create` |
| `get_registration_status` | Read registration state | `registrations:read` |
| `get_registration_embed` | Retrieve the completed registration embed | `registrations:read` |

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

1. List templates.
2. Ask the user which avatar and use case they want.
3. Provision with a stable idempotency key.
4. Return the embed code or create a session.
5. Send speech and monitor session state.
6. Explain mock mode and claim/activation when applicable.

Use MCP for discovery and agent control. Use browser, REST, or WebSocket speech when the application itself needs runtime delivery.

See [MCP implementation guidance](./ai/MCP.md), [authentication](./ai/AUTHENTICATION.md), [provisioning](./ai/PROVISIONING.md), and the [OpenAPI contract](./openapi/adam-v1.yaml).
