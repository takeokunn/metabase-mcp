import { SearchPublicDashboardParamsSchema } from '@src/schemas/public';
import { searchPublicDashboardParamsDefinition } from '@src/tools/public/search-public-dashboard-params';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchPublicDashboardParams tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    param_key: 'category',
    search_string: 'Gizmo',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['Gizmo'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchPublicDashboardParamsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/search/${input.search_string}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchPublicDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(searchPublicDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchPublicDashboardParamsDefinition.name).toBe('search_public_dashboard_params');
    expect(searchPublicDashboardParamsDefinition.inputSchema).toEqual(
      SearchPublicDashboardParamsSchema,
    );
  });
});
