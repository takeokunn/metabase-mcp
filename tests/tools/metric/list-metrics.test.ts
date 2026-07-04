import { ListMetricsInputSchema } from '@src/schemas/metric';
import { listMetricsDefinition } from '@src/tools/metric/list-metrics';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listMetrics tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', [{ id: 1, name: 'Metric 1' }]);
    const result = await listMetricsDefinition.handler(mockClient, {});
    expectMcpContent(result, [{ id: 1, name: 'Metric 1' }]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/metric');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(listMetricsDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listMetricsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listMetricsDefinition.name).toBe('list_metrics');
    expect(listMetricsDefinition.description).toBe(
      'List metrics readable by the current user in Metabase',
    );
    expect(listMetricsDefinition.inputSchema).toEqual(ListMetricsInputSchema);
  });
});
