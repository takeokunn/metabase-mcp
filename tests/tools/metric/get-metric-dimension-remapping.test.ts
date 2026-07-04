import { GetMetricDimensionRemappingParamsSchema } from '@src/schemas/metric';
import { getMetricDimensionRemappingDefinition } from '@src/tools/metric/get-metric-dimension-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetricDimensionRemapping tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { remapped: 'ABC' });
    const result = await getMetricDimensionRemappingDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
      value: 'abc',
    });
    expectMcpContent(result, { remapped: 'ABC' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/metric/1/dimension/category/remapping', {
      value: 'abc',
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getMetricDimensionRemappingDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
        value: 'abc',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getMetricDimensionRemappingDefinition.handler(mockClient, {
        id: 1,
        dimension_key: 'category',
        value: 'abc',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricDimensionRemappingDefinition.name).toBe('get_metric_dimension_remapping');
    expect(getMetricDimensionRemappingDefinition.description).toBe(
      'Fetch the remapping for a dimension value of a metric in Metabase',
    );
    expect(getMetricDimensionRemappingDefinition.inputSchema).toEqual(
      GetMetricDimensionRemappingParamsSchema,
    );
  });
});
