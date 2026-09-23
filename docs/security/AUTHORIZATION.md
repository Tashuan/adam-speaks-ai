# Authorization

Agent registration uses minimally scoped OAuth client credentials. A registration creates an origin-bound preview and returns a one-time private claim URL through the trusted agent channel. The claim URL is not an embed credential and must never be placed in browser code or public page content.

Google/Firebase authentication establishes the verified owner UID. Authorization must derive workspace ownership from verified token claims and server-side relationships, never from a client-supplied email or owner ID.

Installation keys are narrow browser capabilities, not account credentials. Runtime tokens are short-lived and scoped to one session/avatar/installation. Claimed installations enforce exact allowed origins and current trial/subscription entitlements.
