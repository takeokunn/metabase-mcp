import { ReactivateUserInputSchema } from '@src/schemas/user';
import { reactivateUserDefinition } from '@src/tools/user/reactivate-user';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('reactivateUser tool', () => {
  it('should return formatted MCP response on successful user reactivation', async () => {
    const mockReactivatedUser = {
      id: 1,
      email: 'reactivated@example.com',
      first_name: 'John',
      last_name: 'Doe',
      is_active: true,
    };

    const mockClient = createMockClientWithResponse('put', mockReactivatedUser);

    const input = {
      id: 1,
    };

    const result = await reactivateUserDefinition.handler(mockClient, input);

    expectMcpContent(result, mockReactivatedUser);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1/reactivate');
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'User not found');

    const input = {
      id: 999,
    };

    await expect(reactivateUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'User not found',
    );
  });

  it('should propagate already active user errors', async () => {
    const mockClient = createMockClientWithError('put', 'User is already active', 400);

    const input = {
      id: 1,
    };

    await expect(reactivateUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'User is already active',
    );
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError(
      'put',
      'You do not have permission to reactivate users',
      403,
    );

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
