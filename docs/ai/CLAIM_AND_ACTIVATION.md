# Claim and activation

## Private agent handoff

`POST /v1/registrations` creates an origin-bound preview installation and returns a one-time private `claimUrl`. The URL is delivered to the trusted agent, not stored in the public embed.

The agent should show the URL directly in the user’s trusted chat or terminal. It must never put the URL in page source, public copy, logs, browser code, or git.

The claim token is high entropy, stored only as a hash, expires with the pending registration, and is burned after successful completion.

While the claim is outstanding, registration responses carry `state: "user_action_required"`, `action: "google_claim"`. If the link must be shown again, `POST /v1/registrations/{id}/claim-url` (MCP: `get_claim_url`) mints a fresh one-time URL for the owned pending registration. Agents can block on `POST /v1/registrations/{id}/wait` (MCP: `wait_for_claim`) instead of polling; a timeout returns the same resumable pending state.

## Google ownership

The user opens the private URL and clicks Continue with Google. Adam verifies a Firebase ID token from a verified Google account. The verified Firebase UID—not an email supplied by the agent—determines ownership.

For a new account, the normal first-login flow creates the user profile and trial. For an existing account, the preview avatar is attached to that account. The existing workspace, avatar, and installation records are updated together, preserving their stable IDs.

## Preview and production states

Before claim, the embed can show the selected public avatar in bounded preview/mock mode. It has no access to account data, provider credentials, or live speech. A copied preview on an unauthorized origin cannot create a runtime session; any intentionally public static template assets remain non-account content. It cannot use the private claim URL or claim the installation.

After claim, the installation remains bound to its exact configured website origins. Copies on unauthorized origins are rejected when they request a runtime session.

## Live speech activation

Claimed avatars keep returning `mode: "mock"` speech until two conditions are met:

1. The owner has an active Adam subscription (or an eligible live-speech trial).
2. The owner adds their own ElevenLabs API key in the Adam dashboard: open the avatar's **Admin Console → AI settings → TTS API keys** and paste a key from `https://elevenlabs.io/app/settings/api-keys`.

The key is stored server-side on the avatar's runtime configuration and counts as the workspace's BYOK provider credential — it is never placed in the embed. Platform template avatars never carry a shared ElevenLabs key; every owner supplies their own.

Agents should tell externally provisioned users these exact steps after claim completes. Saving the key takes effect immediately — no re-embedding, reinstall, or ID changes are required.

## Trial expiry and reactivation

Avatar rendering, speech mode, and subscription state are evaluated separately. During an eligible trial, the avatar can render and speech may remain mock. When the trial ends without an active subscription, the public widget transitions to a quiet inactive state:

```text
Avatar inactive · Login to ADAM to reactivate
```

It does not show a billing button, activation popup, or redirect to public visitors. The owner reactivates from the authenticated Adam account/billing flow. Stripe lifecycle updates take effect without changing the embed or stable IDs.

Legacy provisional claim links remain supported for older provisioned records.
