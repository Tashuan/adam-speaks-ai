#!/usr/bin/env bash
set -euo pipefail

: "${ADAM_AGENT_TOKEN:?Set ADAM_AGENT_TOKEN}"

curl -X POST "https://adam-speaks.com/api/v1/provisioning/workspaces" \
  -H "Authorization: Bearer ${ADAM_AGENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "templateId":"template_friendly_01",
    "origin":"https://example.com",
    "projectName":"Example site",
    "idempotencyKey":"example-site-001"
  }'
