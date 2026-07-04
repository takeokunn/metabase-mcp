import { GetMetricBreakoutValuesInputSchema } from '@src/schemas/metric';
import { getMetricBreakoutValuesDefinition } from '@src/tools/metric/get-metric-breakout-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetricBreakoutValues tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { values: ['x', 'y'] });
    const result = await getMetricBreakoutValuesDefinition.handler(mockClient, {
      definition: { foo: 'bar' },
    });
    expectMcpContent(result, { values: ['x', 'y'] });
    expect(mockClient.post).toHaveBeenCalledWith('/api/metric/breakout-values', {
      definition: { foo: 'bar' },
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getMetricBreakoutValuesDefinition.handler(mockClient, { definition: { foo: 'bar' } }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getMetricBreakoutValuesDefinition.handler(mockClient, { definition: { foo: 'bar' } }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricBreakoutValuesDefinition.name).toBe('get_metric_breakout_values');
    expect(getMetricBreakoutValuesDefinition.description).toBe(
      'Compute breakout values for a metric definition in Metabase',
    );
    expect(getMetricBreakoutValuesDefinition.inputSchema).toEqual(
      GetMetricBreakoutValuesInputSchema,
    );
  });
});
