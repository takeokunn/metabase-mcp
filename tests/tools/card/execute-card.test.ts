import { ExecuteCardParamsSchema } from '@src/schemas/card';
import { executeCardDefinition } from '@src/tools/card/execute-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeCard tool', () => {
  it('should return formatted MCP response with query results', async () => {
    const mockQueryResult = {
      data: {
        rows: [
          [1, 'Product A', 100],
          [2, 'Product B', 200],
        ],
        cols: [
          { name: 'id', base_type: 'type/Integer' },
          { name: 'name', base_type: 'type/Text' },
          { name: 'price', base_type: 'type/Integer' },
        ],
      },
      row_count: 2,
    };

    const mockClient = createMockClientWithResponse('post', mockQueryResult);

    const result = await executeCardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockQueryResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/1/query', undefined);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should execute card with parameters', async () => {
    const mockQueryResult = {
      data: {
        rows: [[1, 'Filtered Result', 50]],
        cols: [
          { name: 'id', base_type: 'type/Integer' },
          { name: 'name', base_type: 'type/Text' },
          { name: 'price', base_type: 'type/Integer' },
        ],
      },
      row_count: 1,
    };

    const mockClient = createMockClientWithResponse('post', mockQueryResult);

    const input = {
      id: 42,
      parameters: { category: 'electronics', min_price: 10 },
    };

    const result = await executeCardDefinition.handler(mockClient, input);

    expectMcpContent(result, mockQueryResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/42/query', {
      parameters: { category: 'electronics', min_price: 10 },
    });
  });

  it('should handle empty result set', async () => {
    const mockQueryResult = {
      data: {
        rows: [],
        cols: [
          { name: 'id', base_type: 'type/Integer' },
          { name: 'name', base_type: 'type/Text' },
        ],
      },
      row_count: 0,
    };

    const mockClient = createMockClientWithResponse('post', mockQueryResult);

    const result = await executeCardDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockQueryResult);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Card not found');

    await expect(executeCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/999/query', undefined);
  });

  it('should propagate query execution errors', async () => {
    const mockClient = createMockClientWithError(
      'post',
      createApiError('Query failed: Invalid column reference', 400),
    );

    await expect(executeCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Query failed: Invalid column reference',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(executeCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(executeCardDefinition.name).toBe('execute_card');
    expect(executeCardDefinition.description).toBe(
      'Execute a card (saved question) and return the query results',
    );
    expect(executeCardDefinition.inputSchema).toEqual(ExecuteCardParamsSchema);
  });
});
