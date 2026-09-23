# Provisioning

`POST /v1/provisioning/workspaces` creates a provisional workspace, stable avatar, installation key, and mock entitlement for approved partner agents with `workspaces:provision` scope.

For a new AI coding agent, use the safer hosted registration flow instead: dynamically register a minimal client, obtain `registrations:create` and `registrations:read`, and start `POST /v1/registrations` with the exact website origin and a stable idempotency key. This creates an origin-bound preview installation immediately and returns a private one-time `claimUrl` for the trusted agent to show the user. Dynamic clients cannot call direct workspace provisioning.

The private claim token—not an email supplied by the agent—is the handoff capability. Google/Firebase authentication establishes the verified owner UID. Claim URLs are never part of the browser embed, public page copy, logs, or git.

All provisioning and registration workflows are idempotent; always provide a stable idempotency key. Concurrent retries with the same key resolve to one resource result. Pending preview registrations expire after seven days. Claimed installations preserve stable workspace, avatar, and installation IDs.

Preview assets and mock behavior are bounded. Claimed installations enforce exact website origins and trial/subscription entitlements. An expired trial produces an inactive public widget state without a billing CTA; the owner reactivates from the authenticated Adam account.
