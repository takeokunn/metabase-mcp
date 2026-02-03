import type { MetabaseClient } from '@src/client';
import { listDatabasesDefinition } from '@src/tools/database/list-databases';
import { describe, expect, it, vi } from 'vitest';
import { expectMcpContent } from '../../__helpers__';

describe('listDatabases tool', () => {
  it('should return formatted MCP response with databases', async () => {
    const mockDatabases = [
      { id: 1, name: 'Production DB', engine: 'postgres' },
      { id: 2, name: 'Analytics DB', engine: 'bigquery' },
    ];

    // Note: list-databases uses getDatabases() which is not part of the standard
    // MetabaseClient interface (get/post/put/delete). Keeping custom mock for compatibility.
    const mockClient = {
      getDatabases: vi.fn().mockResolvedValue(mockDatabases),
    } as unknown as MetabaseClient;

    const result = await listDatabasesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockDatabases);
    expect(mockClient.getDatabases).toHaveBeenCalledOnce();
  });

  it('should handle empty database list', async () => {
    const mockClient = {
      getDatabases: vi.fn().mockResolvedValue([]),
    } as unknown as MetabaseClient;

    const result = await listDatabasesDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      getDatabases: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    await expect(listDatabasesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabasesDefinition.name).toBe('list_databases');
    expect(listDatabasesDefinition.description).toBe(
      'Get list of databases configured in Metabase',
    );
    expect(listDatabasesDefinition.inputSchema).toEqual({});
  });
});
