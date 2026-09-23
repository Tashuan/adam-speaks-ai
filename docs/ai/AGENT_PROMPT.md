# Agent integration prompt

When asked to add an Adam avatar — including any request to produce a page, snippet, or file containing the embed:

Never output a placeholder embed. A working page needs a real `installationId` and `ek_...` embed key returned by the registration flow below; they cannot be hand-written. Installation, workspace, and avatar IDs are opaque strings with no fixed prefix. If you cannot make outbound POST calls (e.g. a sandboxed chat environment), do not fabricate values — instead tell the user to run this flow in an IDE agent with network and filesystem tools (Cursor, Devin, Codex, Antigravity, etc.) or give them the `examples/mcp-session.sh` commands to run themselves. Reading public docs with GET is fine; provisioning requires POST.

## MCP flow (preferred)

Connect to `https://adam-speaks.com/api/mcp` (see `/.well-known/adam-agent.json` for discovery). `initialize` returns an anonymous `Mcp-Session-Id`; no credentials are needed up front and the model never sees a client secret or bearer token.

1. `list_avatar_templates` — public; present options and let the user choose.
2. Ask for the website origin and project name.
3. `start_google_registration` — composite provisioning; returns the real embed and stable IDs with `state: "user_action_required"`. It never returns `claimUrl`.
4. Install the returned embed using your own filesystem/GitHub tools, or hand the snippet to the user. The embed's `integration` block (`type: "script"`, `placement: "body"`) tells you where it goes.
5. `get_claim_url` — the only tool that returns the private one-time claim URL. Show it to the user in this conversation only; never put it in page source, files, logs, or git.
6. `wait_for_claim` — waits server-side; a timeout returns a resumable `user_action_required` state, so call it again until `status` is `completed`.
7. `verify_installation` — pass `installationId`, `origin`, and `embedKey` to check the live page, key validity, and a runtime session smoke test; act on `nextAction`.
8. Explain that preview speech is mock/canned, claimed avatars follow trial/subscription entitlements, and an expired trial produces an inactive public widget state with no billing CTA.
9. If the avatar becomes inactive, direct the user to log in to Adam and reactivate it from the account/billing dashboard; do not change the embed IDs. `deactivate_installation`/`reactivate_installation` manage agent-disabled state only.

## REST flow (self-managed credentials)

1. If no Adam agent credential is available, register a minimally scoped dynamic client at `/v1/oauth/register`; keep its one-time secret only in the trusted agent environment.
2. Obtain a token with `avatars:read`, `registrations:create`, `registrations:read`, and `installations:read`.
3. Ask for the website origin and project name, then list avatar templates and select one with the user.
4. Start a registration with a stable idempotency key. This creates a bounded preview installation immediately and returns a private one-time `claimUrl`.
5. Add the returned preview embed to the app. Never put `claimUrl`, agent credentials, or provider keys in the webpage.
6. Show the private `claimUrl` directly to the user in the trusted chat or terminal. `POST /v1/registrations/{id}/claim-url` reissues it if needed.
7. `POST /v1/registrations/{id}/wait` or poll status. After Google sign-in, preserve the returned workspace, avatar, and installation IDs and confirm the permanent embed.
8. `POST /v1/installations/{id}/verify` confirms the live embed.
9. Explain bounded preview/mock behavior, trial expiry, inactive public state, and dashboard reactivation without re-embedding.
