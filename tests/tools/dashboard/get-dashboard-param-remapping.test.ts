import { GetDashboardParamRemappingInputSchema } from '@src/schemas/dashboard';
import { getDashboardParamRemappingDefinition } from '@src/tools/dashboard/get-dashboard-param-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardParamRemapping tool', () => {
  it('should return formatted MCP response with remapping data', async () => {
    const mockClient = createMockClientWithResponse('get', { remapping: {} });
    const result = await getDashboardParamRemappingDefinition.handler(mockClient, { id: 1, param_key: 'category' });
    expectMcpContent(result, { remapping: {} });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/params/category/remapping');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getDashboardParamRemappingDefinition.handler(mockClient, { id: 999, param_key: 'key' })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getDashboardParamRemappingDefinition.handler(mockClient, { id: 1, param_key: 'key' })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getDashboardParamRemappingDefinition.name).toBe('get_dashboard_param_remapping');
    expect(getDashboardParamRemappingDefinition.description).toBe('Get remapping for a parameter of a dashboard in Metabase');
    expect(getDashboardParamRemappingDefinition.inputSchema).toEqual(GetDashboardParamRemappingInputSchema);
  });
});
