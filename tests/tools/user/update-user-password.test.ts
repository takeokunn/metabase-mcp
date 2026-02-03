import { UpdateUserPasswordInputSchema } from '@src/schemas/user';
import { updateUserPasswordDefinition } from '@src/tools/user/update-user-password';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('updateUserPassword tool', () => {
  it('should return formatted MCP response on successful password update', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      id: 1,
      password: 'newSecurePassword123',
    };

    const result = await updateUserPasswordDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1/password', {
      password: 'newSecurePassword123',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should pass old_password when provided', async () => {
    const mockResponse = {
      success: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      id: 2,
      password: 'newSecurePassword456',
      old_password: 'currentPassword123',
    };

    const result = await updateUserPasswordDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/2/password', {
      password: 'newSecurePassword456',
      old_password: 'currentPassword123',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'User not found');

    const input = {
      id: 999,
      password: 'newPassword123',
    };

    await expect(updateUserPasswordDefinition.handler(mockClient, input)).rejects.toThrow(
      'User not found',
    );
  });

  it('should propagate password validation errors', async () => {
    const mockClient = createMockClientWithError(
      'put',
      'Password does not meet complexity requirements',
      400,
    );

    const input = {
      id: 1,
      password: 'weak',
    };

    await expect(updateUserPasswordDefinition.handler(mockClient, input)).rejects.toThrow(
      'Password does not meet complexity requirements',
    );
  });

  it('should propagate incorrect old password errors', async () => {
    const mockClient = createMockClientWithError('put', 'Incorrect current password', 400);

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
