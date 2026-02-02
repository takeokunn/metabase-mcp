import type { MetabaseConfig, MetabaseDatabase, MetabaseDatabaseResponse } from './types.js';

export class MetabaseClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(config?: Partial<MetabaseConfig>) {
    const url = config?.url ?? process.env.METABASE_URL;
    const apiToken = config?.apiToken ?? process.env.METABASE_API_TOKEN;

    if (!url) {
      throw new Error('METABASE_URL is required');
    }
    if (!url.startsWith('https://') && !url.startsWith('http://localhost')) {
      throw new Error('METABASE_URL must use HTTPS (or http://localhost for development)');
    }
    if (!apiToken) {
      throw new Error('METABASE_API_TOKEN is required');
    }

    this.baseUrl = url.replace(/\/$/, '');
    this.apiToken = apiToken;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': this.apiToken,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Metabase API error (${response.status}): ${errorText}`);
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getDatabases(): Promise<MetabaseDatabase[]> {
    const response = await this.request<MetabaseDatabaseResponse>('/api/database');
    return response.data.map((db) => ({
      id: db.id,
      name: db.name,
      engine: db.engine,
    }));
  }
}
