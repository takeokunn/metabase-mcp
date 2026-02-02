import type { MetabaseClient } from '@src/client';
import { UpdateCollectionPermissionsInputSchema } from '@src/schemas/permissions';
import { updateCollectionPermissionsDefinition } from '@src/tools/permissions/update-collection-permissions';
import { describe, expect, it, vi } from 'vitest';

describe('updateCollectionPermissions tool', () => {
  it('should update collection permissions and return formatted MCP response', async () => {
    const mockResponse = {
      revision: 4,
      groups: {
        '1': {
          root: 'none',
          '5': 'read',
          '10': 'write',
        },
      },
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      revision: 3,
      groups: {
        '1': {
          root: 'none' as const,
          '5': 'read' as const,
          '10': 'write' as const,
        },
      },
    };

    const result = await updateCollectionPermissionsDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/graph', {
      revision: 3,
      groups: input.groups,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle permissions with multiple collections', async () => {
    const mockResponse = {
      revision: 9,
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
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      revision: 8,
      groups: {
        '3': {
          root: 'read' as const,
          '1': 'write' as const,
          '2': 'read' as const,
          '3': 'none' as const,
          '4': 'write' as const,
        },
      },
    };

    const result = await updateCollectionPermissionsDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/graph', {
      revision: 8,
      groups: input.groups,
    });
  });

  it('should handle multiple groups', async () => {
    const mockResponse = {
      revision: 6,
      groups: {
        '1': {
          root: 'write',
          '5': 'write',
        },
        '2': {
          root: 'read',
          '5': 'none',
        },
        '3': {
          root: 'none',
          '5': 'read',
        },
      },
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      revision: 5,
      groups: {
        '1': {
          root: 'write' as const,
          '5': 'write' as const,
        },
        '2': {
          root: 'read' as const,
          '5': 'none' as const,
        },
        '3': {
          root: 'none' as const,
          '5': 'read' as const,
        },
      },
    };

    const result = await updateCollectionPermissionsDefinition.handler(mockClient, input);

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.revision).toBe(6);
    expect(Object.keys(parsedResult.groups)).toHaveLength(3);
  });

  it('should handle empty groups update', async () => {
    const mockResponse = {
      revision: 2,
      groups: {},
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      revision: 1,
      groups: {},
    };

    const result = await updateCollectionPermissionsDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/graph', {
      revision: 1,
      groups: {},
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as MetabaseClient;

    const input = {
      revision: 3,
      groups: {
        '1': {
          root: 'write' as const,
        },
      },
    };

    await expect(updateCollectionPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate revision conflict errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Revision mismatch')),
    } as unknown as MetabaseClient;

    const input = {
      revision: 1,
      groups: {
        '1': {
          root: 'read' as const,
        },
      },
    };

    await expect(updateCollectionPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Revision mismatch',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      revision: 5,
      groups: {},
    };

    await expect(updateCollectionPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      revision: 5,
      groups: {
        '1': {
          root: 'write' as const,
        },
      },
    };

    await expect(updateCollectionPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateCollectionPermissionsDefinition.name).toBe('update_collection_permissions');
    expect(updateCollectionPermissionsDefinition.description).toBe(
      'Update the collection permissions graph for groups and collections in Metabase',
    );
    expect(updateCollectionPermissionsDefinition.inputSchema).toEqual(
      UpdateCollectionPermissionsInputSchema,
    );
  });
});
