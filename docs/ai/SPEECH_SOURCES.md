# Speech Sources

Browser, REST, WebSocket, and MCP speech requests use the same server-side SpeechOrchestrator and lifecycle. The controller can be an AI system, application, backend service, live operator, or agent.

## Browser

```js
await window.AdamAvatar.speak('Hello from my chat source.');
```

## REST

```http
POST /v1/installations/{installationId}/speech
X-Installation-Key: ek_...
Origin: https://example.com
Content-Type: application/json

{"text":"Hello from my server.","idempotencyKey":"msg-001"}
```

## Lifecycle

```text
accepted → queued → started → audio_started → completed
                         ↘ interrupted
                         ↘ failed
```

Provisional workspaces return `mode: mock` and never call a billable provider. Claimed workspaces also stay in `mock` until the owner has an active subscription and has added their own ElevenLabs API key in the Adam dashboard (Admin → AI settings → TTS API keys); see [claim and activation](./CLAIM_AND_ACTIVATION.md).

## Scene commands

A live embed session also accepts **scene commands** — remote control of the avatar's camera, background, lighting, look-at, motion parallax, animations, and expressions. Commands are cosmetic: they never synthesize speech, never spend credits, and are delivered only while the avatar iframe is actually connected.

```http
POST /v1/runtime-sessions/{sessionId}/command
Authorization: Bearer <runtimeToken>
Content-Type: application/json

{
  "command": "speak",
  "payload": {
    "cameraPos": { "x": 0, "y": 1.5, "z": 2.2, "duration": 1.5 },
    "backgroundUrl": "https://example.com/backdrop.jpg",
    "lights": { "keyLight": { "color": "#ffd9b0", "intensity": 1.2 } },
    "lookAt": { "enabled": true, "headWeight": 0.8 }
  }
}
```

`200` → `{ "sessionId", "commandId", "command", "status": "queued" }`. `409 SESSION_STALE` (retryable) when the embed iframe isn't connected. The MCP equivalent is `send_avatar_command` (`avatars:command` scope).

### Command types

| `command` | `payload` |
|---|---|
| `speak` | Scene fields below. Text/voice fields are **rejected by whitelist** — speech stays on `POST .../speech` (or `send_avatar_speech`). |
| `playAnimation` | `{ "clipId" \| "name" \| "animation", "loop"? }` — clipId resolves through animation assignments, name through clip display name. |
| `setExpression` | `{ "name" }` — an expression preset name. |
| `interrupt` | `{}` — stops current playback in the embed. |

### `speak` scene fields

All fields are optional; send any subset. Unknown fields are dropped server-side.

| Field | Type | Notes |
|---|---|---|
| `cameraPos` | `{x,y,z,duration?}` object, `[x,y,z]` array, or `"x,y,z"` string | Partial axes allowed. `duration` (seconds, 0–60) eases the move. **Ignored while face mode is active** — it applies to normal-mode framing only. |
| `duration` | number | Fallback tween duration when `cameraPos` has none. |
| `backgroundUrl` | http(s) URL string, `""` clears | Image or video backdrop. |
| `backgroundAudioUrl` | http(s) URL string, `""` clears | Looping ambience track. |
| `backgroundAudioVolume` | number 0–1 | |
| `lights` | object | Per-light keys: `keyLight`, `fillLight`, `rimLight`, `ambientLight`, `environment`. Each accepts `color` (string), `intensity` (0–100), `position` `{x,y,z}`; `keyLight` also accepts `castShadow` (bool), `shadowMapSize` (64–8192), `bias`, `normalBias` (−1–1). |
| `lookAt` | object | `enabled`, `idleEnabled`, `flipForward` (bool); `stiffness`, `headWeight`, `eyesWeight`, `neckWeight`, `spineWeight`, `waistWeight`, `hipWeight` (0–5); `neutralPitch`, `neutralYaw` (−180–180). |
| `motionParallaxEnabled` | boolean | |
| `motionParallaxMode` | `"auto"` \| `"mouse"` | |

### Security notes

- The runtime token and session id are the same credentials the embed uses for `/speech`; commands are additionally gated on the avatar iframe's live connection, so a stolen token cannot queue commands onto a closed session.
- Payloads pass a strict whitelist — anything outside the contract is dropped before delivery.
- Rate limits: 120 commands/minute per session, 300/minute per caller.
