import { GetCardParamsSchema } from '@src/schemas/card';
import { getCardDefinition } from '@src/tools/card/get-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCard tool', () => {
  it('should return formatted MCP response with card data', async () => {
    const mockCard = {
      id: 1,
      name: 'Sales Report',
      description: 'Monthly sales metrics',
      display: 'bar',
      database_id: 1,
      collection_id: 5,
    };

    const mockClient = createMockClientWithResponse('get', mockCard);

    const result = await getCardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockCard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle card with minimal data', async () => {
    const mockCard = {
      id: 42,
      name: 'Simple Question',
      display: 'table',
      database_id: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockCard);

    const result = await getCardDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockCard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');

    await expect(getCardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getCardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardDefinition.name).toBe('get_card');
    expect(getCardDefinition.description).toBe(
      'Get a single card (saved question) by ID from Metabase',
    );
    expect(getCardDefinition.inputSchema).toEqual(GetCardParamsSchema);
  });
});
