#!/usr/bin/env bash
set -euo pipefail

: "${INSTALLATION_ID:?Set INSTALLATION_ID}"
: "${INSTALLATION_KEY:?Set INSTALLATION_KEY}"
: "${ORIGIN:?Set ORIGIN}"

curl -X POST "https://adam-speaks.com/api/v1/installations/${INSTALLATION_ID}/speech" \
  -H "X-Installation-Key: ${INSTALLATION_KEY}" \
  -H "Origin: ${ORIGIN}" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from my AI system.","idempotencyKey":"example-message-001"}'
