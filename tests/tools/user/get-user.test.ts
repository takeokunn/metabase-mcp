import type { MetabaseClient } from '@src/client';
import { GetUserInputSchema } from '@src/schemas/user';
import { getUserDefinition } from '@src/tools/user/get-user';
import { describe, expect, it, vi } from 'vitest';

describe('getUser tool', () => {
  it('should return formatted MCP response with user data', async () => {
    const mockUser = {
      id: 1,
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      is_superuser: true,
      is_active: true,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockUser),
    } as unknown as MetabaseClient;

    const result = await getUserDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle user with minimal data', async () => {
    const mockUser = {
      id: 42,
      email: 'simple@example.com',
      first_name: 'Simple',
      last_name: 'User',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockUser),
    } as unknown as MetabaseClient;

    const result = await getUserDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('User not found')),
    } as unknown as MetabaseClient;

    await expect(getUserDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getUserDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getUserDefinition.name).toBe('get_user');
    expect(getUserDefinition.description).toBe('Get a single user by ID from Metabase');
    expect(getUserDefinition.inputSchema).toEqual(GetUserInputSchema);
  });
});
