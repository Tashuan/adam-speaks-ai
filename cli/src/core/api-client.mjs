export class AdamApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'AdamApiError';
    this.status = status;
    this.payload = payload;
  }
}

export class AdamApiClient {
  constructor({ baseUrl, clientId, clientSecret, token } = {}) {
    this.baseUrl = String(baseUrl || process.env.ADAM_API_URL || 'https://adam-speaks.com/api').replace(/\/$/, '');
    this.clientId = clientId || process.env.ADAM_AGENT_CLIENT_ID;
    this.clientSecret = clientSecret || process.env.ADAM_AGENT_CLIENT_SECRET;
    this.token = token || process.env.ADAM_AGENT_TOKEN || null;
    this.dynamicIdempotencyKey = process.env.ADAM_AGENT_IDEMPOTENCY_KEY || `adam-cli-${process.pid}-${Date.now()}`;
  }

  async registerDynamicClient(clientName = process.env.ADAM_AGENT_CLIENT_NAME || 'Adam CLI agent') {
    const payload = await this.request('/v1/oauth/register', {
      method: 'POST',
      body: JSON.stringify({ client_name: clientName, idempotency_key: this.dynamicIdempotencyKey }),
      headers: { Authorization: undefined }
    });
    this.clientId = payload.client_id;
    this.clientSecret = payload.client_secret;
    return payload;
  }

  async request(path, options = {}) {
    const headers = Object.fromEntries(Object.entries({ Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }).filter(([, value]) => value !== undefined));
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new AdamApiError(payload?.error?.message || `Adam API request failed (${response.status}).`, response.status, payload);
    return payload;
  }

  async authenticate(scopes = ['avatars:read', 'registrations:create', 'registrations:read']) {
    if (!this.clientId || !this.clientSecret) await this.registerDynamicClient();
    const payload = await this.request('/v1/oauth/token', {
      method: 'POST',
      body: JSON.stringify({ grant_type: 'client_credentials', client_id: this.clientId, client_secret: this.clientSecret, scope: scopes.join(' ') }),
      headers: { Authorization: undefined }
    });
    this.token = payload.access_token;
    return payload;
  }

  async ensureToken(scopes) {
    if (!this.token) await this.authenticate(scopes);
    return this.token;
  }
}
