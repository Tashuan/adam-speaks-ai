# BYOK isolation

Every provider credential lookup must follow:

```text
installation/session → avatar → workspace → credential reference
```

A request presenting another workspace's session, avatar, installation, or voice must fail with `PROVIDER_CREDENTIAL_MISMATCH` before the provider is called. Tests must cover replayed, expired, revoked, cross-origin, and cross-workspace credentials.

## Credential sources

A workspace's ElevenLabs credential resolves from, in order:

1. A scoped credential document referenced by `workspace.byokCredentialRef` (partner-managed BYOK).
2. The owner-managed `ELEVENLABS_API_KEY` on the avatar's runtime configuration — the field owners set in the Adam dashboard under Admin → AI settings → TTS API keys.

Template configurations never carry a provider key across the ownership boundary; cloned avatar configurations always start without one, so every owner supplies their own key. If neither source yields a credential, speech stays in `mock` mode and live speech requests fail with `PROVIDER_CREDENTIAL_MISMATCH`.
