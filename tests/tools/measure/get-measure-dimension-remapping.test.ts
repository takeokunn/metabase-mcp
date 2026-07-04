import { GetMeasureDimensionRemappingParamsSchema } from '@src/schemas/measure';
import { getMeasureDimensionRemappingDefinition } from '@src/tools/measure/get-measure-dimension-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMeasureDimensionRemapping tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Measure 1' });
    const result = await getMeasureDimensionRemappingDefinition.handler(mockClient, {
      id: 1,
      dimension_key: 'category',
      value: 'abc',
    });
    expectMcpContent(result, { id: 1, name: 'Measure 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/measure/1/dimension/category/remapping', {
      value: 'abc',
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getMeasureDimensionRemappingDefinition.handler(mockClient, {
        id: 999,
        dimension_key: 'category',
        value: 'abc',
      }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getMeasureDimensionRemappingDefinition.handler(mockClient, {
        id: 1,
        dimension_key: 'category',
        value: 'abc',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMeasureDimensionRemappingDefinition.name).toBe('get_measure_dimension_remapping');
    expect(getMeasureDimensionRemappingDefinition.description).toBe(
      'Fetch the remapping for a dimension value of a measure in Metabase',
    );
    expect(getMeasureDimensionRemappingDefinition.inputSchema).toEqual(
      GetMeasureDimensionRemappingParamsSchema,
    );
  });
});
