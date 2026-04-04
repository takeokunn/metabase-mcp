import { SearchEmbedDashboardParamValuesSchema } from '@src/schemas/embed';
import { searchEmbedDashboardParamValuesDefinition } from '@src/tools/embed/search-embed-dashboard-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchEmbedDashboardParamValues tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'date_filter', query: '2024' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01-01'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchEmbedDashboardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/search/${input.query}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(searchEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchEmbedDashboardParamValuesDefinition.name).toBe('search_embed_dashboard_param_values');
    expect(searchEmbedDashboardParamValuesDefinition.description).toBe('Search values for a parameter of an embedded dashboard in Metabase');
    expect(searchEmbedDashboardParamValuesDefinition.inputSchema).toEqual(SearchEmbedDashboardParamValuesSchema);
  });
});
