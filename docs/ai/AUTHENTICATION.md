# Authentication

Adam uses three agent authentication stages:

- Dynamic client bootstrap for a new AI agent. `POST /v1/oauth/register` returns a one-time client secret with only `avatars:read`, `registrations:create`, and `registrations:read`.
- OAuth client credentials for the agent to discover templates and start an origin-bound preview with a private Google claim handoff for a user who has not created an Adam account yet.
- OAuth authorization-code with PKCE/delegated access when an agent acts for an existing Adam user.

Dynamic client secrets belong in the trusted agent environment only. They must not be written into the user's app, browser bundle, `.env` file, logs, or repository. The preview embed is separate from the one-time private `claimUrl`, which must be shown only in trusted agent/user chat or terminal output. Google ownership is what attaches the resulting avatar to the user's Adam account.

For delegated access, send the authenticated user to `GET /v1/oauth/authorize` with `client_id`, a registered `redirect_uri`, `scope`, `code_challenge`, and `code_challenge_method=S256`. Exchange the one-time code at `POST /v1/oauth/token` with the original `code_verifier`. Authorization codes expire after five minutes and are single-use.

Installation keys are browser-visible, scoped capabilities. They cannot list avatars, change account data, or authorize another workspace. Runtime tokens are short-lived and scoped to one installation/avatar/session.
