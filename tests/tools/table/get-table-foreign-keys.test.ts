import { TableIdInputSchema } from '@src/schemas/table';
import { getTableForeignKeysDefinition } from '@src/tools/table/get-table-foreign-keys';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableForeignKeys tool', () => {
  it('should return formatted MCP response with foreign keys', async () => {
    const mockFks = [
      {
        id: 1,
        origin: { id: 10, name: 'user_id', table_id: 5 },
        destination: { id: 20, name: 'id', table_id: 3 },
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockFks);

    const result = await getTableForeignKeysDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockFks);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/fks');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle table with no foreign keys', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await getTableForeignKeysDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1/fks');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(getTableForeignKeysDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getTableForeignKeysDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableForeignKeysDefinition.name).toBe('get_table_foreign_keys');
    expect(getTableForeignKeysDefinition.description).toBe(
      'Get foreign keys for a table in Metabase',
    );
    expect(getTableForeignKeysDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
