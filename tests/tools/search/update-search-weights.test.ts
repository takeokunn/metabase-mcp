import { UpdateSearchWeightsInputSchema } from '@src/schemas/search';
import { updateSearchWeightsDefinition } from '@src/tools/search/update-search-weights';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateSearchWeights tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { card: 2.0, dashboard: 1.5 };
    const mockClient = createMockClientWithResponse('put', mockResponse);
    const input = { weights: { card: 2.0, dashboard: 1.5 } };
    const result = await updateSearchWeightsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/search/weights', { card: 2.0, dashboard: 1.5 });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Not found');
    await expect(updateSearchWeightsDefinition.handler(mockClient, { weights: {} })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(updateSearchWeightsDefinition.handler(mockClient, { weights: {} })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateSearchWeightsDefinition.name).toBe('update_search_weights');
    expect(updateSearchWeightsDefinition.description).toBe('Update search result ranking weights in Metabase');
    expect(updateSearchWeightsDefinition.inputSchema).toEqual(UpdateSearchWeightsInputSchema);
  });
});
