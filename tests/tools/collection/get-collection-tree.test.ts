import type { MetabaseClient } from '@src/client';
import { getCollectionTreeDefinition } from '@src/tools/collection/get-collection-tree';
import { describe, expect, it, vi } from 'vitest';

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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTree),
    } as unknown as MetabaseClient;

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockTree);
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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTree),
    } as unknown as MetabaseClient;

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult[0].children[0].children[0].children[0].name).toBe('Level 4');
  });

  it('should handle empty tree', async () => {
    const mockTree: unknown[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTree),
    } as unknown as MetabaseClient;

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
  });

  it('should handle flat tree with no children', async () => {
    const mockTree = [
      { id: 1, name: 'Collection A', children: [] },
      { id: 2, name: 'Collection B', children: [] },
      { id: 3, name: 'Collection C', children: [] },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTree),
    } as unknown as MetabaseClient;

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toHaveLength(3);
    expect(parsedResult.every((c: { children: unknown[] }) => c.children.length === 0)).toBe(true);
  });

  it('should include personal collections in tree', async () => {
    const mockTree = [
      { id: 1, name: 'Public Collection', personal_owner_id: null, children: [] },
      { id: 2, name: "John's Collection", personal_owner_id: 1, children: [] },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTree),
    } as unknown as MetabaseClient;

    const result = await getCollectionTreeDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toHaveLength(2);
    expect(parsedResult[1].personal_owner_id).toBe(1);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Failed to fetch collection tree')),
    } as unknown as MetabaseClient;

    await expect(getCollectionTreeDefinition.handler(mockClient, {})).rejects.toThrow(
      'Failed to fetch collection tree',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/tree');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCollectionTreeDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
