import { ListDatabaseTablesParamsSchema } from '@src/schemas/database';
import { listDatabaseTablesDefinition } from '@src/tools/database/list-database-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseTables tool', () => {
  it('should return formatted MCP response with tables without schema filter', async () => {
    const mockTables = [
      { id: 1, name: 'users', schema: 'public' },
      { id: 2, name: 'orders', schema: 'public' },
      { id: 3, name: 'products', schema: 'inventory' },
    ];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseTablesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return tables filtered by schema', async () => {
    const mockTables = [
      { id: 1, name: 'users', schema: 'public' },
      { id: 2, name: 'orders', schema: 'public' },
    ];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseTablesDefinition.handler(mockClient, {
      id: 1,
      schema: 'public',
    });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema/public');
  });

  it('should encode schema name with special characters', async () => {
    const mockTables = [{ id: 1, name: 'data', schema: 'my schema' }];

    const mockClient = createMockClientWithResponse('get', mockTables);

    await listDatabaseTablesDefinition.handler(mockClient, { id: 1, schema: 'my schema' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema/my%20schema');
  });

  it('should handle empty table list', async () => {
    const mockTables: unknown[] = [];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseTablesDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(listDatabaseTablesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

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
