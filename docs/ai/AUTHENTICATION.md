# Authentication

Adam uses two agent authentication patterns:

- OAuth client credentials for an agent provisioning a user who has not created an Adam account yet.
- OAuth authorization-code with PKCE/delegated access when an agent acts for an existing Adam user.

For delegated access, send the authenticated user to `GET /v1/oauth/authorize` with `client_id`, a registered `redirect_uri`, `scope`, `code_challenge`, and `code_challenge_method=S256`. Exchange the one-time code at `POST /v1/oauth/token` with the original `code_verifier`. Authorization codes expire after five minutes and are single-use.

Installation keys are browser-visible, scoped capabilities. They cannot list avatars, change account data, or authorize another workspace. Runtime tokens are short-lived and scoped to one installation/avatar/session.
