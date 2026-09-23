#!/usr/bin/env bash
# Adam MCP session walkthrough: anonymous initialize -> tools -> private claim.
# No credentials are needed up front; the server lazily bootstraps a scoped
# dynamic client on the first privileged call. Requires curl and jq.
set -euo pipefail

MCP="${ADAM_MCP_URL:-https://adam-speaks.com/api/mcp}"
HEADERS=$(mktemp)

# 1. initialize — returns an anonymous session id via the Mcp-Session-Id header.
curl -sS -D "$HEADERS" -X POST "$MCP" \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"example-agent","version":"1.0.0"}}}' | jq .
SESSION_ID=$(awk 'BEGIN{IGNORECASE=1} /^mcp-session-id:/ {gsub(/\r/,"",$2); print $2}' "$HEADERS")
rm -f "$HEADERS"
echo "session: $SESSION_ID"

mcp() { curl -sS -X POST "$MCP" -H 'Content-Type: application/json' -H "Mcp-Session-Id: $SESSION_ID" -d "$1" | jq .; }

# 2. tools/list — discover the catalog and input schemas.
mcp '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# 3. list_avatar_templates — public tool, no privileged scope needed.
mcp '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"list_avatar_templates","arguments":{}}}'

# 4. start_google_registration — first privileged call; lazily creates the
#    session's dynamic client server-side. The result NEVER contains claimUrl.
mcp '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"start_google_registration","arguments":{"displayName":"Site owner","projectName":"My site","templateId":"template_friendly_01","origin":"https://example.com","idempotencyKey":"example-site-001","consent":{"termsAccepted":true,"privacyAccepted":true}}}}'

# 5. get_claim_url — the ONLY tool that returns the private URL. Show it to the
#    user in this conversation; never write it to a webpage, file, log, or git.
mcp '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_claim_url","arguments":{"registrationId":"reg_REPLACE_ME"}}}'

# 6. wait_for_claim — bounded server-side wait; resumable on timeout.
mcp '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"wait_for_claim","arguments":{"registrationId":"reg_REPLACE_ME","timeoutSeconds":120}}}'

# 7. verify_installation — granular checks + nextAction for the live embed.
mcp '{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"verify_installation","arguments":{"installationId":"REPLACE_ME","origin":"https://example.com","embedKey":"ek_REPLACE_ME"}}}'

# 8. Revoke the session when done.
curl -sS -X DELETE "$MCP" -H "Mcp-Session-Id: $SESSION_ID" | jq .
