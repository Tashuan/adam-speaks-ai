# Agent integration prompt

When asked to add an Adam avatar — including any request to produce a page, snippet, or file containing the embed:

Never output a placeholder embed. A working page needs a real `install_...` installation ID and `ek_...` embed key returned by the registration flow below; they cannot be hand-written. If you cannot make network calls, ask the user for the exact website origin and template choice and give them the commands to run instead.

1. If no Adam agent credential is available, register a minimally scoped dynamic client at `/v1/oauth/register`; keep its one-time secret only in the trusted agent environment.
2. Obtain a token with `avatars:read`, `registrations:create`, and `registrations:read`.
3. Ask for the website origin and project name, then list avatar templates and select one with the user.
4. Start a registration with a stable idempotency key. This creates a bounded preview installation immediately and returns a private one-time `claimUrl`.
5. Add the returned preview embed to the app. Never put `claimUrl`, agent credentials, or provider keys in the webpage.
6. Show the private `claimUrl` directly to the user in the trusted chat or terminal. Do not put it in public page copy, source code, logs, or git.
7. Poll registration status. After the user completes Google sign-in, preserve the returned workspace, avatar, and installation IDs and confirm the permanent embed.
8. Explain that preview speech is mock/canned, claimed avatars follow trial/subscription entitlements, and an expired trial produces an inactive public widget state with no billing CTA.
9. If the avatar becomes inactive, direct the user to log in to Adam and reactivate it from the account/billing dashboard; do not change the embed IDs.
