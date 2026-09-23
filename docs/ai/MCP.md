# MCP

The Adam MCP server speaks the Model Context Protocol over Streamable HTTP (JSON responses) at `POST /api/mcp`. MCP tools call the same services as REST; they do not duplicate provisioning, authorization, entitlement, or speech business rules.

## Protocol

The endpoint accepts JSON-RPC 2.0 messages: `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`, and `DELETE` for session revocation. Batched requests are supported. Both the handshake lifecycle and stateless `tools/call` requests (Bearer, no `initialize`) are accepted.

For backward compatibility, a POST body of `{ "name": "<tool>", "arguments": {} }` without a `method` field still dispatches to the tool directly.

## Authentication and sessions

Three credential modes:

- **Bearer token** — `Authorization: Bearer <agent token>`; stateless, no `initialize` required.
- **Anonymous session** — `initialize` without credentials returns an opaque `Mcp-Session-Id` header backed by a server-side session record. Public tools (such as `list_avatar_templates`) work immediately. The first privileged call lazily registers a minimally scoped dynamic client server-side — the model never sees a `client_secret` or bearer token.
- **Bearer + initialize** — a session created with a bearer token is bound to that client identity and scopes.

Sessions expire after 24 hours, are bound to the `Origin` seen at `initialize`, and are revocable with `DELETE /api/mcp`. The endpoint validates `Origin` and `Host`; browser origins must be allowlisted.

## Tool catalog

```text
list_avatar_templates        (public)
start_google_registration    composite provision: workspace + avatar + installation + real embed; no claimUrl
get_claim_url                sole source of the private Google claim URL
get_registration_status      includes state=user_action_required / action=google_claim while pending
wait_for_claim               bounded server-side wait for Google claim completion
get_registration_embed       embed snippet + machine-readable install recipe
get_installation             owned installation state, origins, entitlements
get_runtime_status           embedEnabled / speechMode / inactiveReason
verify_installation          granular checks + nextAction
deactivate_installation      disable an owned installation (stable IDs preserved)
reactivate_installation      re-enable an agent-disabled installation
provision_avatar_for_project direct provisioning (configured clients only)
list_avatars                 list avatars in a workspace
get_avatar                   read an avatar
create_avatar_session        create a runtime session
get_embed_code               script snippet + install recipe
send_avatar_speech           send text to a session
interrupt_avatar_speech      interrupt current speech
get_session_status           session state
get_claim_status             ownership handoff state
resend_claim_email           resend the handoff email
```

`tools/list` returns each tool's `inputSchema`; `tools/call` results use `content` + `structuredContent`.

## Claim URL separation

`start_google_registration` never returns `claimUrl` at the MCP layer. Only `get_claim_url` returns it, and it must be shown to the user in the trusted conversation only — never in webpage source, files, logs, or git. No Adam tool accepts `claimUrl` as input.

## Discovery

- `GET /.well-known/adam-agent.json` — Adam manifest (endpoints, capabilities, auth modes)
- `GET /.well-known/oauth-protected-resource` — RFC 9728 resource metadata
- `GET /.well-known/oauth-authorization-server` — RFC 8414 server metadata

Use MCP for discovery and agent control. Use browser, REST, or WebSocket speech when the application itself needs runtime delivery.
