import { SearchCardParamValuesParamsSchema } from '@src/schemas/card';
import { searchCardParamValuesDefinition } from '@src/tools/card/search-card-param-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchCardParamValues tool', () => {
  const baseInput = { id: 1, param_key: 'category', query: 'Elec' };

  it('should return formatted MCP response with matching values', async () => {
    const mockResult = { values: ['Electronics'] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await searchCardParamValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/params/category/search/Elec');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode param_key and query in the URL', async () => {
    const mockClient = createMockClientWithResponse('get', { values: [] });

    await searchCardParamValuesDefinition.handler(mockClient, {
      id: 2,
      param_key: 'my key',
      query: 'search term',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/card/2/params/my%20key/search/search%20term');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Card not found');
    await expect(searchCardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Card not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(searchCardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchCardParamValuesDefinition.name).toBe('search_card_param_values');
    expect(searchCardParamValuesDefinition.inputSchema).toEqual(SearchCardParamValuesParamsSchema);
  });
});
