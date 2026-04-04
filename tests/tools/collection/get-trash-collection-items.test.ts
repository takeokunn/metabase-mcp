import { getTrashCollectionItemsDefinition } from '@src/tools/collection/get-trash-collection-items';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTrashCollectionItems tool', () => {
  it('should return formatted MCP response with trash collection items', async () => {
    const mockItems = {
      data: [
        { id: 10, name: 'Deleted Dashboard', model: 'dashboard' },
        { id: 11, name: 'Deleted Card', model: 'card' },
      ],
      total: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getTrashCollectionItemsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockItems);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/trash/items');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty trash', async () => {
    const mockItems = { data: [], total: 0 };
    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getTrashCollectionItemsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockItems);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(getTrashCollectionItemsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getTrashCollectionItemsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTrashCollectionItemsDefinition.name).toBe('get_trash_collection_items');
    expect(getTrashCollectionItemsDefinition.description).toBe(
      'Get items in the trash collection in Metabase',
    );
  });
});
