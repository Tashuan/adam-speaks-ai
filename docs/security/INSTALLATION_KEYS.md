# Installation keys

Installation keys are embedded in browser source, so they are not treated as secrets. Store only an HMAC/hash, bind each key to an installation/avatar/workspace and allowed origins, rate-limit it, and support revocation. Exchange it for a short-lived runtime token before opening the avatar runtime.
