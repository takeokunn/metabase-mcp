import { HardDeleteCollectionInputSchema } from '@src/schemas/collection';
import { hardDeleteCollectionDefinition } from '@src/tools/collection/hard-delete-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('hardDeleteCollection tool', () => {
  it('should return formatted MCP response after hard deleting collection', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await hardDeleteCollectionDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/collection/5');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should hard delete collection with different ID', async () => {
    const mockClient = createMockClientWithResponse('delete', null);

    await hardDeleteCollectionDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/collection/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Collection not found');

    await expect(hardDeleteCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(hardDeleteCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(hardDeleteCollectionDefinition.name).toBe('hard_delete_collection');
    expect(hardDeleteCollectionDefinition.description).toBe(
      'Permanently delete a collection in Metabase (cannot be undone)',
    );
    expect(hardDeleteCollectionDefinition.inputSchema).toEqual(HardDeleteCollectionInputSchema);
  });
});
