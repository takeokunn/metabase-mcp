import type { MetabaseClient } from '@src/client';
import { ExecuteCardParamsSchema } from '@src/schemas/card';
import { executeCardDefinition } from '@src/tools/card/execute-card';
import { describe, expect, it, vi } from 'vitest';

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

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockQueryResult),
    } as unknown as MetabaseClient;

    const result = await executeCardDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockQueryResult);
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

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockQueryResult),
    } as unknown as MetabaseClient;

    const input = {
      id: 42,
      parameters: { category: 'electronics', min_price: 10 },
    };

    const result = await executeCardDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockQueryResult);
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

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockQueryResult),
    } as unknown as MetabaseClient;

    const result = await executeCardDefinition.handler(mockClient, { id: 5 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.row_count).toBe(0);
    expect(parsedResult.data.rows).toHaveLength(0);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Card not found')),
    } as unknown as MetabaseClient;

    await expect(executeCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/999/query', undefined);
  });

  it('should propagate query execution errors', async () => {
    const apiError = new Error('Query failed: Invalid column reference');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(executeCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Query failed: Invalid column reference',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
