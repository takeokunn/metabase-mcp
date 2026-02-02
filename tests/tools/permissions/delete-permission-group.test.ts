import type { MetabaseClient } from '@src/client';
import { DeletePermissionGroupInputSchema } from '@src/schemas/permissions';
import { deletePermissionGroupDefinition } from '@src/tools/permissions/delete-permission-group';
import { describe, expect, it, vi } from 'vitest';

describe('deletePermissionGroup tool', () => {
  it('should delete a permission group and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 3 };

    const result = await deletePermissionGroupDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/3');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should handle different group IDs', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 42 };

    const result = await deletePermissionGroupDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValue(new Error('Group not found')),
    } as unknown as MetabaseClient;

    const input = { id: 999 };

    await expect(deletePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Cannot delete built-in group');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      delete: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = { id: 1 };

    await expect(deletePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Cannot delete built-in group',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deletePermissionGroupDefinition.name).toBe('delete_permission_group');
    expect(deletePermissionGroupDefinition.description).toBe(
      'Delete a permission group from Metabase',
    );
    expect(deletePermissionGroupDefinition.inputSchema).toEqual(DeletePermissionGroupInputSchema);
  });
});
