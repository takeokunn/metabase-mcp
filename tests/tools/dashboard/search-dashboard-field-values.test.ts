import { SearchDashboardFieldValuesParamsSchema } from '@src/schemas/dashboard';
import { searchDashboardFieldValuesDefinition } from '@src/tools/dashboard/search-dashboard-field-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchDashboardFieldValues tool', () => {
  const baseInput = { id: 1, field_id: 42, search_value: 'Elec' };

  it('should return formatted MCP response with matching field values', async () => {
    const mockResult = { values: [['Electronics']] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await searchDashboardFieldValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/field/42/search/Elec');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode search_value in the URL', async () => {
    const mockResult = { values: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    await searchDashboardFieldValuesDefinition.handler(mockClient, {
      id: 1,
      field_id: 42,
      search_value: 'hello world',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/field/42/search/hello%20world');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');
    await expect(
      searchDashboardFieldValuesDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Field not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      searchDashboardFieldValuesDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchDashboardFieldValuesDefinition.name).toBe('search_dashboard_field_values');
    expect(searchDashboardFieldValuesDefinition.inputSchema).toEqual(
      SearchDashboardFieldValuesParamsSchema,
    );
  });
});
