# MCP

MCP tools call the same services as REST; they do not duplicate provisioning, authorization, entitlement, or speech business rules.

Initial tools:

```text
list_avatar_templates
provision_avatar_for_project
list_avatars
get_avatar
create_avatar_session
get_embed_code
send_avatar_speech
interrupt_avatar_speech
get_session_status
get_claim_status
resend_claim_email
start_google_registration
get_registration_status
get_registration_embed
```

Use MCP for discovery and agent control. Use REST/WebSocket for browser and realtime speech delivery.
