import { GetMetricDatasetInputSchema } from '@src/schemas/metric';
import { getMetricDatasetDefinition } from '@src/tools/metric/get-metric-dataset';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetricDataset tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { rows: [[1, 2]] });
    const result = await getMetricDatasetDefinition.handler(mockClient, {
      definition: { foo: 'bar' },
    });
    expectMcpContent(result, { rows: [[1, 2]] });
    expect(mockClient.post).toHaveBeenCalledWith('/api/metric/dataset', {
      definition: { foo: 'bar' },
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      getMetricDatasetDefinition.handler(mockClient, { definition: { foo: 'bar' } }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      getMetricDatasetDefinition.handler(mockClient, { definition: { foo: 'bar' } }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMetricDatasetDefinition.name).toBe('get_metric_dataset');
    expect(getMetricDatasetDefinition.description).toBe(
      'Run a metric definition as a dataset query in Metabase',
    );
    expect(getMetricDatasetDefinition.inputSchema).toEqual(GetMetricDatasetInputSchema);
  });
});
