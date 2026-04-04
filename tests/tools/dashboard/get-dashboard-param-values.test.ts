import { GetDashboardParamValuesParamsSchema } from '@src/schemas/dashboard';
import { getDashboardParamValuesDefinition } from '@src/tools/dashboard/get-dashboard-param-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardParamValues tool', () => {
  const baseInput = { id: 1, param_key: 'category' };

  it('should return formatted MCP response with parameter values', async () => {
    const mockResult = { values: ['Electronics', 'Clothing', 'Books'] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getDashboardParamValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/params/category/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode param_key in the URL', async () => {
    const mockResult = { values: ['A', 'B'] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    await getDashboardParamValuesDefinition.handler(mockClient, {
      id: 2,
      param_key: 'my param/key',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/2/params/my%20param%2Fkey/values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Dashboard not found');
    await expect(getDashboardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getDashboardParamValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDashboardParamValuesDefinition.name).toBe('get_dashboard_param_values');
    expect(getDashboardParamValuesDefinition.inputSchema).toEqual(
      GetDashboardParamValuesParamsSchema,
    );
  });
});
