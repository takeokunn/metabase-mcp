import { SearchPublicCardParamValuesSchema } from '@src/schemas/public';
import { searchPublicCardParamValuesDefinition } from '@src/tools/public/search-public-card-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchPublicCardParamValues tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', param_key: 'category', query: 'elec' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['electronics'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchPublicCardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/card/${input.uuid}/params/${input.param_key}/search/${input.query}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchPublicCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(searchPublicCardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchPublicCardParamValuesDefinition.name).toBe('search_public_card_param_values');
    expect(searchPublicCardParamValuesDefinition.description).toBe('Search values for a parameter of a public card in Metabase');
    expect(searchPublicCardParamValuesDefinition.inputSchema).toEqual(SearchPublicCardParamValuesSchema);
  });
});
