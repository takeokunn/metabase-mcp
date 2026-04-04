import { getTaskInfoDefinition } from '@src/tools/task/get-task-info';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTaskInfo tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { scheduler: 'quartz', jobs: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getTaskInfoDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task/info');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getTaskInfoDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getTaskInfoDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTaskInfoDefinition.name).toBe('get_task_info');
  });
});
