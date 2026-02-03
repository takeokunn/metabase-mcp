import { GetCollectionItemsParamsSchema } from '@src/schemas/collection';
import { getCollectionItemsDefinition } from '@src/tools/collection/get-collection-items';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionItems tool', () => {
  it('should return formatted MCP response with collection items', async () => {
    const mockItems = {
      data: [
        { id: 1, name: 'Sales Dashboard', model: 'dashboard' },
        { id: 2, name: 'Revenue Card', model: 'card' },
        { id: 3, name: 'Sub Collection', model: 'collection' },
      ],
      total: 3,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockItems);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5/items', {
      limit: undefined,
      offset: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should get items from root collection', async () => {
    const mockItems = {
      data: [{ id: 10, name: 'Top Level Dashboard', model: 'dashboard' }],
      total: 1,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, { id: 'root' });

    expectMcpContent(result, mockItems);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root/items', {
      limit: undefined,
      offset: undefined,
    });
  });

  it('should filter items by models', async () => {
    const mockItems = {
      data: [
        { id: 1, name: 'Dashboard 1', model: 'dashboard' },
        { id: 2, name: 'Dashboard 2', model: 'dashboard' },
      ],
      total: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, {
      id: 5,
      models: ['dashboard'],
    });

    expectMcpContent(result, mockItems);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5/items', {
      limit: undefined,
      offset: undefined,
      models: 'dashboard',
    });
  });

  it('should filter items by multiple models', async () => {
    const mockItems = {
      data: [
        { id: 1, name: 'Dashboard 1', model: 'dashboard' },
        { id: 2, name: 'Card 1', model: 'card' },
      ],
      total: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, {
      id: 10,
      models: ['dashboard', 'card'],
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/10/items', {
      limit: undefined,
      offset: undefined,
      models: 'dashboard,card',
    });
  });

  it('should support pagination with limit', async () => {
    const mockItems = {
      data: [
        { id: 1, name: 'Item 1', model: 'card' },
        { id: 2, name: 'Item 2', model: 'card' },
      ],
      total: 10,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, {
      id: 5,
      limit: 2,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5/items', {
      limit: 2,
      offset: undefined,
    });
  });

  it('should support pagination with limit and offset', async () => {
    const mockItems = {
      data: [
        { id: 3, name: 'Item 3', model: 'card' },
        { id: 4, name: 'Item 4', model: 'card' },
      ],
      total: 10,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, {
      id: 5,
      limit: 2,
      offset: 2,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5/items', {
      limit: 2,
      offset: 2,
    });
  });

  it('should handle empty collection', async () => {
    const mockItems = {
      data: [],
      total: 0,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getCollectionItemsDefinition.handler(mockClient, { id: 99 });

    expectMcpContent(result, mockItems);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Collection not found');

    await expect(getCollectionItemsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/999/items', {
      limit: undefined,
      offset: undefined,
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getCollectionItemsDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getCollectionItemsDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionItemsDefinition.name).toBe('get_collection_items');
    expect(getCollectionItemsDefinition.description).toBe(
      'Get items (cards, dashboards, etc.) within a collection (supports "root" for root collection)',
    );
    expect(getCollectionItemsDefinition.inputSchema).toEqual(GetCollectionItemsParamsSchema);
  });
});
