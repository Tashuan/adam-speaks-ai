# Sharing & embedding guide

Getting the avatar in front of people:

- **Share link** — standalone public URL copied from the nav rail or Overview. Bare form is `/avatar/{slug}/{avatarId}`; when the owner enables **Public share chat** (Chat Widget page) it becomes `/share/{slug}/{avatarId}` and renders the inline chat widget — no embed needed. Share sessions use a dedicated, share-page-origin-bound key minted per avatar (`GET /v1/share/{configId}/widget`); disabling or deleting the avatar revokes it.
- **Preview** — minimal preview page, the same view used inside iframe embeds.
- **Embed modal** — scoped script embed (installation ID + one-time embed key) or direct iframe, both gated by trusted origins.
- **Chat Widget** — script embed with the chat layer enabled, plus a showcase listing key.
- **Trusted Origins** — the allow-list of domains permitted to load the embed.
- **Leaderboard** — public rankings by sessions, watch time, chats, and speech; opt out via Overview → Public visibility.

Live guide: https://adam-speaks.com/guides/sharing
