import type { MetabaseClient } from '@src/client';
import { getDataPermissionsDefinition } from '@src/tools/permissions/get-data-permissions';
import { describe, expect, it, vi } from 'vitest';

describe('getDataPermissions tool', () => {
  it('should return formatted MCP response with data permissions graph', async () => {
    const mockPermissionsGraph = {
      revision: 5,
      groups: {
        '1': {
          '1': {
            data: {
              native: 'none',
              schemas: 'all',
            },
          },
        },
        '2': {
          '1': {
            data: {
              native: 'write',
              schemas: 'all',
            },
          },
        },
      },
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle complex permissions with schema-level granularity', async () => {
    const mockPermissionsGraph = {
      revision: 10,
      groups: {
        '3': {
          '1': {
            data: {
              native: 'none',
              schemas: {
                public: 'all',
                private: 'none',
              },
            },
          },
          '2': {
            data: {
              native: 'write',
              schemas: 'all',
            },
          },
        },
      },
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph');
  });

  it('should handle empty permissions graph', async () => {
    const mockPermissionsGraph = {
      revision: 1,
      groups: {},
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPermissionsGraph),
    } as unknown as MetabaseClient;

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockPermissionsGraph);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as MetabaseClient;

    await expect(getDataPermissionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getDataPermissionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDataPermissionsDefinition.name).toBe('get_data_permissions');
    expect(getDataPermissionsDefinition.description).toBe(
      'Get the data permissions graph for all groups and databases in Metabase',
    );
    expect(getDataPermissionsDefinition.inputSchema).toEqual({});
  });
});
