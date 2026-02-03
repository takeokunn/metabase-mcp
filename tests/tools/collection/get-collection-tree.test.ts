import { getCollectionTreeDefinition } from '@src/tools/collection/get-collection-tree';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionTree tool', () => {
  it('should return formatted MCP response with collection tree', async () => {
    const mockTree = [
      {
        id: 1,
        name: 'Marketing',
        location: '/1/',
        children: [
          { id: 2, name: 'Campaigns', location: '/1/2/', children: [] },
          { id: 3, name: 'Reports', location: '/1/3/', children: [] },
        ],
      },
      {
        id: 4,
        name: 'Sales',
        location: '/4/',
        children: [],
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockTree);

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expectMcpContent(result, mockTree);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/tree');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle deeply nested tree structure', async () => {
    const mockTree = [
      {
        id: 1,
        name: 'Level 1',
        children: [
          {
            id: 2,
            name: 'Level 2',
            children: [
              {
                id: 3,
                name: 'Level 3',
                children: [{ id: 4, name: 'Level 4', children: [] }],
              },
            ],
          },
        ],
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockTree);

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult[0].children[0].children[0].children[0].name).toBe('Level 4');
  });

  it('should handle empty tree', async () => {
    const mockTree: unknown[] = [];

    const mockClient = createMockClientWithResponse('get', mockTree);

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should handle flat tree with no children', async () => {
    const mockTree = [
      { id: 1, name: 'Collection A', children: [] },
      { id: 2, name: 'Collection B', children: [] },
      { id: 3, name: 'Collection C', children: [] },
    ];

    const mockClient = createMockClientWithResponse('get', mockTree);

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expectMcpContent(result, mockTree);
  });

  it('should include personal collections in tree', async () => {
    const mockTree = [
      { id: 1, name: 'Public Collection', personal_owner_id: null, children: [] },
      { id: 2, name: "John's Collection", personal_owner_id: 1, children: [] },
    ];

    const mockClient = createMockClientWithResponse('get', mockTree);

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expectMcpContent(result, mockTree);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Failed to fetch collection tree');

    await expect(getCollectionTreeDefinition.handler(mockClient, {})).rejects.toThrow(
      'Failed to fetch collection tree',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/tree');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getCollectionTreeDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(getCollectionTreeDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionTreeDefinition.name).toBe('get_collection_tree');
    expect(getCollectionTreeDefinition.description).toBe(
      'Get the hierarchical tree structure of all collections in Metabase',
    );
    expect(getCollectionTreeDefinition.inputSchema).toEqual({});
  });
});
