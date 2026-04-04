import { SearchEmbedCardParamValuesSchema } from '@src/schemas/embed';
import { searchEmbedCardParamValuesDefinition } from '@src/tools/embed/search-embed-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchEmbedCardParamValues tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'category', query: 'elec' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchEmbedCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/card/${input.token}/params/${input.param_key}/search/${input.query}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(searchEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchEmbedCardParamValuesDefinition.name).toBe('search_embed_card_param_values');
    expect(searchEmbedCardParamValuesDefinition.description).toBe('Search values for a parameter of an embedded card in Metabase');
    expect(searchEmbedCardParamValuesDefinition.inputSchema).toEqual(SearchEmbedCardParamValuesSchema);
  });
});
