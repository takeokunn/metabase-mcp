import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { listDatabaseVirtualTablesDefinition } from '@src/tools/database/list-database-virtual-tables';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseVirtualTables tool', () => {
  it('should return formatted MCP response with virtual tables', async () => {
    const mockTables = [{ id: 'card__1', name: 'My Question', schema: '__virtual' }];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await listDatabaseVirtualTablesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schema');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty virtual tables list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDatabaseVirtualTablesDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(
      listDatabaseVirtualTablesDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      listDatabaseVirtualTablesDefinition.handler(mockClient, { id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseVirtualTablesDefinition.name).toBe('list_database_virtual_tables');
    expect(listDatabaseVirtualTablesDefinition.description).toBe(
      'List virtual tables (saved questions) available as tables in a database in Metabase',
    );
    expect(listDatabaseVirtualTablesDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
