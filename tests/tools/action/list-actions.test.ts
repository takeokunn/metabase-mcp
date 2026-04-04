import { ListActionsParamsSchema } from '@src/schemas/action';
import { listActionsDefinition } from '@src/tools/action/list-actions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listActions tool', () => {
  it('should return formatted MCP response with actions', async () => {
    const mockActions = [
      { id: 1, name: 'Create Row', type: 'implicit', model_id: 5 },
      { id: 2, name: 'Update Row', type: 'implicit', model_id: 5 },
    ];

    const mockClient = createMockClientWithResponse('get', mockActions);

    const result = await listActionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockActions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/action', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by model_id when provided', async () => {
    const mockActions = [{ id: 3, name: 'Delete Row', type: 'implicit', model_id: 10 }];

    const mockClient = createMockClientWithResponse('get', mockActions);

    const result = await listActionsDefinition.handler(mockClient, { model_id: 10 });

    expectMcpContent(result, mockActions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/action', { 'model-id': 10 });
  });

  it('should handle empty action list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listActionsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listActionsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listActionsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listActionsDefinition.name).toBe('list_actions');
    expect(listActionsDefinition.inputSchema).toEqual(ListActionsParamsSchema);
  });
});
