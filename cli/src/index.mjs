#!/usr/bin/env node
import { parseArgs, required } from './core/args.mjs';
import { AdamApiClient } from './core/api-client.mjs';

function output(value, options) {
  if (options.format === 'json') {
    console.log(JSON.stringify(value, null, 2));
    return;
  }
  if (typeof value === 'string') console.log(value);
  else console.log(JSON.stringify(value, null, 2));
}

function help() {
  console.log(`Adam CLI\n\nUsage:\n  adam <command> [options]\n\nCommands:\n  doctor                         Check API and local configuration\n  avatar templates               List available avatar templates\n  registration start             Start hosted Google registration\n  registration status <id>       Read registration status\n  registration wait <id>         Wait for registration completion\n  registration embed <id>        Get the completed registration embed\n  embed generate                 Generate an installation embed\n\nCommon options:\n  --api-url <url>                Override the API base URL\n  --format json                  Return machine-readable JSON\n\nAgent credentials:\n  ADAM_AGENT_CLIENT_ID\n  ADAM_AGENT_CLIENT_SECRET\n`);
}

function client(options) {
  return new AdamApiClient({ baseUrl: options['api-url'] });
}

async function run(argv) {
  const { positionals, options } = parseArgs(argv);
  const [command, subcommand, argument] = positionals;
  if (!command || command === 'help' || options.help) return help();

  if (command === 'doctor') {
    const api = client(options);
    const result = { apiUrl: api.baseUrl, node: process.version, credentialsConfigured: Boolean(api.clientId && api.clientSecret) };
    try {
      await api.request('/v1/avatar-templates');
      result.api = 'reachable';
    } catch (error) {
      result.api = 'unreachable';
      result.error = error.message;
    }
    return output(result, options);
  }

  if (command === 'avatar' && subcommand === 'templates') {
    const api = client(options);
    await api.ensureToken(['avatars:read']);
    return output(await api.request('/v1/avatar-templates'), options);
  }

  if (command === 'registration' && subcommand === 'start') {
    const api = client(options);
    await api.ensureToken(['registrations:create']);
    if (options['accept-terms'] !== true || options['accept-privacy'] !== true) {
      throw new Error('Registration requires --accept-terms and --accept-privacy.');
    }
    const payload = {
      displayName: required(options, 'name'),
      projectName: options.project,
      origin: required(options, 'origin'),
      templateId: required(options, 'template'),
      idempotencyKey: options['idempotency-key'] || `adam-cli-${Date.now()}`,
      consent: { termsAccepted: true, privacyAccepted: true }
    };
    return output(await api.request('/v1/registrations', { method: 'POST', body: JSON.stringify(payload) }), options);
  }

  if (command === 'registration' && subcommand === 'embed') {
    const registrationId = argument || required(options, 'registration');
    const api = client(options);
    await api.ensureToken(['registrations:read']);
    const result = await api.request(`/v1/registrations/${encodeURIComponent(registrationId)}`);
    if (!result.embed?.html) throw new Error('Registration is not complete or does not have an embed yet.');
    return output({ registrationId, ...result.embed }, options);
  }

  if (command === 'registration' && (subcommand === 'status' || subcommand === 'wait')) {
    const registrationId = argument || required(options, 'registration');
    const api = client(options);
    await api.ensureToken(['registrations:read']);
    let result = await api.request(`/v1/registrations/${encodeURIComponent(registrationId)}`);
    if (subcommand === 'wait' && options['no-wait'] !== true) {
      const timeoutAt = Date.now() + Number(options.timeout || 900) * 1000;
      while (!['completed', 'expired', 'cancelled'].includes(result.status) && Date.now() < timeoutAt) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        result = await api.request(`/v1/registrations/${encodeURIComponent(registrationId)}`);
      }
    }
    return output(result, options);
  }

  if (command === 'embed' && subcommand === 'generate') {
    const installationId = required(options, 'installation');
    const key = required(options, 'key');
    const script = options.script || '/assets/avatar-widget/ai-first-embed.js';
    const html = `<script src="${script}" data-installation-id="${installationId}" data-embed-key="${key}"></script>`;
    return output({ installationId, html }, options);
  }

  throw new Error(`Unknown command: ${positionals.join(' ')}`);
}

run(process.argv.slice(2)).catch(error => {
  console.error(`adam: ${error.message}`);
  process.exitCode = 1;
});
