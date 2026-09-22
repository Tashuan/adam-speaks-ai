# Platform overview

Adam is divided into:

- control plane: templates, workspaces, avatars, installations, claims, entitlements;
- runtime plane: signed iframe bootstrap and avatar rendering;
- speech plane: browser/REST/WebSocket/MCP requests through one SpeechOrchestrator;
- media plane: mock or provider-backed TTS, audio, lip-sync, and animation.

`avatarId` is stable. `sessionId` is temporary. `runtimeToken` authorizes one session. `embedKey` is a revocable browser capability.
