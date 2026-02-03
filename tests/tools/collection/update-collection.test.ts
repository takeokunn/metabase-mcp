import { UpdateCollectionInputSchema } from '@src/schemas/collection';
import { updateCollectionDefinition } from '@src/tools/collection/update-collection';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateCollection tool', () => {
  it('should return formatted MCP response with updated collection', async () => {
    const mockUpdatedCollection = {
      id: 5,
      name: 'Updated Marketing Reports',
      description: 'Updated description',
      location: '/5/',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 5,
      name: 'Updated Marketing Reports',
      description: 'Updated description',
    });

    expectMcpContent(result, mockUpdatedCollection);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/5', {
      name: 'Updated Marketing Reports',
      description: 'Updated description',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update collection name only', async () => {
    const mockUpdatedCollection = {
      id: 10,
      name: 'New Collection Name',
      location: '/10/',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 10,
      name: 'New Collection Name',
    });

    expectMcpContent(result, mockUpdatedCollection);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/10', {
      name: 'New Collection Name',
    });
  });

  it('should update collection description only', async () => {
    const mockUpdatedCollection = {
      id: 15,
      name: 'My Collection',
      description: 'Updated description for the collection',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 15,
      description: 'Updated description for the collection',
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/15', {
      description: 'Updated description for the collection',
    });
  });

  it('should move collection to different parent', async () => {
    const mockUpdatedCollection = {
      id: 20,
      name: 'Moved Collection',
      location: '/5/20/',
      parent_id: 5,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 20,
      parent_id: 5,
    });

    expectMcpContent(result, mockUpdatedCollection);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/20', {
      parent_id: 5,
    });
  });

  it('should archive collection', async () => {
    const mockUpdatedCollection = {
      id: 25,
      name: 'Archived Collection',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 25,
      archived: true,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/25', {
      archived: true,
    });
  });

  it('should unarchive collection', async () => {
    const mockUpdatedCollection = {
      id: 30,
      name: 'Unarchived Collection',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 30,
      archived: false,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/30', {
      archived: false,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedCollection = {
      id: 35,
      name: 'Comprehensive Update',
      description: 'New description',
      location: '/10/35/',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCollection);

    const result = await updateCollectionDefinition.handler(mockClient, {
      id: 35,
      name: 'Comprehensive Update',
      description: 'New description',
      parent_id: 10,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/35', {
      name: 'Comprehensive Update',
      description: 'New description',
      parent_id: 10,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Collection not found');

    await expect(
      updateCollectionDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Collection not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/999', { name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateCollectionDefinition.handler(mockClient, { id: 5, name: 'Test' }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateCollectionDefinition.handler(mockClient, { id: 5, name: 'Test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateCollectionDefinition.name).toBe('update_collection');
    expect(updateCollectionDefinition.description).toBe(
      'Update an existing collection in Metabase',
    );
    expect(updateCollectionDefinition.inputSchema).toEqual(UpdateCollectionInputSchema);
  });
});
