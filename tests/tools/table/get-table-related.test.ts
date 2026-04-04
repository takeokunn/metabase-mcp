import { TableIdInputSchema } from '@src/schemas/table';
import { getTableRelatedDefinition } from '@src/tools/table/get-table-related';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableRelated tool', () => {
  it('should return formatted MCP response with related items', async () => {
    const mockResult = {
      tables: [{ id: 2, name: 'orders', similarity: 0.8 }],
      cards: [{ id: 5, name: 'Order Revenue by Month' }],
    };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getTableRelatedDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1/related');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should get related items for different table', async () => {
    const mockResult = { tables: [], cards: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    await getTableRelatedDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/table/10/related');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(getTableRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getTableRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableRelatedDefinition.name).toBe('get_table_related');
    expect(getTableRelatedDefinition.description).toBe(
      'Get related tables and cards for a table in Metabase',
    );
    expect(getTableRelatedDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
