import type { MetabaseClient } from '@src/client';
import { ListDatabaseTablesParamsSchema } from '@src/schemas/database';
import { listDatabaseTablesDefinition } from '@src/tools/database/list-database-tables';
import { describe, expect, it, vi } from 'vitest';

describe('listDatabaseTables tool', () => {
  it('should return formatted MCP response with tables without schema filter', async () => {
    const mockTables = [
      { id: 1, name: 'users', schema: 'public' },
      { id: 2, name: 'orders', schema: 'public' },
      { id: 3, name: 'products', schema: 'inventory' },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTables),
    } as unknown as MetabaseClient;

    const result = await listDatabaseTablesDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/tables');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return tables filtered by schema', async () => {
    const mockTables = [
      { id: 1, name: 'users', schema: 'public' },
      { id: 2, name: 'orders', schema: 'public' },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTables),
    } as unknown as MetabaseClient;

    const result = await listDatabaseTablesDefinition.handler(mockClient, {
      id: 1,
      schema: 'public',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema/public');
  });

  it('should encode schema name with special characters', async () => {
    const mockTables = [{ id: 1, name: 'data', schema: 'my schema' }];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTables),
    } as unknown as MetabaseClient;

    await listDatabaseTablesDefinition.handler(mockClient, { id: 1, schema: 'my schema' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema/my%20schema');
  });

  it('should handle empty table list', async () => {
    const mockTables: unknown[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTables),
    } as unknown as MetabaseClient;

    const result = await listDatabaseTablesDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    await expect(listDatabaseTablesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(listDatabaseTablesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseTablesDefinition.name).toBe('list_database_tables');
    expect(listDatabaseTablesDefinition.description).toBe(
      'List tables in a database schema from Metabase',
    );
    expect(listDatabaseTablesDefinition.inputSchema).toEqual(ListDatabaseTablesParamsSchema);
  });
});
