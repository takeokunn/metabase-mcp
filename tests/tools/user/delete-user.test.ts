import type { MetabaseClient } from '@src/client';
import { DeleteUserInputSchema } from '@src/schemas/user';
import { deleteUserDefinition } from '@src/tools/user/delete-user';
import { describe, expect, it, vi } from 'vitest';

describe('deleteUser tool', () => {
  it('should return formatted MCP response after deleting user', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await deleteUserDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete user with different ID', async () => {
    const mockClient = {
      delete: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as MetabaseClient;

    await deleteUserDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValue(new Error('User not found')),
    } as unknown as MetabaseClient;

    await expect(deleteUserDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/user/999');
  });

  it('should propagate permission errors', async () => {
    const apiError = new Error('Cannot delete admin user');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(deleteUserDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Cannot delete admin user',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
