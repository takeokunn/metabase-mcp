import type { MetabaseClient } from '@src/client';
import { CreatePermissionGroupInputSchema } from '@src/schemas/permissions';
import { createPermissionGroupDefinition } from '@src/tools/permissions/create-permission-group';
import { describe, expect, it, vi } from 'vitest';

describe('createPermissionGroup tool', () => {
  it('should create a permission group and return formatted MCP response', async () => {
    const mockResponse = {
      id: 4,
      name: 'Data Analysts',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { name: 'Data Analysts' };

    const result = await createPermissionGroupDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/permissions/group', {
      name: 'Data Analysts',
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle group with special characters in name', async () => {
    const mockResponse = {
      id: 5,
      name: 'Sales & Marketing Team',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { name: 'Sales & Marketing Team' };

    const result = await createPermissionGroupDefinition.handler(mockClient, input);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/permissions/group', {
      name: 'Sales & Marketing Team',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Group name already exists')),
    } as unknown as MetabaseClient;

    const input = { name: 'Existing Group' };

    await expect(createPermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Group name already exists',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = { name: 'New Group' };

    await expect(createPermissionGroupDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createPermissionGroupDefinition.name).toBe('create_permission_group');
    expect(createPermissionGroupDefinition.description).toBe(
      'Create a new permission group in Metabase',
    );
    expect(createPermissionGroupDefinition.inputSchema).toEqual(CreatePermissionGroupInputSchema);
  });
});
