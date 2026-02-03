import { GetTableParamsSchema } from '@src/schemas/table';
import { getTableDefinition } from '@src/tools/table/get-table';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTable tool', () => {
  it('should return formatted MCP response with table data', async () => {
    const mockTable = {
      id: 1,
      name: 'users',
      display_name: 'Users',
      description: 'Application users table',
      db_id: 1,
      schema: 'public',
      visibility_type: null,
      active: true,
    };

    const mockClient = createMockClientWithResponse('get', mockTable);

    const result = await getTableDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockTable);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle table with minimal data', async () => {
    const mockTable = {
      id: 42,
      name: 'orders',
      db_id: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockTable);

    const result = await getTableDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockTable);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/42');
  });

  it('should handle hidden table', async () => {
    const mockTable = {
      id: 10,
      name: '_internal_logs',
      display_name: 'Internal Logs',
      db_id: 1,
      schema: 'internal',
      visibility_type: 'hidden',
      active: true,
    };

    const mockClient = createMockClientWithResponse('get', mockTable);

    const result = await getTableDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockTable);
  });

  it('should handle table with fields data', async () => {
    const mockTable = {
      id: 5,
      name: 'products',
      db_id: 1,
      fields: [
        { id: 1, name: 'id', base_type: 'type/Integer' },
        { id: 2, name: 'name', base_type: 'type/Text' },
        { id: 3, name: 'price', base_type: 'type/Decimal' },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockTable);

    const result = await getTableDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockTable);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(getTableDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getTableDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableDefinition.name).toBe('get_table');
    expect(getTableDefinition.description).toBe('Get a single table by ID from Metabase');
    expect(getTableDefinition.inputSchema).toEqual(GetTableParamsSchema);
  });
});
