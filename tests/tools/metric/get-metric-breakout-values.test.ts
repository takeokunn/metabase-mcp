import { getMetricBreakoutValuesDefinition } from '@src/tools/metric/get-metric-breakout-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetricBreakoutValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { values: ['2024-01', '2024-02', '2024-03'] };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const dimension = { field_id: 10, type: 'temporal' };
    const result = await getMetricBreakoutValuesDefinition.handler(mockClient, { metric_id: 1, dimension });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/metric/breakout-values', {
      metric_id: 1,
      dimension,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      getMetricBreakoutValuesDefinition.handler(mockClient, { metric_id: 1, dimension: {} }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(
      getMetricBreakoutValuesDefinition.handler(mockClient, { metric_id: 999, dimension: {} }),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricBreakoutValuesDefinition.name).toBe('get_metric_breakout_values');
  });
});
