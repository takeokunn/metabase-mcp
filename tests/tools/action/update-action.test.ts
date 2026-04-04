import { UpdateActionInputSchema } from '@src/schemas/action';
import { updateActionDefinition } from '@src/tools/action/update-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateAction tool', () => {
  it('should return formatted MCP response with updated action', async () => {
    const mockUpdatedAction = { id: 1, name: 'Updated Action', type: 'implicit', model_id: 5 };
    const mockClient = createMockClientWithResponse('put', mockUpdatedAction);

    const result = await updateActionDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Action',
    });

    expectMcpContent(result, mockUpdatedAction);
    expect(mockClient.put).toHaveBeenCalledWith('/api/action/1', { name: 'Updated Action' });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should support archiving an action', async () => {
    const mockUpdatedAction = { id: 2, name: 'Old Action', archived: true, model_id: 5 };
    const mockClient = createMockClientWithResponse('put', mockUpdatedAction);

    const result = await updateActionDefinition.handler(mockClient, { id: 2, archived: true });

    expectMcpContent(result, mockUpdatedAction);
    expect(mockClient.put).toHaveBeenCalledWith('/api/action/2', { archived: true });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Failed to update action');
    await expect(
      updateActionDefinition.handler(mockClient, { id: 1, name: 'Test' }),
    ).rejects.toThrow('Failed to update action');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not found', 404));
    await expect(
      updateActionDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateActionDefinition.name).toBe('update_action');
    expect(updateActionDefinition.inputSchema).toEqual(UpdateActionInputSchema);
  });
});
