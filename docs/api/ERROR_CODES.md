# Error codes

Public agent/API errors use a stable `error.code`, human message, retryability flag, request ID, and details object.

Core codes include:

```text
AUTH_REQUIRED AUTH_INVALID AUTH_SCOPE_DENIED EMAIL_INVALID
TEMPLATE_NOT_FOUND TEMPLATE_RETIRED WORKSPACE_NOT_FOUND
INSTALLATION_NOT_FOUND INSTALLATION_REVOKED INSTALLATION_EXPIRED
ORIGIN_NOT_ALLOWED RUNTIME_SESSION_EXPIRED ENTITLEMENT_DENIED
MOCK_QUOTA_EXCEEDED RATE_LIMITED EMAIL_RATE_LIMITED
IDEMPOTENCY_REQUIRED IDEMPOTENCY_CONFLICT SPEECH_INVALID
PROVIDER_UNAVAILABLE PROVIDER_CREDENTIAL_MISMATCH
CLAIM_NOT_FOUND CLAIM_EXPIRED CLAIM_ALREADY_COMPLETED
CLAIM_NOT_ALLOWED INVALID_REQUEST PLAN_UPGRADE_REQUIRED INTERNAL_ERROR
```

Plan enforcement:

- `PLAN_UPGRADE_REQUIRED` (HTTP 402) — the owner's subscription tier doesn't include the feature (e.g., avatar/origin limits, depth or video backgrounds, webhook registration, hosted share pages). `details` carries `{ feature, currentTier, requiredTier }`.
- `ENTITLEMENT_DENIED` (HTTP 403) can also carry `details.reason` values `plan_quota_exceeded` (monthly embed session cap reached) or `plan_upgrade_required` (a `share`/`showcase` installation key is used after the plan drops below the tier that minted it).
