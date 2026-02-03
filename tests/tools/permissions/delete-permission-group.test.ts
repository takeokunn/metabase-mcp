import { DeletePermissionGroupInputSchema } from '@src/schemas/permissions';
import { deletePermissionGroupDefinition } from '@src/tools/permissions/delete-permission-group';
import { describe, expect, it } from 'vitest';
import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';
import { createApiError } from '../../__factories__';

describe('deletePermissionGroup tool', () => {
  it('should delete a permission group and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 3 };

    const result = await deletePermissionGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/3');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should handle different group IDs', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 42 };

    const result = await deletePermissionGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Group not found');

    const input = { id: 999 };

    await expect(deletePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/group/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Cannot delete built-in group', 400),
    );

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
