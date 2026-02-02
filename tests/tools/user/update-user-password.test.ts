import type { MetabaseClient } from '@src/client';
import { UpdateUserPasswordInputSchema } from '@src/schemas/user';
import { updateUserPasswordDefinition } from '@src/tools/user/update-user-password';
import { describe, expect, it, vi } from 'vitest';

describe('updateUserPassword tool', () => {
  it('should return formatted MCP response on successful password update', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
      password: 'newSecurePassword123',
    };

    const result = await updateUserPasswordDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1/password', {
      password: 'newSecurePassword123',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should pass old_password when provided', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      id: 2,
      password: 'newSecurePassword456',
      old_password: 'currentPassword123',
    };

    const result = await updateUserPasswordDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/2/password', {
      password: 'newSecurePassword456',
      old_password: 'currentPassword123',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('User not found')),
    } as unknown as MetabaseClient;

    const input = {
      id: 999,
      password: 'newPassword123',
    };

    await expect(updateUserPasswordDefinition.handler(mockClient, input)).rejects.toThrow(
      'User not found',
    );
  });

  it('should propagate password validation errors', async () => {
    const apiError = new Error('Password does not meet complexity requirements');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
      password: 'weak',
    };

    await expect(updateUserPasswordDefinition.handler(mockClient, input)).rejects.toThrow(
      'Password does not meet complexity requirements',
    );
  });

  it('should propagate incorrect old password errors', async () => {
    const apiError = new Error('Incorrect current password');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
      password: 'newPassword123',
      old_password: 'wrongOldPassword',
    };

    await expect(updateUserPasswordDefinition.handler(mockClient, input)).rejects.toThrow(
      'Incorrect current password',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateUserPasswordDefinition.name).toBe('update_user_password');
    expect(updateUserPasswordDefinition.description).toBe("Update a user's password in Metabase");
    expect(updateUserPasswordDefinition.inputSchema).toEqual(UpdateUserPasswordInputSchema);
  });
});
