import { DeleteDatabaseSchemaParamsSchema } from '@src/schemas/database';
import { listDatabaseSchemasWithTablesDefinition } from '@src/tools/database/list-database-schemas-with-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseSchemasWithTables tool', () => {
  it('should return formatted MCP response with tables in a schema', async () => {
    const mockTables = [
      { id: 1, name: 'orders', schema: 'public' },
      { id: 2, name: 'users', schema: 'public' },
    ];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseSchemasWithTablesDefinition.handler(mockClient, {
      id: 1,
      schema: 'public',
    });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema/public');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should URL-encode schema names with special characters', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await listDatabaseSchemasWithTablesDefinition.handler(mockClient, {
      id: 2,
      schema: 'my schema',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/2/schema/my%20schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(
      listDatabaseSchemasWithTablesDefinition.handler(mockClient, { id: 999, schema: 'public' }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      listDatabaseSchemasWithTablesDefinition.handler(mockClient, { id: 1, schema: 'public' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseSchemasWithTablesDefinition.name).toBe('list_database_schemas_with_tables');
    expect(listDatabaseSchemasWithTablesDefinition.description).toBe(
      'List all tables within a specific schema of a database in Metabase',
    );
    expect(listDatabaseSchemasWithTablesDefinition.inputSchema).toEqual(
      DeleteDatabaseSchemaParamsSchema,
    );
  });
});
