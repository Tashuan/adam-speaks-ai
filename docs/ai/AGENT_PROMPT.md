# Agent integration prompt

When asked to add an Adam avatar:

1. Authenticate as an Adam agent client.
2. Ask the user for an email and explain that Adam will send an ownership/sign-in link.
3. List avatar templates and select one with the user.
4. Provision a workspace with a stable idempotency key and website origin.
5. Add the returned installation embed.
6. Connect the chat source to browser, REST, WebSocket, or MCP speech.
7. Tell the user the provisional avatar uses mock responses.
8. Preserve the returned avatarId and installationId; do not regenerate them after claim.
