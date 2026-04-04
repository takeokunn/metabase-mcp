import { MoveCollectionItemsInputSchema } from '@src/schemas/collection';
import { moveCollectionItemsDefinition } from '@src/tools/collection/move-collection-items';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('moveCollectionItems tool', () => {
  it('should return formatted MCP response after moving items', async () => {
    const mockResult = { moved: 2 };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await moveCollectionItemsDefinition.handler(mockClient, {
      source_collection_id: 1,
      destination_collection_id: 2,
      items: [
        { id: 10, model: 'card' },
        { id: 11, model: 'dashboard' },
      ],
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection/1/move-to-collection', {
      destination_collection_id: 2,
      items: [
        { id: 10, model: 'card' },
        { id: 11, model: 'dashboard' },
      ],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should move a single item', async () => {
    const mockClient = createMockClientWithResponse('post', { moved: 1 });

    await moveCollectionItemsDefinition.handler(mockClient, {
      source_collection_id: 5,
      destination_collection_id: 10,
      items: [{ id: 42, model: 'card' }],
    });

    expect(mockClient.post).toHaveBeenCalledWith('/api/collection/5/move-to-collection', {
      destination_collection_id: 10,
      items: [{ id: 42, model: 'card' }],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Collection not found');

    await expect(
      moveCollectionItemsDefinition.handler(mockClient, {
        source_collection_id: 1,
        destination_collection_id: 2,
        items: [{ id: 10, model: 'card' }],
      }),
    ).rejects.toThrow('Collection not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(
      moveCollectionItemsDefinition.handler(mockClient, {
        source_collection_id: 1,
        destination_collection_id: 2,
        items: [{ id: 10, model: 'card' }],
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(moveCollectionItemsDefinition.name).toBe('move_collection_items');
    expect(moveCollectionItemsDefinition.description).toBe(
      'Move items from a source collection to a destination collection in Metabase',
    );
    expect(moveCollectionItemsDefinition.inputSchema).toEqual(MoveCollectionItemsInputSchema);
  });
});
