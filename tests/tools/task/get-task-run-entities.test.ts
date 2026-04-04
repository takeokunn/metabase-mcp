import { GetTaskRunEntitiesInputSchema } from '@src/schemas/task';
import { getTaskRunEntitiesDefinition } from '@src/tools/task/get-task-run-entities';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTaskRunEntities tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', ['card', 'dashboard']);
    const result = await getTaskRunEntitiesDefinition.handler(mockClient, {});
    expectMcpContent(result, ['card', 'dashboard']);
    expect(mockClient.get).toHaveBeenCalledWith('/api/task/runs/entities');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getTaskRunEntitiesDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getTaskRunEntitiesDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTaskRunEntitiesDefinition.name).toBe('get_task_run_entities');
    expect(getTaskRunEntitiesDefinition.description).toBe('Get entity types tracked by task runs in Metabase');
    expect(getTaskRunEntitiesDefinition.inputSchema).toEqual(GetTaskRunEntitiesInputSchema);
  });
});
