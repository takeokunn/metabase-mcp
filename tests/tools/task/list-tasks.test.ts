import { listTasksDefinition } from '@src/tools/task/list-tasks';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listTasks tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'send-pulses', description: 'Send pulses' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listTasksDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listTasksDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listTasksDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listTasksDefinition.name).toBe('list_tasks');
  });
});
