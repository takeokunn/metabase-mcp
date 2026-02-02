import { createMetabaseClient } from '@src/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('createMetabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should throw error when METABASE_URL is missing', () => {
      delete process.env.METABASE_URL;
      delete process.env.METABASE_API_TOKEN;

      expect(() => createMetabaseClient()).toThrow('METABASE_URL is required');
    });

    it('should throw error when METABASE_API_TOKEN is missing', () => {
      process.env.METABASE_URL = 'https://metabase.example.com';
      delete process.env.METABASE_API_TOKEN;

      expect(() => createMetabaseClient()).toThrow('METABASE_API_TOKEN is required');
    });

    it('should throw error when URL is not HTTPS', () => {
      expect(() =>
        createMetabaseClient({
          url: 'http://metabase.example.com',
          apiToken: 'test-token',
        }),
      ).toThrow('METABASE_URL must use HTTPS (or http://localhost for development)');
    });

    it('should create client with environment variables', () => {
      process.env.METABASE_URL = 'https://metabase.example.com';
      process.env.METABASE_API_TOKEN = 'test-token';

      const client = createMetabaseClient();
      expect(client).toBeDefined();
      expect(client.get).toBeTypeOf('function');
      expect(client.post).toBeTypeOf('function');
      expect(client.put).toBeTypeOf('function');
      expect(client.delete).toBeTypeOf('function');
    });

    it('should create client with explicit config', () => {
      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });
      expect(client).toBeDefined();
    });

    it('should strip trailing slash from URL', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com/',
        apiToken: 'test-token',
      });

      await client.get('/api/test');

      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test',
        expect.any(Object),
      );
    });

    it('should allow http://localhost for development', () => {
      const client = createMetabaseClient({
        url: 'http://localhost:3000',
        apiToken: 'test-token',
      });
      expect(client).toBeDefined();
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request correctly', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const result = await client.get('/api/test');

      expect(result).toEqual({ result: 'success' });
      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-KEY': 'test-token',
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('should make GET request with query params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await client.get('/api/test', { page: 1, limit: 10, enabled: true });

      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test?page=1&limit=10&enabled=true',
        expect.any(Object),
      );
    });

    it('should skip undefined query params', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ result: 'success' }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await client.get('/api/test', { page: 1, limit: undefined });

      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test?page=1',
        expect.any(Object),
      );
    });

    it('should make POST request with body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const result = await client.post('/api/test', { name: 'test' });

      expect(result).toEqual({ id: 1 });
      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        }),
      );
    });

    it('should make PUT request with body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ updated: true }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const result = await client.put('/api/test/1', { name: 'updated' });

      expect(result).toEqual({ updated: true });
      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'updated' }),
        }),
      );
    });

    it('should make DELETE request', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ deleted: true }),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const result = await client.delete('/api/test/1');

      expect(result).toEqual({ deleted: true });
      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/test/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'invalid-token',
      });

      await expect(client.get('/api/test')).rejects.toThrow(
        'Metabase API error (401): Unauthorized',
      );
    });

    it.each([
      [403, 'Forbidden'],
      [404, 'Not Found'],
      [500, 'Internal Server Error'],
    ])('should handle %i status code', async (status, text) => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status,
        text: () => Promise.resolve(text),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await expect(client.get('/api/test')).rejects.toThrow(
        `Metabase API error (${status}): ${text}`,
      );
    });

    it('should truncate long error messages', async () => {
      const longError = 'A'.repeat(300);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(longError),
      });

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await expect(client.get('/api/test')).rejects.toThrow(
        `Metabase API error (500): ${'A'.repeat(200)}...`,
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const client = createMetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await expect(client.get('/api/test')).rejects.toThrow('Network error');
    });
  });
});
