import { GetPublicDashboardParamsValuesSchema } from '@src/schemas/public';
import { getPublicDashboardParamsDefinition } from '@src/tools/public/get-public-dashboard-params';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashboardParams tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', param_key: 'date_filter' };

  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01-01', '2024-02-01'] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDashboardParamsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/params/${input.param_key}/values`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicDashboardParamsDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDashboardParamsDefinition.name).toBe('get_public_dashboard_params');
    expect(getPublicDashboardParamsDefinition.inputSchema).toEqual(GetPublicDashboardParamsValuesSchema);
  });
});
