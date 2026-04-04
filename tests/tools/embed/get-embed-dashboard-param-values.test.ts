import { GetEmbedDashboardParamValuesSchema } from '@src/schemas/embed';
import { getEmbedDashboardParamValuesDefinition } from '@src/tools/embed/get-embed-dashboard-param-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboardParamValues tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'date_filter' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01-01', '2024-02-01'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardParamValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedDashboardParamValuesDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardParamValuesDefinition.name).toBe('get_embed_dashboard_param_values');
    expect(getEmbedDashboardParamValuesDefinition.description).toBe('Get values for a parameter of an embedded dashboard in Metabase');
    expect(getEmbedDashboardParamValuesDefinition.inputSchema).toEqual(GetEmbedDashboardParamValuesSchema);
  });
});
