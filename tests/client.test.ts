import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MetabaseClient } from '../src/client.js';

describe('MetabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when METABASE_URL is missing', () => {
      delete process.env.METABASE_URL;
      delete process.env.METABASE_API_TOKEN;

      expect(() => new MetabaseClient()).toThrow('METABASE_URL is required');
    });

    it('should throw error when METABASE_API_TOKEN is missing', () => {
      process.env.METABASE_URL = 'https://metabase.example.com';
      delete process.env.METABASE_API_TOKEN;

      expect(() => new MetabaseClient()).toThrow('METABASE_API_TOKEN is required');
    });

    it('should create client with environment variables', () => {
      process.env.METABASE_URL = 'https://metabase.example.com';
      process.env.METABASE_API_TOKEN = 'test-token';

      const client = new MetabaseClient();
      expect(client).toBeInstanceOf(MetabaseClient);
    });

    it('should create client with explicit config', () => {
      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });
      expect(client).toBeInstanceOf(MetabaseClient);
    });

    it('should strip trailing slash from URL', () => {
      const client = new MetabaseClient({
        url: 'https://metabase.example.com/',
        apiToken: 'test-token',
      });
      expect(client).toBeInstanceOf(MetabaseClient);
    });

    it('should allow http://localhost for development', () => {
      const client = new MetabaseClient({
        url: 'http://localhost:3000',
        apiToken: 'test-token',
      });
      expect(client).toBeInstanceOf(MetabaseClient);
    });
  });

  describe('getDatabases', () => {
    it('should fetch databases successfully', async () => {
      const mockDatabases = {
        data: [
          { id: 1, name: 'Production DB', engine: 'postgres' },
          { id: 2, name: 'Analytics DB', engine: 'bigquery' },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDatabases),
      });

      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const databases = await client.getDatabases();

      expect(databases).toEqual([
        { id: 1, name: 'Production DB', engine: 'postgres' },
        { id: 2, name: 'Analytics DB', engine: 'bigquery' },
      ]);

      expect(fetch).toHaveBeenCalledWith(
        'https://metabase.example.com/api/database',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-KEY': 'test-token',
            'Content-Type': 'application/json',
          },
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should handle empty database list', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      const databases = await client.getDatabases();
      expect(databases).toEqual([]);
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      });

      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'invalid-token',
      });

      await expect(client.getDatabases()).rejects.toThrow('Metabase API error (401): Unauthorized');
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

      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await expect(client.getDatabases()).rejects.toThrow(
        `Metabase API error (${status}): ${text}`
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const client = new MetabaseClient({
        url: 'https://metabase.example.com',
        apiToken: 'test-token',
      });

      await expect(client.getDatabases()).rejects.toThrow('Network error');
    });
  });
});
