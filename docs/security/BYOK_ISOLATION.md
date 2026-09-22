# BYOK isolation

Every provider credential lookup must follow:

```text
installation/session → avatar → workspace → credential reference
```

A request presenting another workspace's session, avatar, installation, or voice must fail with `PROVIDER_CREDENTIAL_MISMATCH` before the provider is called. Tests must cover replayed, expired, revoked, cross-origin, and cross-workspace credentials.
