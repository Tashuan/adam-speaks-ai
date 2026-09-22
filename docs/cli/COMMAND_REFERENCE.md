# Adam CLI command reference

## `doctor`

Checks Node, API reachability, and whether agent credentials are configured.

```bash
adam doctor [--api-url URL] [--format json]
```

## `avatar templates`

Lists active avatar templates using the `avatars:read` agent scope.

```bash
adam avatar templates [--format json]
```

## `registration start`

Creates a short-lived registration intent and returns a hosted Google sign-in URL.

```bash
adam registration start \
  --name NAME \
  --origin ORIGIN \
  --template TEMPLATE_ID \
  --accept-terms \
  --accept-privacy \
  [--project PROJECT_NAME] \
  [--idempotency-key KEY]
```

## `registration embed`

Returns the absolute script URL and ready-to-paste HTML for a completed registration.

```bash
adam registration embed REGISTRATION_ID [--format json]
```

## `registration status`

Reads the state of a registration intent.

```bash
adam registration status REGISTRATION_ID [--format json]
```

## `registration wait`

Polls until the user completes Google sign-in or the registration expires.

```bash
adam registration wait REGISTRATION_ID [--timeout SECONDS]
```

## `embed generate`

Generates an HTML installation snippet. Installation keys are treated as browser-visible capabilities, not account credentials.

```bash
adam embed generate --installation INSTALLATION_ID --key EMBED_KEY
```

The CLI does not deploy, revoke, delete, or rotate production resources implicitly.
