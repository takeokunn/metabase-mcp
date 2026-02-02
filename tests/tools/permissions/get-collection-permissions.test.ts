import type { MetabaseClient } from '@src/client';
import { getCollectionPermissionsDefinition } from '@src/tools/permissions/get-collection-permissions';
import { describe, expect, it, vi } from 'vitest';

describe('getCollectionPermissions tool', () => {
  it('should return formatted MCP response with collection permissions graph', async () => {
    const mockPermissionsGraph = {
      revision: 3,
      groups: {
        '1': {
          root: 'none',
          '5': 'read',
          '10': 'write',
        },
        '2': {
          root: 'write',
          '5': 'write',
          '10': 'write',
        },
      },
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getCollectionPermissionsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/graph');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle permissions with multiple collections', async () => {
    const mockPermissionsGraph = {
      revision: 8,
      groups: {
        '3': {
          root: 'read',
          '1': 'write',
          '2': 'read',
          '3': 'none',
          '4': 'write',
        },
      },
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getCollectionPermissionsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/graph');
  });

  it('should handle empty permissions graph', async () => {
    const mockPermissionsGraph = {
      revision: 1,
      groups: {},
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getCollectionPermissionsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as MetabaseClient;

    await expect(getCollectionPermissionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCollectionPermissionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionPermissionsDefinition.name).toBe('get_collection_permissions');
    expect(getCollectionPermissionsDefinition.description).toBe(
      'Get the collection permissions graph for all groups and collections in Metabase',
    );
    expect(getCollectionPermissionsDefinition.inputSchema).toEqual({});
  });
});
