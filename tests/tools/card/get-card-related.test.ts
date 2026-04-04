import { GetCardRelatedParamsSchema } from '@src/schemas/card';
import { getCardRelatedDefinition } from '@src/tools/card/get-card-related';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardRelated tool', () => {
  it('should return formatted MCP response with related items', async () => {
    const mockResult = {
      cards: [{ id: 2, name: 'Related Card' }],
      tables: [{ id: 5, name: 'orders' }],
    };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getCardRelatedDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/related');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');
    await expect(getCardRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCardRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardRelatedDefinition.name).toBe('get_card_related');
    expect(getCardRelatedDefinition.inputSchema).toEqual(GetCardRelatedParamsSchema);
  });
});
