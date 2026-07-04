import { SearchMeasureDimensionValuesParamsSchema } from '@src/schemas/measure';
import { searchMeasureDimensionValuesDefinition } from '@src/tools/measure/search-measure-dimension-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchMeasureDimensionValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Measure 1' });
    const result = await searchMeasureDimensionValuesDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
      query: 'foo',
    });
    expectMcpContent(result, { id: 1, name: 'Measure 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/measure/1/dimension/category/search', {
      query: 'foo',
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      searchMeasureDimensionValuesDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
        query: 'foo',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      searchMeasureDimensionValuesDefinition.handler(mockClient, {
        id: 1,
        dimension_key: 'category',
        query: 'foo',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchMeasureDimensionValuesDefinition.name).toBe('search_measure_dimension_values');
    expect(searchMeasureDimensionValuesDefinition.description).toBe(
      'Search values for a dimension of a measure in Metabase',
    );
    expect(searchMeasureDimensionValuesDefinition.inputSchema).toEqual(
      SearchMeasureDimensionValuesParamsSchema,
    );
  });
});
