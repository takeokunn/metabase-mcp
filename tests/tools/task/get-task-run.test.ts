import { getTaskRunDefinition } from '@src/tools/task/get-task-run';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTaskRun tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, task_name: 'send-pulses', status: 'COMPLETE' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getTaskRunDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task/runs/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getTaskRunDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getTaskRunDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTaskRunDefinition.name).toBe('get_task_run');
  });
});
