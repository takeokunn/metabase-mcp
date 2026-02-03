import { DeleteCollectionInputSchema } from '@src/schemas/collection';
import { deleteCollectionDefinition } from '@src/tools/collection/delete-collection';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteCollection tool', () => {
  it('should return formatted MCP response after archiving collection', async () => {
    const mockResult = {
      id: 1,
      name: 'Archived Collection',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await deleteCollectionDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/1', { archived: true });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should archive collection with different ID', async () => {
    const mockResult = {
      id: 42,
      name: 'Another Archived Collection',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await deleteCollectionDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/42', { archived: true });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Collection not found');

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/999', { archived: true });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCollectionDefinition.name).toBe('delete_collection');
    expect(deleteCollectionDefinition.description).toBe(
      'Archive (soft-delete) a collection in Metabase',
    );
    expect(deleteCollectionDefinition.inputSchema).toEqual(DeleteCollectionInputSchema);
  });
});
