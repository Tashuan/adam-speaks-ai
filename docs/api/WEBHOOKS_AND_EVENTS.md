# Events

Speech events are scoped to a runtime session and use the same lifecycle across browser, REST, WebSocket, and MCP sources. The gateway emits `speech.accepted`, `speech.started`, `speech.audio_started`, `speech.completed`, `speech.interrupted`, and `speech.failed` with a stable `speechId`.
