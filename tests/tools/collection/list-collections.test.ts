import { ListCollectionsParamsSchema } from '@src/schemas/collection';
import { listCollectionsDefinition } from '@src/tools/collection/list-collections';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listCollections tool', () => {
  it('should return formatted MCP response with collections', async () => {
    const mockCollections = [
      { id: 1, name: 'Marketing', description: 'Marketing team dashboards', location: '/' },
      { id: 2, name: 'Sales', description: 'Sales analytics', location: '/' },
      { id: 3, name: 'Engineering', description: null, location: '/1/' },
    ];

    const mockClient = createMockClientWithResponse('get', mockCollections);

    const result = await listCollectionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCollections);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection', { namespace: undefined });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty collections list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listCollectionsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should pass namespace parameter when provided', async () => {
    const mockCollections = [{ id: 10, name: 'Snippets Collection', location: '/' }];

    const mockClient = createMockClientWithResponse('get', mockCollections);

    const result = await listCollectionsDefinition.handler(mockClient, { namespace: 'snippets' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/collection', { namespace: 'snippets' });
    expectMcpContent(result, mockCollections);
  });

  it('should handle personal collections', async () => {
    const mockCollections = [
      { id: 1, name: 'Shared', location: '/' },
      { id: 100, name: "John's Personal Collection", personal_owner_id: 5, location: '/' },
    ];

    const mockClient = createMockClientWithResponse('get', mockCollections);

    const result = await listCollectionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCollections);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listCollectionsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate authentication errors', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listCollectionsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCollectionsDefinition.name).toBe('list_collections');
    expect(listCollectionsDefinition.description).toBe(
      'Get list of all collections (folders) in Metabase',
    );
    expect(listCollectionsDefinition.inputSchema).toEqual(ListCollectionsParamsSchema);
  });
});
