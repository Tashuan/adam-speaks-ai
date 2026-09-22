# Adam CLI

The Adam CLI provides a scriptable interface for avatar provisioning, hosted Google registration, embed generation, and operational checks.

## Local usage

From the repository root:

```bash
npm run adam -- help
npm run adam -- doctor
```

The CLI uses Node's built-in `fetch` and requires Node 20 or newer.

## Agent credentials

Set these in the environment of the trusted agent or automation process:

```bash
export ADAM_AGENT_CLIENT_ID="..."
export ADAM_AGENT_CLIENT_SECRET="..."
```

Credentials are never written into generated browser files or printed by the CLI.

## Common commands

```bash
npm run adam -- avatar templates
npm run adam -- registration start \
  --name "Taylor" \
  --origin https://example.com \
  --template template_friendly_01 \
  --project "Taylor's site" \
  --accept-terms \
  --accept-privacy
npm run adam -- registration wait reg_...
npm run adam -- registration embed reg_... --format json
npm run adam -- embed generate --installation install_... --key ek_...
```

Use `--format json` for agents and CI:

```bash
npm run adam -- registration status reg_... --format json
```

Use `--api-url` against the local emulator when needed:

```bash
npm run adam -- --api-url http://127.0.0.1:5001/polly-avatar/us-east1/api doctor
```

See [COMMAND_REFERENCE.md](./COMMAND_REFERENCE.md) and [REGISTRATION_FLOW.md](./REGISTRATION_FLOW.md) for the full contract.
