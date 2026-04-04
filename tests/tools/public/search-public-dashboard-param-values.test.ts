import { SearchPublicDashboardParamValuesSchema } from '@src/schemas/public';
import { searchPublicDashboardParamValuesDefinition } from '@src/tools/public/search-public-dashboard-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchPublicDashboardParamValues tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    param_key: 'date_filter',
    query: '2024',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01-01'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchPublicDashboardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/search/${input.query}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      searchPublicDashboardParamValuesDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      searchPublicDashboardParamValuesDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchPublicDashboardParamValuesDefinition.name).toBe(
      'search_public_dashboard_param_values',
    );
    expect(searchPublicDashboardParamValuesDefinition.description).toBe(
      'Search values for a parameter of a public dashboard in Metabase',
    );
    expect(searchPublicDashboardParamValuesDefinition.inputSchema).toEqual(
      SearchPublicDashboardParamValuesSchema,
    );
  });
});
