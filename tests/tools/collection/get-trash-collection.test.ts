import { getTrashCollectionDefinition } from '@src/tools/collection/get-trash-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTrashCollection tool', () => {
  it('should return formatted MCP response with trash collection data', async () => {
    const mockCollection = {
      id: 'trash',
      name: 'Trash',
      description: null,
      location: '/trash/',
    };

    const mockClient = createMockClientWithResponse('get', mockCollection);

    const result = await getTrashCollectionDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/trash');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');

    await expect(getTrashCollectionDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getTrashCollectionDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getTrashCollectionDefinition.name).toBe('get_trash_collection');
    expect(getTrashCollectionDefinition.description).toBe(
      'Get the trash collection from Metabase',
    );
  });
});
