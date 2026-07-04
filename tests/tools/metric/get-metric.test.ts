import { GetMetricParamsSchema } from '@src/schemas/metric';
import { getMetricDefinition } from '@src/tools/metric/get-metric';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetric tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Metric 1' });
    const result = await getMetricDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 1, name: 'Metric 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/metric/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getMetricDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getMetricDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricDefinition.name).toBe('get_metric');
    expect(getMetricDefinition.description).toBe('Get a specific metric by ID in Metabase');
    expect(getMetricDefinition.inputSchema).toEqual(GetMetricParamsSchema);
  });
});
