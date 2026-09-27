# Embedding

An agent-created Adam embed starts as an origin-bound preview and becomes a production installation after the user completes the private claim handoff.

The `installationId` and `ek_...` embed key values below come from the registration flow in [the quickstart](./QUICKSTART.md) and cannot be hand-written. Installation IDs are opaque strings with no fixed prefix. If you are producing this page for a user and do not have real values, run the provisioning flow first — a placeholder page cannot create a runtime session. If you cannot call the API yourself, ask the user for the exact website origin and template choice and give them the commands to run.

```html
<script
  src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="Xy9kPq2mN7wRtVb4cL6d"
  data-embed-key="ek_..."></script>
```

The preview installation can render the selected public avatar and bounded mock behavior before claim. The agent receives a separate one-time `claimUrl`; never put that URL in this snippet or in public page content.

The browser exchanges the scoped installation key for a short-lived runtime session. The server enforces the exact configured `Origin`, installation status, trial/subscription state, and runtime entitlement on every session and runtime authorization request.

When the owner’s trial ends without an active subscription, the widget transitions to its inactive state and does not present public billing controls. The owner reactivates from Adam without changing the snippet.

Installation keys are browser-visible, scoped capabilities. Do not place provider API keys, Firebase credentials, agent client secrets, owner IDs, claim tokens, or private configuration in the embed.

A copied claimed or unclaimed embed fails to create a runtime session on an unauthorized origin. Any intentionally public static template assets remain non-account content, and the private out-of-band claim URL is never available through the embed.

Avatar owners may use Character Studio to correct imported character UV layouts. These edits remain an owner-scoped avatar configuration overlay; they do not rewrite the original GLB/FBX source or require changes to the embed snippet.

## Chat widget

The same script snippet can render a chat widget — the avatar iframe plus a host-page chat chrome (an inline chat bar under the avatar, or a floating launcher bubble that expands into a panel). The widget is a feature of the embed, not a separate product: same `installationId`, same `ek_...` key, same origin enforcement.

The owner enables and configures it in the Adam Admin Console → Chat Widget page (display mode, theme, position, welcome message, and the chat scenario — provider, model, system prompt). To force a presentation mode for one page, add `data-widget-mode="floating"` or `data-widget-mode="inline"`; when omitted, the avatar's configured mode wins.

Chat requirements:

- The avatar must be **claimed** with an **active subscription**. Unclaimed/provisional preview installations render the avatar only — no chat UI.
- The owner must configure their own AI provider key (BYOK) in Admin → AI → Providers. No platform fallback is used; without a key the widget shows a polite "chat isn't configured" message.
- Visitor messages go through `POST /v1/runtime-sessions/{sessionId}/chat` authorized by the short-lived runtime token. Replies are generated server-side and spoken through the same session speech path.
- The chat scenario (system prompt, provider, model) never leaves the server; session responses carry only presentation fields.

Owners see the full transcript for widget sessions in Connect, and can take over a conversation or interject manually — something plain embeds cannot offer because integrators run their own LLM/TTS loop there.

For programmatic use, `window.AdamAvatar.chat.send(text)` sends a message, `AdamAvatar.chat.enabled` reports whether chat is live, and `adam:chat.message` DOM events fire per turn.
