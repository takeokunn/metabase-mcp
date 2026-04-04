import { listUniqueTasksDefinition } from '@src/tools/task/list-unique-tasks';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listUniqueTasks tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = ['send-pulses', 'sync-metabase-analytics'];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listUniqueTasksDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task/unique-tasks');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listUniqueTasksDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listUniqueTasksDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listUniqueTasksDefinition.name).toBe('list_unique_tasks');
  });
});
