import { GetCollectionParamsSchema } from '@src/schemas/collection';
import { getCollectionDefinition } from '@src/tools/collection/get-collection';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollection tool', () => {
  it('should return formatted MCP response with collection data', async () => {
    const mockCollection = {
      id: 5,
      name: 'Marketing Reports',
      description: 'Collection for marketing team',
      location: '/5/',
      personal_owner_id: null,
      archived: false,
    };

    const mockClient = createMockClientWithResponse('get', mockCollection);

    const result = await getCollectionDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle root collection with string id', async () => {
    const mockRootCollection = {
      id: 'root',
      name: 'Our analytics',
      description: null,
      location: '/',
      personal_owner_id: null,
    };

    const mockClient = createMockClientWithResponse('get', mockRootCollection);

    const result = await getCollectionDefinition.handler(mockClient, { id: 'root' });

    expectMcpContent(result, mockRootCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root');
  });

  it('should handle collection with minimal data', async () => {
    const mockCollection = {
      id: 10,
      name: 'Simple Collection',
    };

    const mockClient = createMockClientWithResponse('get', mockCollection);

    const result = await getCollectionDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/10');
  });

  it('should handle personal collection', async () => {
    const mockPersonalCollection = {
      id: 15,
      name: "John's Collection",
      description: null,
      location: '/15/',
      personal_owner_id: 1,
    };

    const mockClient = createMockClientWithResponse('get', mockPersonalCollection);

    const result = await getCollectionDefinition.handler(mockClient, { id: 15 });

    expectMcpContent(result, mockPersonalCollection);
  });

  it('should propagate client errors for non-existent collection', async () => {
    const mockClient = createMockClientWithError('get', 'Collection not found');

    await expect(getCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getCollectionDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getCollectionDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionDefinition.name).toBe('get_collection');
    expect(getCollectionDefinition.description).toBe(
      'Get a single collection by ID from Metabase (supports "root" for root collection)',
    );
    expect(getCollectionDefinition.inputSchema).toEqual(GetCollectionParamsSchema);
  });
});
