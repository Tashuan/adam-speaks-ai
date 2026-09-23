# Embedding

An agent-created Adam embed starts as an origin-bound preview and becomes a production installation after the user completes the private claim handoff.

The `install_...` and `ek_...` values below come from the registration flow in [the quickstart](./QUICKSTART.md) and cannot be hand-written. If you are producing this page for a user and do not have real values, run the provisioning flow first — a placeholder page cannot create a runtime session. If you cannot call the API yourself, ask the user for the exact website origin and template choice and give them the commands to run.

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_..."></script>
```

The preview installation can render the selected public avatar and bounded mock behavior before claim. The agent receives a separate one-time `claimUrl`; never put that URL in this snippet or in public page content.

The browser exchanges the scoped installation key for a short-lived runtime session. The server enforces the exact configured `Origin`, installation status, trial/subscription state, and runtime entitlement on every session and runtime authorization request.

When the owner’s trial ends without an active subscription, the widget transitions to its inactive state and does not present public billing controls. The owner reactivates from Adam without changing the snippet.

Installation keys are browser-visible, scoped capabilities. Do not place provider API keys, Firebase credentials, agent client secrets, owner IDs, claim tokens, or private configuration in the embed.

A copied claimed or unclaimed embed fails to create a runtime session on an unauthorized origin. Any intentionally public static template assets remain non-account content, and the private out-of-band claim URL is never available through the embed.
