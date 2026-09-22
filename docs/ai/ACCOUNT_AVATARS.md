# Account avatar management

The authenticated Adam dashboard is the user-facing management surface for avatars created through agent registration.

## Canonical resource model

```text
workspace
  → avatar
  → installation
  → entitlement
```

A claimed avatar is owned through the verified Firebase user identity. The browser must never choose or submit an `ownerUid` to establish ownership.

Stable identifiers remain unchanged through claim and later edits:

- `workspaceId`
- `avatarId`
- `installationId`

## Account endpoints

These endpoints require a Firebase ID token from the signed-in Adam user:

```text
GET   /api/v1/account/avatars
GET   /api/v1/account/avatars/{avatarId}
PATCH /api/v1/account/avatars/{avatarId}
```

The API verifies the token, checks that the avatar belongs to the authenticated user, and returns the public avatar state:

- Ownership: `claimed` or `provisional`
- Speech mode: `mock` or `live`
- Template and runtime references
- Installation ID and allowed origins
- Display name and description
- Greeting and personality metadata
- Voice ID
- Entitlement state

The update endpoint accepts only avatar presentation/behavior fields and `allowedOrigins`. It does not allow changing ownership, workspace identity, avatar identity, installation identity, or entitlement state from the browser.

## Agent/user handoff

1. The agent starts hosted Google registration.
2. The user signs in once.
3. Adam binds the workspace/avatar/installation to the Firebase account.
4. The agent polls registration status and installs the returned embed.
5. The user can later sign in to the dashboard and edit the avatar without asking the agent to reinstall it.

## Security

- Keep agent client secrets in the trusted agent environment.
- Keep provider credentials server-side.
- Use the Firebase ID token only for authenticated account requests.
- Treat installation keys as browser capabilities, not account credentials.
- Do not log raw tokens, installation keys, or client secrets.
