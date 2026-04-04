import { BulkMoveCardsInputSchema } from '@src/schemas/cards-bulk';
import { bulkMoveCardsDefinition } from '@src/tools/cards-bulk/bulk-move-cards';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('bulkMoveCards tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await bulkMoveCardsDefinition.handler(mockClient, {
      card_ids: [1, 2, 3],
      collection_id: 10,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/cards/move', {
      card_ids: [1, 2, 3],
      collection_id: 10,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should support null collection_id', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await bulkMoveCardsDefinition.handler(mockClient, { card_ids: [1], collection_id: null });
    expect(mockClient.post).toHaveBeenCalledWith('/api/cards/move', {
      card_ids: [1],
      collection_id: null,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      bulkMoveCardsDefinition.handler(mockClient, { card_ids: [999], collection_id: 1 }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      bulkMoveCardsDefinition.handler(mockClient, { card_ids: [1], collection_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(bulkMoveCardsDefinition.name).toBe('bulk_move_cards');
    expect(bulkMoveCardsDefinition.description).toBe(
      'Move multiple cards to a collection in Metabase',
    );
    expect(bulkMoveCardsDefinition.inputSchema).toEqual(BulkMoveCardsInputSchema);
  });
});
