import { ListSearchIndexedEntitiesParamsSchema } from '@src/schemas/search';
import { listSearchIndexedEntitiesDefinition } from '@src/tools/search/list-search-indexed-entities';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listSearchIndexedEntities tool', () => {
  it('should return formatted MCP response with indexed entities', async () => {
    const mockEntities = [
      { id: 1, name: 'Customer', model: 'table', index_status: 'indexed' },
      { id: 2, name: 'Order', model: 'table', index_status: 'indexed' },
    ];

    const mockClient = createMockClientWithResponse('get', mockEntities);

    const result = await listSearchIndexedEntitiesDefinition.handler(mockClient, {});

    expectMcpContent(result, mockEntities);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/indexed-entities');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty indexed entities list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listSearchIndexedEntitiesDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listSearchIndexedEntitiesDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listSearchIndexedEntitiesDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listSearchIndexedEntitiesDefinition.name).toBe('list_search_indexed_entities');
    expect(listSearchIndexedEntitiesDefinition.description).toBe(
      'List entities currently in the Metabase search index',
    );
    expect(listSearchIndexedEntitiesDefinition.inputSchema).toEqual(
      ListSearchIndexedEntitiesParamsSchema,
    );
  });
});
