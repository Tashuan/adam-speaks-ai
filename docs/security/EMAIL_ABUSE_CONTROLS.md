# Email abuse controls

Provisioning and claim-email resend are separate rate-limited actions. Enforce hard daily caps per normalized target email and agent client, plus IP/origin cooldowns, per-claim resend limits, and a global provider budget.

Never log raw email links, claim IDs, resend tokens, installation keys, runtime tokens, or OAuth credentials.
