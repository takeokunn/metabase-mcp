import type { MetabaseClient } from '@src/client';
import { ReactivateUserInputSchema } from '@src/schemas/user';
import { reactivateUserDefinition } from '@src/tools/user/reactivate-user';
import { describe, expect, it, vi } from 'vitest';

describe('reactivateUser tool', () => {
  it('should return formatted MCP response on successful user reactivation', async () => {
    const mockReactivatedUser = {
      id: 1,
      email: 'reactivated@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockReactivatedUser),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    const result = await reactivateUserDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockReactivatedUser);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1/reactivate');
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('User not found')),
    } as unknown as MetabaseClient;

    const input = {
      id: 999,
    };

    await expect(reactivateUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'User not found',
    );
  });

  it('should propagate already active user errors', async () => {
    const apiError = new Error('User is already active');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    await expect(reactivateUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'User is already active',
    );
  });

  it('should propagate permission errors', async () => {
    const apiError = new Error('You do not have permission to reactivate users');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
    };

    await expect(reactivateUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'You do not have permission to reactivate users',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(reactivateUserDefinition.name).toBe('reactivate_user');
    expect(reactivateUserDefinition.description).toBe(
      'Reactivate a previously deactivated user in Metabase',
    );
    expect(reactivateUserDefinition.inputSchema).toEqual(ReactivateUserInputSchema);
  });
});
