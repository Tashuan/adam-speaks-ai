# Installation keys

Installation keys are embedded in browser source, so they are not treated as account secrets. Store only an HMAC/hash, bind each key to an installation/avatar/workspace and exact allowed origins, rate-limit it, and support revocation. Exchange it for a short-lived runtime token before opening the avatar runtime.

Agent claim URLs are different: they are one-time private handoff credentials. Store only their hash, keep them out of public HTML and logs, deliver them through trusted agent/user chat or terminal output, expire them, and burn them after the user completes Google ownership.

A copied claimed or unclaimed embed must fail to create a runtime session when its `Origin` is not authorized. Any public static template assets remain non-account content; the embed must not expose account data, provider credentials, live TTS, or claim authority.
