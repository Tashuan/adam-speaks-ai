# Agent integration prompt

When asked to add an Adam avatar:

1. If no Adam agent credential is available, register a minimally scoped dynamic client at `/v1/oauth/register`; keep its one-time secret in the trusted agent environment only.
2. Obtain a token with `avatars:read`, `registrations:create`, and `registrations:read`.
3. Ask the user for the website origin and project name, then list avatar templates and select one with the user.
4. Start hosted Google registration with a stable idempotency key and show the returned authorization URL.
5. After the user signs in, poll registration status and add the returned installation embed to the app.
6. Connect the chat source to browser, REST, WebSocket, or MCP speech.
7. Explain mock/live entitlement behavior and that the user can manage the claimed avatar later.
8. Preserve the returned avatarId and installationId; do not regenerate or re-embed them after claim.
