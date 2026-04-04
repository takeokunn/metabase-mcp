import { GetRootCollectionItemsParamsSchema } from '@src/schemas/collection';
import { getRootCollectionItemsDefinition } from '@src/tools/collection/get-root-collection-items';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getRootCollectionItems tool', () => {
  it('should return formatted MCP response with root collection items', async () => {
    const mockItems = {
      data: [
        { id: 1, name: 'Sales Dashboard', model: 'dashboard' },
        { id: 2, name: 'Revenue Report', model: 'card' },
      ],
      total: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockItems);

    const result = await getRootCollectionItemsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockItems);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root/items', {
      limit: undefined,
      offset: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass models filter when provided', async () => {
    const mockItems = { data: [], total: 0 };
    const mockClient = createMockClientWithResponse('get', mockItems);

    await getRootCollectionItemsDefinition.handler(mockClient, { models: ['card', 'dashboard'] });

    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root/items', {
      limit: undefined,
      offset: undefined,
      models: 'card,dashboard',
    });
  });

  it('should pass pagination parameters when provided', async () => {
    const mockItems = { data: [], total: 0 };
    const mockClient = createMockClientWithResponse('get', mockItems);

    await getRootCollectionItemsDefinition.handler(mockClient, { limit: 10, offset: 20 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root/items', {
      limit: 10,
      offset: 20,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(getRootCollectionItemsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getRootCollectionItemsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getRootCollectionItemsDefinition.name).toBe('get_root_collection_items');
    expect(getRootCollectionItemsDefinition.description).toBe(
      'Get items (cards, dashboards, etc.) within the root collection in Metabase',
    );
    expect(getRootCollectionItemsDefinition.inputSchema).toEqual(
      GetRootCollectionItemsParamsSchema,
    );
  });
});
