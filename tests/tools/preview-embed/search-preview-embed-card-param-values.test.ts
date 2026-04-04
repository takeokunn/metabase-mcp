import { SearchPreviewEmbedCardParamValuesSchema } from '@src/schemas/preview-embed';
import { searchPreviewEmbedCardParamValuesDefinition } from '@src/tools/preview-embed/search-preview-embed-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchPreviewEmbedCardParamValues tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', param_key: 'category', query: 'elec' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchPreviewEmbedCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/card/${input.token}/params/${input.param_key}/search/${input.query}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchPreviewEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(searchPreviewEmbedCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchPreviewEmbedCardParamValuesDefinition.name).toBe('search_preview_embed_card_param_values');
    expect(searchPreviewEmbedCardParamValuesDefinition.description).toBe('Search values for a parameter of a preview embedded card in Metabase');
    expect(searchPreviewEmbedCardParamValuesDefinition.inputSchema).toEqual(SearchPreviewEmbedCardParamValuesSchema);
  });
});
