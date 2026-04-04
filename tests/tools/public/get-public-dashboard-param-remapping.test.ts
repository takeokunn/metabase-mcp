import { GetPublicDashboardParamRemappingSchema } from '@src/schemas/public';
import { getPublicDashboardParamRemappingDefinition } from '@src/tools/public/get-public-dashboard-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashboardParamRemapping tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', param_key: 'date_filter' };

  it('should return formatted MCP response', async () => {
    const mockResult = { remapping: {} };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDashboardParamRemappingDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/remapping`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDashboardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicDashboardParamRemappingDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDashboardParamRemappingDefinition.name).toBe('get_public_dashboard_param_remapping');
    expect(getPublicDashboardParamRemappingDefinition.description).toBe('Get remapping for a parameter of a public dashboard in Metabase');
    expect(getPublicDashboardParamRemappingDefinition.inputSchema).toEqual(GetPublicDashboardParamRemappingSchema);
  });
});
