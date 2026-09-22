# Provisioning

`POST /v1/provisioning/workspaces` creates a provisional workspace, stable avatar, installation key, and mock entitlement for approved partner agents with `workspaces:provision` scope.

For a new AI coding agent, use the safer hosted registration flow instead: dynamically register a minimal client, obtain `registrations:create` and `registrations:read`, start `POST /v1/registrations`, ask the user to complete Google sign-in, then retrieve the completed embed. Dynamic clients cannot call direct workspace provisioning.

The email is used for a later ownership handoff and is not proof of ownership. All provisioning and registration workflows are idempotent; always provide a stable idempotency key. Concurrent retries with the same key resolve to one resource result.

Provisioning and resend email are rate-limited independently by target email, agent client, origin, IP, and global mail budget. Dynamic client registration has a separate per-fingerprint limit and can be disabled with `ADAM_DYNAMIC_AGENT_REGISTRATION_ENABLED=false`.
