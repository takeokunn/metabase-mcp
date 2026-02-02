import type { MetabaseClient } from '@src/client';
import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { getDatabaseDefinition } from '@src/tools/database/get-database';
import { describe, expect, it, vi } from 'vitest';

describe('getDatabase tool', () => {
  it('should return formatted MCP response with database data', async () => {
    const mockDatabase = {
      id: 1,
      name: 'Production DB',
      engine: 'postgres',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T12:00:00Z',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockDatabase),
    } as unknown as MetabaseClient;

    const result = await getDatabaseDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockDatabase);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle database with minimal data', async () => {
    const mockDatabase = {
      id: 42,
      name: 'Analytics DB',
      engine: 'bigquery',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockDatabase),
    } as unknown as MetabaseClient;

    const result = await getDatabaseDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockDatabase);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    await expect(getDatabaseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getDatabaseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseDefinition.name).toBe('get_database');
    expect(getDatabaseDefinition.description).toBe('Get a single database by ID from Metabase');
    expect(getDatabaseDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
