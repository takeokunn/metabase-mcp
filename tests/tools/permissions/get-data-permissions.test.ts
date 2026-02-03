import { getDataPermissionsDefinition } from '@src/tools/permissions/get-data-permissions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

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

    const mockClient = createMockClientWithResponse('get', mockPermissionsGraph);

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockPermissionsGraph);
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

    const mockClient = createMockClientWithResponse('get', mockPermissionsGraph);

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockPermissionsGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph');
  });

  it('should handle empty permissions graph', async () => {
    const mockPermissionsGraph = {
      revision: 1,
      groups: {},
    };

    const mockClient = createMockClientWithResponse('get', mockPermissionsGraph);

    const result = await getDataPermissionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockPermissionsGraph);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Permission denied');

    await expect(getDataPermissionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

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
