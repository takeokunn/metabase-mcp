import type { MetabaseClient } from '@src/client';
import { GetCurrentUserInputSchema } from '@src/schemas/user';
import { getCurrentUserDefinition } from '@src/tools/user/get-current-user';
import { describe, expect, it, vi } from 'vitest';

describe('getCurrentUser tool', () => {
  it('should return formatted MCP response with current user data', async () => {
    const mockCurrentUser = {
      id: 1,
      email: 'current@example.com',
      first_name: 'Current',
      last_name: 'User',
      is_superuser: true,
      is_active: true,
      common_name: 'Current User',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCurrentUser),
    } as unknown as MetabaseClient;

    const result = await getCurrentUserDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCurrentUser);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/current');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle user with extended attributes', async () => {
    const mockCurrentUser = {
      id: 2,
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      is_superuser: true,
      is_active: true,
      locale: 'en_US',
      login_attributes: { department: 'Engineering' },
      personal_collection_id: 5,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCurrentUser),
    } as unknown as MetabaseClient;

    const result = await getCurrentUserDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCurrentUser);
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCurrentUserDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should propagate session expired errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Session expired')),
    } as unknown as MetabaseClient;

    await expect(getCurrentUserDefinition.handler(mockClient, {})).rejects.toThrow(
      'Session expired',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCurrentUserDefinition.name).toBe('get_current_user');
    expect(getCurrentUserDefinition.description).toBe('Get the currently authenticated user');
    expect(getCurrentUserDefinition.inputSchema).toEqual(GetCurrentUserInputSchema);
  });
});
