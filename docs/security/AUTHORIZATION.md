# Authorization

Pre-signup provisioning requires OAuth client credentials for the agent. Existing-user agents use delegated OAuth scopes. Installation keys are narrow browser capabilities, not account credentials. Runtime tokens are short-lived and scoped to one session/avatar/installation.

Authorization must derive workspace ownership from verified token claims and server-side relationships, never from client-supplied owner IDs.
