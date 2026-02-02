import type { MetabaseClient } from '@src/client';
import { listPermissionGroupsDefinition } from '@src/tools/permissions/list-permission-groups';
import { describe, expect, it, vi } from 'vitest';

describe('listPermissionGroups tool', () => {
  it('should return formatted MCP response with permission groups', async () => {
    const mockGroups = [
      { id: 1, name: 'All Users' },
      { id: 2, name: 'Administrators' },
      { id: 3, name: 'Analysts' },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockGroups),
    } as unknown as MetabaseClient;

    const result = await listPermissionGroupsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockGroups);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty groups list', async () => {
    const mockGroups: unknown[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockGroups),
    } as unknown as MetabaseClient;

    const result = await listPermissionGroupsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as unknown as MetabaseClient;

    await expect(listPermissionGroupsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(listPermissionGroupsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listPermissionGroupsDefinition.name).toBe('list_permission_groups');
    expect(listPermissionGroupsDefinition.description).toBe(
      'List all permission groups in Metabase',
    );
    expect(listPermissionGroupsDefinition.inputSchema).toEqual({});
  });
});
