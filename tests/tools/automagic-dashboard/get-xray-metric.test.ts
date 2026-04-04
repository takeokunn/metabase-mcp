import { GetXrayMetricParamsSchema } from '@src/schemas/automagic-dashboard';
import { getXrayMetricDefinition } from '@src/tools/automagic-dashboard/get-xray-metric';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getXrayMetric tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 'automagic-dashboards/metric/1', name: 'Metric X-ray' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getXrayMetricDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/automagic-dashboards/metric/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getXrayMetricDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getXrayMetricDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(getXrayMetricDefinition.name).toBe('get_xray_metric');
    expect(getXrayMetricDefinition.inputSchema).toEqual(GetXrayMetricParamsSchema);
  });
});
