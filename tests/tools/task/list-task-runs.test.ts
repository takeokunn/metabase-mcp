import { listTaskRunsDefinition } from '@src/tools/task/list-task-runs';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listTaskRuns tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, task_name: 'send-pulses', started_at: '2024-01-01T00:00:00Z' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listTaskRunsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task/runs');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listTaskRunsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listTaskRunsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listTaskRunsDefinition.name).toBe('list_task_runs');
  });
});
