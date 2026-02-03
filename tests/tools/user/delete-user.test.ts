import { DeleteUserInputSchema } from '@src/schemas/user';
import { deleteUserDefinition } from '@src/tools/user/delete-user';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('deleteUser tool', () => {
  it('should return formatted MCP response after deleting user', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteUserDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete user with different ID', async () => {
    const mockClient = createMockClientWithResponse('delete', { success: true });

    await deleteUserDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'User not found');

    await expect(deleteUserDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/999');
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Cannot delete admin user', 403);

    await expect(deleteUserDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Cannot delete admin user',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Unauthorized', 401);

    await expect(deleteUserDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteUserDefinition.name).toBe('delete_user');
    expect(deleteUserDefinition.description).toBe('Delete (deactivate) a user from Metabase');
    expect(deleteUserDefinition.inputSchema).toEqual(DeleteUserInputSchema);
  });
});
