import { executeMetricDefinition } from '@src/tools/metric/execute-metric';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('executeMetric tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[100]], cols: [{ name: 'count' }] } };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const query = { 'source-table': 1, aggregation: [['count']] };
    const result = await executeMetricDefinition.handler(mockClient, { query });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/metric/dataset', { query });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(executeMetricDefinition.handler(mockClient, { query: {} })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(executeMetricDefinition.handler(mockClient, { query: {} })).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(executeMetricDefinition.name).toBe('execute_metric');
  });
});
