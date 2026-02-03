import { ListCardsParamsSchema } from '@src/schemas/card';
import { listCardsDefinition } from '@src/tools/card/list-cards';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listCards tool', () => {
  it('should return formatted MCP response with cards', async () => {
    const mockCards = [
      {
        id: 1,
        name: 'Sales Report',
        display: 'bar',
        database_id: 1,
        collection_id: 5,
      },
      {
        id: 2,
        name: 'Revenue Dashboard',
        display: 'line',
        database_id: 1,
        collection_id: 5,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockCards);

    const result = await listCardsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by collection_id when provided', async () => {
    const mockCards = [
      {
        id: 3,
        name: 'Filtered Card',
        display: 'table',
        database_id: 2,
        collection_id: 10,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockCards);

    const result = await listCardsDefinition.handler(mockClient, { collection_id: 10 });

    expectMcpContent(result, mockCards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card', { collection: 10 });
  });

  it('should handle empty card list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listCardsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listCardsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listCardsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCardsDefinition.name).toBe('list_cards');
    expect(listCardsDefinition.description).toBe(
      'Get list of cards (saved questions) in Metabase, optionally filtered by collection',
    );
    expect(listCardsDefinition.inputSchema).toEqual(ListCardsParamsSchema);
  });
});
