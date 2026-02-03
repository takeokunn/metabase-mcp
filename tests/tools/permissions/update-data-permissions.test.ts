import { UpdateDataPermissionsInputSchema } from '@src/schemas/permissions';
import { updateDataPermissionsDefinition } from '@src/tools/permissions/update-data-permissions';
import { describe, expect, it } from 'vitest';
import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';
import { createApiError } from '../../__factories__';

describe('updateDataPermissions tool', () => {
  it('should update data permissions and return formatted MCP response', async () => {
    const mockResponse = {
      revision: 6,
      groups: {
        '1': {
          '1': {
            data: {
              native: 'none',
              schemas: 'all',
            },
          },
        },
      },
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      revision: 5,
      groups: {
        '1': {
          '1': {
            data: {
              native: 'none' as const,
              schemas: 'all' as const,
            },
          },
        },
      },
    };

    const result = await updateDataPermissionsDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/graph', {
      revision: 5,
      groups: input.groups,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle complex permissions with schema-level granularity', async () => {
    const mockResponse = {
      revision: 11,
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
              native: 'unrestricted',
              schemas: 'all',
            },
          },
        },
      },
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      revision: 10,
      groups: {
        '3': {
          '1': {
            data: {
              native: 'none' as const,
              schemas: {
                public: 'all' as const,
                private: 'none' as const,
              },
            },
          },
          '2': {
            data: {
              native: 'unrestricted' as const,
              schemas: 'all' as const,
            },
          },
        },
      },
    };

    const result = await updateDataPermissionsDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/graph', {
      revision: 10,
      groups: input.groups,
    });
  });

  it('should handle multiple groups and databases', async () => {
    const mockResponse = {
      revision: 3,
      groups: {
        '1': {
          '1': { data: { native: 'all', schemas: 'all' } },
          '2': { data: { native: 'none', schemas: 'none' } },
        },
        '2': {
          '1': { data: { native: 'none', schemas: 'all' } },
          '2': { data: { native: 'all', schemas: 'all' } },
        },
      },
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      revision: 2,
      groups: {
        '1': {
          '1': { data: { native: 'all' as const, schemas: 'all' as const } },
          '2': { data: { native: 'none' as const, schemas: 'none' as const } },
        },
        '2': {
          '1': { data: { native: 'none' as const, schemas: 'all' as const } },
          '2': { data: { native: 'all' as const, schemas: 'all' as const } },
        },
      },
    };

    const result = await updateDataPermissionsDefinition.handler(mockClient, input);

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.revision).toBe(3);
    expect(Object.keys(parsedResult.groups)).toHaveLength(2);
  });

  it('should handle empty groups update', async () => {
    const mockResponse = {
      revision: 2,
      groups: {},
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      revision: 1,
      groups: {},
    };

    const result = await updateDataPermissionsDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/graph', {
      revision: 1,
      groups: {},
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Permission denied');

    const input = {
      revision: 5,
      groups: {
        '1': {
          '1': {
            data: {
              native: 'all' as const,
              schemas: 'all' as const,
            },
          },
        },
      },
    };

    await expect(updateDataPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate revision conflict errors', async () => {
    const mockClient = createMockClientWithError('put', 'Revision mismatch');

    const input = {
      revision: 1,
      groups: {
        '1': {
          '1': {
            data: {
              native: 'none' as const,
            },
          },
        },
      },
    };

    await expect(updateDataPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Revision mismatch',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    const input = {
      revision: 5,
      groups: {},
    };

    await expect(updateDataPermissionsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDataPermissionsDefinition.name).toBe('update_data_permissions');
    expect(updateDataPermissionsDefinition.description).toBe(
      'Update the data permissions graph for groups and databases in Metabase',
    );
    expect(updateDataPermissionsDefinition.inputSchema).toEqual(UpdateDataPermissionsInputSchema);
  });
});
