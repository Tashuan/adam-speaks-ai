# Preview registration and private claim flow

Adam gives an agent an immediate origin-bound preview while keeping ownership transfer private and user-controlled.

## Flow

```text
dynamic or configured agent client
  → obtain a scoped bearer token
  → POST /v1/registrations
  → receive preview embed + private one-time claimUrl
  → agent installs only the preview embed
  → agent shows claimUrl in trusted chat/terminal
  → user completes Google sign-in
  → hosted page sends Firebase ID token + claim token
  → backend verifies both and attaches the existing preview installation
  → agent polls registration status
```

The user leaves the agent conversation momentarily for the private Adam page, but does not need to manually configure an embed. The preview can render before claim. After completion, the avatar is available in the authenticated Adam dashboard.

## Registration start

The agent requires the `registrations:create` scope:

```http
POST /api/v1/registrations
Authorization: Bearer AGENT_TOKEN
Content-Type: application/json
```

The request includes the website origin, template, consent, and stable idempotency key. The response includes the normal preview embed and a private one-time `claimUrl`. Add only the embed to the app. Show `claimUrl` directly to the user; never put it in HTML, public page text, source code, logs, or git.

## Hosted completion

The hosted route is:

```text
/auth/agent/google?registrationId=reg_...#claim=claim_...
```

The browser uses Firebase Google sign-in and sends the Firebase ID token plus the private claim token to the completion endpoint. Adam verifies:

- The claim token hash and registration ID match
- The registration has not expired or already been consumed
- The Firebase token is valid
- `google.com` is the sign-in provider
- `email_verified === true`

The claim token is stored only as a hash and is invalidated after successful completion.

## Registration states

```text
google_authorization_required
completed
expired
```

Pending registrations last seven days. The Google interaction itself is short-lived, and the installation/runtime sessions have their own expirations.

## Preview and production security

- Preview assets and bounded mock behavior do not expose account data or provider credentials.
- The private claim URL is out-of-band and is never part of the browser embed.
- Claimed installations enforce exact allowed origins.
- Installation keys are scoped browser capabilities, not account credentials.
- Runtime tokens are short-lived and scoped to one installation, avatar, and session.
- Trial/subscription entitlement is checked when runtime access is created and authorized.
- Expired trials produce an inactive public widget state without a billing CTA.
- Stable workspace, avatar, and installation IDs do not change after claim.
- Rate limiting and idempotency apply to agent endpoints.
