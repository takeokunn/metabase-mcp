import type { MetabaseClient } from '@src/client';
import { UpdatePermissionGroupInputSchema } from '@src/schemas/permissions';
import { updatePermissionGroupDefinition } from '@src/tools/permissions/update-permission-group';
import { describe, expect, it, vi } from 'vitest';

describe('updatePermissionGroup tool', () => {
  it('should update a permission group and return formatted MCP response', async () => {
    const mockResponse = {
      id: 4,
      name: 'Updated Data Analysts',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 4, name: 'Updated Data Analysts' };

    const result = await updatePermissionGroupDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/group/4', {
      name: 'Updated Data Analysts',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle group with special characters in name', async () => {
    const mockResponse = {
      id: 5,
      name: 'Sales & Marketing Team - Updated',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 5, name: 'Sales & Marketing Team - Updated' };

    const result = await updatePermissionGroupDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/group/5', {
      name: 'Sales & Marketing Team - Updated',
    });
  });

  it('should correctly separate id from update data', async () => {
    const mockResponse = {
      id: 10,
      name: 'New Name',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 10, name: 'New Name' };

    await updatePermissionGroupDefinition.handler(mockClient, input);

    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/group/10', {
      name: 'New Name',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Group not found')),
    } as unknown as MetabaseClient;

    const input = { id: 999, name: 'Updated Name' };

    await expect(updatePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group not found',
    );
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/group/999', {
      name: 'Updated Name',
    });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = { id: 1, name: 'New Name' };

    await expect(updatePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should handle name already exists error', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Group name already exists')),
    } as unknown as MetabaseClient;

    const input = { id: 4, name: 'Existing Group Name' };

    await expect(updatePermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group name already exists',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updatePermissionGroupDefinition.name).toBe('update_permission_group');
    expect(updatePermissionGroupDefinition.description).toBe(
      'Update an existing permission group in Metabase',
    );
    expect(updatePermissionGroupDefinition.inputSchema).toEqual(UpdatePermissionGroupInputSchema);
  });
});
