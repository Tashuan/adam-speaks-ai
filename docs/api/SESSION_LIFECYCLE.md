# Session lifecycle

```text
installation key → session created → runtime connected → speech accepted
                                     ↓
                              reconnect/refresh
                                     ↓
                               expired/revoked
```

A session is temporary and scoped to one installation/avatar. Speech acceptance does not imply playback completion; use lifecycle events and `speechId` correlation.
