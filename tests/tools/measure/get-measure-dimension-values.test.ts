import { GetMeasureDimensionValuesParamsSchema } from '@src/schemas/measure';
import { getMeasureDimensionValuesDefinition } from '@src/tools/measure/get-measure-dimension-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMeasureDimensionValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Measure 1' });
    const result = await getMeasureDimensionValuesDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
    });
    expectMcpContent(result, { id: 1, name: 'Measure 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/measure/1/dimension/category/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getMeasureDimensionValuesDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getMeasureDimensionValuesDefinition.handler(mockClient, { id: 1, dimension_key: 'category' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMeasureDimensionValuesDefinition.name).toBe('get_measure_dimension_values');
    expect(getMeasureDimensionValuesDefinition.description).toBe(
      'Fetch values for a dimension of a measure in Metabase',
    );
    expect(getMeasureDimensionValuesDefinition.inputSchema).toEqual(
      GetMeasureDimensionValuesParamsSchema,
    );
  });
});
