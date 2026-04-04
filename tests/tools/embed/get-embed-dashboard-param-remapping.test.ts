import { GetEmbedDashboardParamRemappingSchema } from '@src/schemas/embed';
import { getEmbedDashboardParamRemappingDefinition } from '@src/tools/embed/get-embed-dashboard-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboardParamRemapping tool', () => {
  const input = { token: 'test-embed-token-abc123', param_key: 'category' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: [['1', 'One']] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getEmbedDashboardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getEmbedDashboardParamRemappingDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardParamRemappingDefinition.name).toBe(
      'get_embed_dashboard_param_remapping',
    );
    expect(getEmbedDashboardParamRemappingDefinition.description).toBe(
      'Get remapping for a parameter of an embedded dashboard in Metabase',
    );
    expect(getEmbedDashboardParamRemappingDefinition.inputSchema).toEqual(
      GetEmbedDashboardParamRemappingSchema,
    );
  });
});
