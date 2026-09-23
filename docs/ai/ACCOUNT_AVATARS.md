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
- Access state: active or inactive
- Inactive reason when a trial/subscription has ended

The update endpoint accepts only avatar presentation/behavior fields and `allowedOrigins`. It does not allow changing ownership, workspace identity, avatar identity, installation identity, or entitlement state from the browser.

## Agent/user handoff

1. The agent starts an origin-bound preview registration.
2. The agent embeds the preview and shows the one-time private `claimUrl` only in trusted chat or terminal.
3. The user signs in once through that private URL.
4. Adam binds the workspace/avatar/installation to the verified Firebase account.
5. The agent polls registration status and preserves the stable embed IDs.
6. The user can later manage or reactivate the avatar from the dashboard without asking the agent to reinstall it.

## Security

- Keep agent client secrets in the trusted agent environment.
- Keep provider credentials server-side.
- Use the Firebase ID token only for authenticated account requests.
- Treat installation keys as browser capabilities, not account credentials.
- Do not log raw tokens, installation keys, or client secrets.
