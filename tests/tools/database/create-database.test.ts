import type { MetabaseClient } from '@src/client';
import { createDatabaseDefinition } from '@src/tools/database/create-database';
import { describe, expect, it, vi } from 'vitest';

describe('createDatabase tool', () => {
  it('should create a database and return formatted MCP response', async () => {
    const mockResponse = {
      id: 1,
      name: 'New Database',
      engine: 'postgres',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      name: 'New Database',
      engine: 'postgres' as const,
      details: { host: 'localhost', port: 5432 },
    };

    const result = await createDatabaseDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database', {
      name: 'New Database',
      engine: 'postgres',
      details: { host: 'localhost', port: 5432 },
    });
  });

  it('should use empty object for details when not provided', async () => {
    const mockResponse = { id: 1, name: 'Test DB', engine: 'h2' };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      name: 'Test DB',
      engine: 'h2' as const,
    };

    await createDatabaseDefinition.handler(mockClient, input);

    expect(mockClient.post).toHaveBeenCalledWith('/api/database', {
      name: 'Test DB',
      engine: 'h2',
      details: {},
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    const input = {
      name: 'Test DB',
      engine: 'postgres' as const,
    };

    await expect(createDatabaseDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should have correct tool definition metadata', () => {
    expect(createDatabaseDefinition.name).toBe('create_database');
    expect(createDatabaseDefinition.description).toBe('Add a new database connection to Metabase');
    expect(createDatabaseDefinition.inputSchema).toBeDefined();
  });
});
