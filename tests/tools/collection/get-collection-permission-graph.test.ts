import { GetCollectionPermissionGraphParamsSchema } from '@src/schemas/collection';
import { getCollectionPermissionGraphDefinition } from '@src/tools/collection/get-collection-permission-graph';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCollectionPermissionGraph tool', () => {
  it('should return formatted MCP response with permission graph', async () => {
    const mockGraph = {
      revision: 1,
      groups: {
        '1': { '3': 'write', '4': 'read' },
        '2': { '3': 'none', '4': 'write' },
      },
    };

    const mockClient = createMockClientWithResponse('get', mockGraph);

    const result = await getCollectionPermissionGraphDefinition.handler(mockClient, { id: 3 });

    expectMcpContent(result, mockGraph);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/3/permission-graph');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should get permission graph for different collection ID', async () => {
    const mockGraph = { revision: 2, groups: {} };
    const mockClient = createMockClientWithResponse('get', mockGraph);

    await getCollectionPermissionGraphDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/10/permission-graph');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Collection not found');

    await expect(
      getCollectionPermissionGraphDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Collection not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(
      getCollectionPermissionGraphDefinition.handler(mockClient, { id: 1 }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionPermissionGraphDefinition.name).toBe('get_collection_permission_graph');
    expect(getCollectionPermissionGraphDefinition.description).toBe(
      'Get the permission graph for a collection in Metabase',
    );
    expect(getCollectionPermissionGraphDefinition.inputSchema).toEqual(
      GetCollectionPermissionGraphParamsSchema,
    );
  });
});
