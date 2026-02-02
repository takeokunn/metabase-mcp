import type { MetabaseConfig } from './types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface MetabaseClient {
  get<T>(endpoint: string, params?: RequestOptions['params']): Promise<T>;
  post<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T>;
  put<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T>;
  delete<T>(endpoint: string, params?: RequestOptions['params']): Promise<T>;
}

export function createMetabaseClient(config?: Partial<MetabaseConfig>): MetabaseClient {
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

  const baseUrl = url.replace(/\/$/, '');

  function buildUrl(endpoint: string, params?: RequestOptions['params']): string {
    const fullUrl = new URL(`${baseUrl}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          fullUrl.searchParams.append(key, String(value));
        }
      }
    }
    return fullUrl.toString();
  }

  async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const requestUrl = buildUrl(endpoint, params);
      const response = await fetch(requestUrl, {
        method,
        headers: {
          'X-API-KEY': apiToken,
          'Content-Type': 'application/json',
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        const truncatedError =
          errorText.length > 200 ? `${errorText.substring(0, 200)}...` : errorText;
        throw new Error(`Metabase API error (${response.status}): ${truncatedError}`);
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    get<T>(endpoint: string, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'GET', params });
    },
    post<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'POST', body, params });
    },
    put<T>(endpoint: string, body?: unknown, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'PUT', body, params });
    },
    delete<T>(endpoint: string, params?: RequestOptions['params']): Promise<T> {
      return request<T>(endpoint, { method: 'DELETE', params });
    },
  };
}
