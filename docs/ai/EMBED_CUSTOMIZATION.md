# Customizing the Embed

How to control the rendered embed — sizing, presentation mode, and the `AdamAvatar` JavaScript surface. Everything here is optional; a bare snippet renders an avatar that fills its container.

## The `<adam-avatar>` element

The script mounts into the first `<adam-avatar>` element on the page (creating one at the end of `<body>` if none exists). Place it where you want the avatar to appear:

```html
<adam-avatar data-height="520"></adam-avatar>
<script
  src="https://adam-speaks.com/assets/avatar-widget/v1/ai-first-embed.js"
  data-installation-id="Xy9kPq2mN7wRtVb4cL6d"
  data-embed-key="ek_..."></script>
```

## Attributes

| Attribute | Where | Values | Effect |
|---|---|---|---|
| `data-installation-id` | `<script>` | installation id (required) | Binds the embed to the installation. |
| `data-embed-key` | `<script>` | `ek_...` (required) | Origin-bound capability key. |
| `data-height` | `<script>` or `<adam-avatar>` | `200`–`1200` (px) | Pins an explicit iframe height. Default: the avatar fills the `<adam-avatar>` element's height (never below 240px). The element attribute wins when both are set. In widget mode it sets the avatar frame height inside the panel. |
| `data-widget-mode` | `<script>` | `inline` \| `floating` | Overrides the avatar's configured chat presentation for this page. Only applies when the widget is enabled and chat is entitled; otherwise the bare avatar still renders. |
| `data-api-endpoint` | `<script>` | URL | Override the API origin (dev/proxy use). Defaults to the script's own origin + `/api`. |
| `data-status` | `<adam-avatar>` (read-only) | `loading`, `connecting`, `ready`, `mock`, `live`, `error`, `inactive`, `expired`, `origin_rejected` | Written by the script — style or observe it from the host page. |

The `<adam-avatar>` element itself is a normal block element — size it with your own CSS (`width`, `height`, `max-width`, `margin`) and the iframe fills it. Without any height it defaults to filling its parent container; give the parent (or the element) a height, or pin a fixed one with `data-height`.

## Script URL pinning

`https://adam-speaks.com/assets/avatar-widget/v1/ai-first-embed.js` is the versioned path for the current client — pin to it when a page must not track script updates silently. The unversioned `/assets/avatar-widget/ai-first-embed.js` always serves the latest compatible build.

## `window.AdamAvatar`

After the script mounts, `window.AdamAvatar` (also `window.adamAvatar`) exposes:

| Member | Notes |
|---|---|
| `connect()` | Idempotent — returns the live session while `ready`; reconnects after `error`/`inactive`/`expired`. |
| `speak(text, options?)` | Sends metered speech through the session (`POST /v1/runtime-sessions/:sid/speech`). |
| `interrupt()` | Stops current speech playback. |
| `status` | Current lifecycle status (same values as `data-status`). |
| `session` | The live session object (`sessionId`, `avatarId`, `expiresAt`, `speechMode`). Never copy `runtimeToken` out of it. |
| `chat.send(text)` | Sends a visitor chat message when the widget is enabled. |
| `chat.enabled` | Whether live chat is entitled for this session. |
| `chat.transcript` | Local copy of rendered messages. |
| `on(event, handler)` / `off` via returned unsubscribe | `ready`, `status`, `error`, `speech.interrupted`, `chat.message`. |

## DOM events

The `<adam-avatar>` element dispatches `adam:{event}` CustomEvents (`adam:ready`, `adam:status`, `adam:error`, `adam:chat.message`) with the payload in `event.detail`. The window also gets `adam-widget-ready` (with the widget instance) and `adam-widget-error`:

```js
window.addEventListener('adam-widget-ready', e => {
  e.detail.widget.on('status', s => console.log('avatar status:', s.status));
});
```

## Shadow DOM and styling

Widget chrome (the chat panel, transcript, composer) renders inside a **Shadow root** — host-page CSS cannot leak in by default, and the widget's styles cannot leak into your page. Themes are owner-configured (Admin → Chat Widget); the host page only controls the container. The bare avatar iframe is a plain child of `<adam-avatar>` — no shadow boundary — but its content runs on the Adam origin and is not styleable by design.

## Session behavior

`connect()` is idempotent while a session is healthy — clicks inside the chat UI, re-renders, and repeated `connect()` calls share the same session. A click on the avatar retries only in dead states. Sessions expire (default 1h) and renew themselves on reconnect; a `status` event tells you when.

## Security boundary

The embed key is origin-bound: `POST /v1/installations/:id/sessions` rejects any `Origin` outside the installation's allowlist. The runtime token it yields is delivered to the avatar iframe via `postMessage` — it is never in the iframe URL, page HTML, or logs. Speech and chat are rate-limited per session and per installation server-side.
