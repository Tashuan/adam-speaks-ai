# Adam CLI

The Adam CLI is a Node 20+ command-line client for avatar discovery, origin-bound preview registration, private claim handoff, status polling, and embed generation.

## Install from this repository

```bash
cd cli
npm install
npm link
adam help
```

Or run it without linking:

```bash
node cli/src/index.mjs help
```

## Credentials

Set credentials only in the trusted agent or automation environment:

```bash
export ADAM_AGENT_CLIENT_ID="..."
export ADAM_AGENT_CLIENT_SECRET="..."
```

The CLI uses Node's built-in `fetch`, does not print secrets, and does not write credentials into browser files.

## Commands

```bash
adam doctor
adam avatar templates --format json
adam registration start \
  --name "Taylor" \
  --origin https://example.com \
  --template template_friendly_01 \
  --project "Taylor's site" \
  --accept-terms \
  --accept-privacy
adam registration status reg_... --format json
adam registration wait reg_...
adam registration embed reg_... --format json
adam embed generate --installation install_... --key ek_...
```

Use `--api-url` for an alternate API endpoint and `--format json` for agents and CI.

The CLI does not deploy, revoke, delete, or rotate production resources implicitly.

## Agent-first bootstrap

If `ADAM_AGENT_TOKEN` is unavailable and static `ADAM_AGENT_CLIENT_ID` / `ADAM_AGENT_CLIENT_SECRET` credentials are not configured, the CLI can register a minimally scoped dynamic agent client in memory for the current process:

```bash
adam agent register --name "My app's AI agent" --format json
```

The returned client secret is trusted-agent credential material. Do not write it into the application, browser bundle, `.env` file, or git repository. Set `ADAM_AGENT_IDEMPOTENCY_KEY` when a host needs retries to resolve to the same dynamic client.

See the [full command reference](./cli/COMMAND_REFERENCE.md) and [registration flow](./cli/REGISTRATION_FLOW.md).
