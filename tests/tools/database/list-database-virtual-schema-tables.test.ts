import { listDatabaseVirtualSchemaTablesDefinition } from '@src/tools/database/list-database-virtual-schema-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseVirtualSchemaTables tool', () => {
  it('should return formatted MCP response with all virtual tables', async () => {
    const mockTables = [
      { id: 'card__1', name: 'Revenue', db_id: 1 },
      { id: 'card__2', name: 'Users', db_id: 2 },
    ];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseVirtualSchemaTablesDefinition.handler(mockClient, {
      virtual_db: 1,
    });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/datasets');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDatabaseVirtualSchemaTablesDefinition.handler(mockClient, {
      virtual_db: 2,
    });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/2/datasets');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(
      listDatabaseVirtualSchemaTablesDefinition.handler(mockClient, { virtual_db: 1 }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      listDatabaseVirtualSchemaTablesDefinition.handler(mockClient, { virtual_db: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseVirtualSchemaTablesDefinition.name).toBe(
      'list_database_virtual_schema_tables',
    );
    expect(listDatabaseVirtualSchemaTablesDefinition.description).toBe(
      'List all virtual tables (saved questions as tables) across all databases in Metabase',
    );
  });
});
