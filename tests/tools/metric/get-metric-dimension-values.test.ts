import { GetMetricDimensionValuesParamsSchema } from '@src/schemas/metric';
import { getMetricDimensionValuesDefinition } from '@src/tools/metric/get-metric-dimension-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetricDimensionValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { values: ['a', 'b'] });
    const result = await getMetricDimensionValuesDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
    });
    expectMcpContent(result, { values: ['a', 'b'] });
    expect(mockClient.get).toHaveBeenCalledWith('/api/metric/1/dimension/category/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getMetricDimensionValuesDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getMetricDimensionValuesDefinition.handler(mockClient, { id: 1, dimension_key: 'category' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricDimensionValuesDefinition.name).toBe('get_metric_dimension_values');
    expect(getMetricDimensionValuesDefinition.description).toBe(
      'Fetch values for a dimension of a metric in Metabase',
    );
    expect(getMetricDimensionValuesDefinition.inputSchema).toEqual(
      GetMetricDimensionValuesParamsSchema,
    );
  });
});
