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

Provisional workspaces return `mode: mock` and never call a billable provider.
