import { GetSearchWeightsParamsSchema } from '@src/schemas/search';
import { getSearchWeightsDefinition } from '@src/tools/search/get-search-weights';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSearchWeights tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { card: 1.5, dashboard: 1.2, collection: 1.0 };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getSearchWeightsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/weights');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getSearchWeightsDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getSearchWeightsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getSearchWeightsDefinition.name).toBe('get_search_weights');
    expect(getSearchWeightsDefinition.description).toBe('Get search result ranking weights in Metabase');
    expect(getSearchWeightsDefinition.inputSchema).toEqual(GetSearchWeightsParamsSchema);
  });
});
