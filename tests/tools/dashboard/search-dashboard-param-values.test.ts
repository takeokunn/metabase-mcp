import { SearchDashboardParamValuesParamsSchema } from '@src/schemas/dashboard';
import { searchDashboardParamValuesDefinition } from '@src/tools/dashboard/search-dashboard-param-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchDashboardParamValues tool', () => {
  const baseInput = { id: 1, param_key: 'category', query: 'Elec' };

  it('should return formatted MCP response with matching values', async () => {
    const mockResult = { values: ['Electronics'] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await searchDashboardParamValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/params/category/search/Elec');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode param_key and query in the URL', async () => {
    const mockResult = { values: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    await searchDashboardParamValuesDefinition.handler(mockClient, {
      id: 2,
      param_key: 'my key',
      query: 'search term',
    });

    expect(mockClient.get).toHaveBeenCalledWith(
      '/api/dashboard/2/params/my%20key/search/search%20term',
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Dashboard not found');
    await expect(
      searchDashboardParamValuesDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Dashboard not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      searchDashboardParamValuesDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchDashboardParamValuesDefinition.name).toBe('search_dashboard_param_values');
    expect(searchDashboardParamValuesDefinition.inputSchema).toEqual(
      SearchDashboardParamValuesParamsSchema,
    );
  });
});
