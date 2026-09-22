# Embedding

The AI-first embed uses an installation ID and installation key:

```html
<script src="https://adam-speaks.com/assets/avatar-widget/ai-first-embed.js"
  data-installation-id="install_..."
  data-embed-key="ek_..."></script>
```

The browser exchanges the key for a short-lived runtime session. The server determines whether the session is mock or live. Do not place provider API keys, Firebase credentials, owner IDs, or config IDs in the embed.
