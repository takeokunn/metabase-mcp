import { MoveCardsToCollectionInputSchema } from '@src/schemas/card';
import { moveCardsToCollectionDefinition } from '@src/tools/card/move-cards-to-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('moveCardsToCollection tool', () => {
  it('should return formatted MCP response with move result', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    const result = await moveCardsToCollectionDefinition.handler(mockClient, {
      card_ids: [1, 2],
      collection_id: 5,
    });
    expectMcpContent(result, { success: true });
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/collections', {
      card_ids: [1, 2],
      collection_id: 5,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should support null collection_id for root collection', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await moveCardsToCollectionDefinition.handler(mockClient, {
      card_ids: [1],
      collection_id: null,
    });
    expect(mockClient.post).toHaveBeenCalledWith('/api/card/collections', {
      card_ids: [1],
      collection_id: null,
    });
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      moveCardsToCollectionDefinition.handler(mockClient, { card_ids: [999], collection_id: 1 }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      moveCardsToCollectionDefinition.handler(mockClient, { card_ids: [1], collection_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(moveCardsToCollectionDefinition.name).toBe('move_cards_to_collection');
    expect(moveCardsToCollectionDefinition.description).toBe(
      'Move multiple cards to a collection in Metabase',
    );
    expect(moveCardsToCollectionDefinition.inputSchema).toEqual(MoveCardsToCollectionInputSchema);
  });
});
