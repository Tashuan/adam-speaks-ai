# Claim and activation

## Private agent handoff

`POST /v1/registrations` creates an origin-bound preview installation and returns a one-time private `claimUrl`. The URL is delivered to the trusted agent, not stored in the public embed.

The agent should show the URL directly in the user’s trusted chat or terminal. It must never put the URL in page source, public copy, logs, browser code, or git.

The claim token is high entropy, stored only as a hash, expires with the pending registration, and is burned after successful completion.

## Google ownership

The user opens the private URL and clicks Continue with Google. Adam verifies a Firebase ID token from a verified Google account. The verified Firebase UID—not an email supplied by the agent—determines ownership.

For a new account, the normal first-login flow creates the user profile and trial. For an existing account, the preview avatar is attached to that account. The existing workspace, avatar, and installation records are updated together, preserving their stable IDs.

## Preview and production states

Before claim, the embed can show the selected public avatar in bounded preview/mock mode. It has no access to account data, provider credentials, or live speech. A copied preview on an unauthorized origin cannot create a runtime session; any intentionally public static template assets remain non-account content. It cannot use the private claim URL or claim the installation.

After claim, the installation remains bound to its exact configured website origins. Copies on unauthorized origins are rejected when they request a runtime session.

## Trial expiry and reactivation

Avatar rendering, speech mode, and subscription state are evaluated separately. During an eligible trial, the avatar can render and speech may remain mock. When the trial ends without an active subscription, the public widget transitions to a quiet inactive state:

```text
Avatar inactive · Login to ADAM to reactivate
```

It does not show a billing button, activation popup, or redirect to public visitors. The owner reactivates from the authenticated Adam account/billing flow. Stripe lifecycle updates take effect without changing the embed or stable IDs.

Legacy provisional claim links remain supported for older provisioned records.
