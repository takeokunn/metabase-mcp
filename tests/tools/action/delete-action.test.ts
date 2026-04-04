import { DeleteActionParamsSchema } from '@src/schemas/action';
import { deleteActionDefinition } from '@src/tools/action/delete-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteAction tool', () => {
  it('should return formatted MCP response on successful deletion', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteActionDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/action/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Failed to delete action');
    await expect(deleteActionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Failed to delete action',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not found', 404));
    await expect(deleteActionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteActionDefinition.name).toBe('delete_action');
    expect(deleteActionDefinition.inputSchema).toEqual(DeleteActionParamsSchema);
  });
});
