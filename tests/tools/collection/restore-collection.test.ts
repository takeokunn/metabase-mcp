import { RestoreCollectionInputSchema } from '@src/schemas/collection';
import { restoreCollectionDefinition } from '@src/tools/collection/restore-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('restoreCollection tool', () => {
  it('should return formatted MCP response after restoring collection', async () => {
    const mockResult = {
      id: 5,
      name: 'Restored Collection',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await restoreCollectionDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection/5/restore');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should restore collection with different ID', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 10, archived: false });

    await restoreCollectionDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.post).toHaveBeenCalledWith('/api/collection/10/restore');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Collection not found');

    await expect(restoreCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(restoreCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(restoreCollectionDefinition.name).toBe('restore_collection');
    expect(restoreCollectionDefinition.description).toBe(
      'Restore a collection from the trash in Metabase',
    );
    expect(restoreCollectionDefinition.inputSchema).toEqual(RestoreCollectionInputSchema);
  });
});
