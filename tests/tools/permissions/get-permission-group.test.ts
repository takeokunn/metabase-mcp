import type { MetabaseClient } from '@src/client';
import { GetPermissionGroupInputSchema } from '@src/schemas/permissions';
import { getPermissionGroupDefinition } from '@src/tools/permissions/get-permission-group';
import { describe, expect, it, vi } from 'vitest';

describe('getPermissionGroup tool', () => {
  it('should return formatted MCP response with permission group data', async () => {
    const mockGroup = {
      id: 1,
      name: 'Administrators',
      members: [{ id: 1, email: 'admin@example.com', first_name: 'Admin', last_name: 'User' }],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockGroup),
    } as unknown as MetabaseClient;

    const result = await getPermissionGroupDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle group with no members', async () => {
    const mockGroup = {
      id: 3,
      name: 'Empty Group',
      members: [],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockGroup),
    } as unknown as MetabaseClient;

    const result = await getPermissionGroupDefinition.handler(mockClient, { id: 3 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/3');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Group not found')),
    } as unknown as MetabaseClient;

    await expect(getPermissionGroupDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Group not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getPermissionGroupDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPermissionGroupDefinition.name).toBe('get_permission_group');
    expect(getPermissionGroupDefinition.description).toBe(
      'Get a single permission group by ID from Metabase',
    );
    expect(getPermissionGroupDefinition.inputSchema).toEqual(GetPermissionGroupInputSchema);
  });
});
