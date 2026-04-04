import { GetSearchContextParamsSchema } from '@src/schemas/search';
import { getSearchContextDefinition } from '@src/tools/search/get-search-context';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSearchContext tool', () => {
  it('should return formatted MCP response with search context', async () => {
    const mockContext = {
      available_models: ['card', 'dashboard', 'collection', 'table', 'database'],
      filters: {
        collections: [{ id: 1, name: 'Marketing' }],
        databases: [{ id: 1, name: 'Sample Database' }],
      },
    };

    const mockClient = createMockClientWithResponse('get', mockContext);

    const result = await getSearchContextDefinition.handler(mockClient, {});

    expectMcpContent(result, mockContext);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/context');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty context', async () => {
    const mockContext = { available_models: [], filters: {} };
    const mockClient = createMockClientWithResponse('get', mockContext);

    const result = await getSearchContextDefinition.handler(mockClient, {});

    expectMcpContent(result, mockContext);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(getSearchContextDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getSearchContextDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getSearchContextDefinition.name).toBe('get_search_context');
    expect(getSearchContextDefinition.description).toBe(
      'Get search context and available filter options from Metabase',
    );
    expect(getSearchContextDefinition.inputSchema).toEqual(GetSearchContextParamsSchema);
  });
});
