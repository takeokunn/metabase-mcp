import { SearchMetricDimensionValuesParamsSchema } from '@src/schemas/metric';
import { searchMetricDimensionValuesDefinition } from '@src/tools/metric/search-metric-dimension-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchMetricDimensionValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { values: ['foo'] });
    const result = await searchMetricDimensionValuesDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
      query: 'foo',
    });
    expectMcpContent(result, { values: ['foo'] });
    expect(mockClient.get).toHaveBeenCalledWith('/api/metric/1/dimension/category/search', {
      query: 'foo',
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      searchMetricDimensionValuesDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
        query: 'foo',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      searchMetricDimensionValuesDefinition.handler(mockClient, {
        id: 1,
        dimension_key: 'category',
        query: 'foo',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchMetricDimensionValuesDefinition.name).toBe('search_metric_dimension_values');
    expect(searchMetricDimensionValuesDefinition.description).toBe(
      'Search values for a dimension of a metric in Metabase',
    );
    expect(searchMetricDimensionValuesDefinition.inputSchema).toEqual(
      SearchMetricDimensionValuesParamsSchema,
    );
  });
});
