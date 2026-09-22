# Hosted Google registration flow

Adam registration is designed for an agent to onboard a user without collecting a password or asking the user to navigate through the Adam dashboard.

## Flow

```text
dynamic or configured agent client
  → obtain a scoped bearer token
  → POST /v1/registrations
  → receive hosted Google URL
  → user completes Google sign-in
  → hosted page obtains a Firebase ID token
  → POST /v1/registrations/{id}/complete
  → backend verifies the Firebase token
  → registration is linked to the Firebase UID
  → workspace, avatar, and installation are provisioned
  → embed snippet is attached to the completed registration
  → agent polls registration status
```

The user leaves the agent conversation momentarily for Google's consent screen, but does not need to create a password or manually configure an avatar. After completion, the avatar is available in the authenticated Adam dashboard for later updates.

## Registration start

The agent requires the `registrations:create` scope:

```http
POST /api/v1/registrations
Authorization: Bearer AGENT_TOKEN
Content-Type: application/json
```

```json
{
  "displayName": "Taylor",
  "projectName": "Taylor's site",
  "origin": "https://example.com",
  "templateId": "template_friendly_01",
  "idempotencyKey": "site-registration-001"
}
```

The response includes a short-lived `authorizationUrl` and `registrationId`.

## Hosted completion

The hosted Angular route is:

```text
/auth/agent/google?registrationId=reg_...
```

It reuses the application's existing Firebase `GoogleAuthProvider` flow. After Firebase completes Google authentication, the browser sends only the Firebase ID token to the completion endpoint. Provider access tokens are not stored by Adam or returned to the agent.

The backend requires:

- A valid Firebase ID token
- `google.com` as the Firebase sign-in provider
- `email_verified === true`
- A non-expired registration intent

## Registration states

```text
google_authorization_required
completed
expired
cancelled
```

The intent is single-use and expires after 15 minutes. Start requests are idempotent when the same idempotency key is reused.

## Security model

- Agents require explicit registration scopes.
- Registration state is stored server-side.
- The registration URL contains no credential.
- Firebase ID tokens are verified server-side.
- Raw Google tokens are never stored or logged.
- The agent receives only scoped registration and workspace identifiers.
- Rate limiting and idempotency apply to the agent endpoints.

Future providers can be added behind the same registration state machine without changing the CLI contract.
