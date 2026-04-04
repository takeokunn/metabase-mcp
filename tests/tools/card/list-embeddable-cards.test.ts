import { ListEmbeddableCardsParamsSchema } from '@src/schemas/card';
import { listEmbeddableCardsDefinition } from '@src/tools/card/list-embeddable-cards';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listEmbeddableCards tool', () => {
  it('should return formatted MCP response with embeddable cards', async () => {
    const mockResult = [
      { id: 1, name: 'Sales Overview' },
      { id: 2, name: 'Revenue Trend' },
    ];
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listEmbeddableCardsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/embeddable');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should return empty list when no embeddable cards exist', async () => {
    const mockClient = createMockClientWithResponse('get', []);
    const result = await listEmbeddableCardsDefinition.handler(mockClient, {});
    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Internal server error');
    await expect(listEmbeddableCardsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Internal server error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(listEmbeddableCardsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listEmbeddableCardsDefinition.name).toBe('list_embeddable_cards');
    expect(listEmbeddableCardsDefinition.inputSchema).toEqual(ListEmbeddableCardsParamsSchema);
  });
});
