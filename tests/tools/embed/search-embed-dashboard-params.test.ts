import { SearchEmbedDashboardParamsSchema } from '@src/schemas/embed';
import { searchEmbedDashboardParamsDefinition } from '@src/tools/embed/search-embed-dashboard-params';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchEmbedDashboardParams tool', () => {
  const input = {
    token: 'test-embed-token-abc123',
    param_key: 'category',
    search_string: 'Gizmo',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['Gizmo'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await searchEmbedDashboardParamsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/search/${input.search_string}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(searchEmbedDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(searchEmbedDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchEmbedDashboardParamsDefinition.name).toBe('search_embed_dashboard_params');
    expect(searchEmbedDashboardParamsDefinition.inputSchema).toEqual(SearchEmbedDashboardParamsSchema);
  });
});
