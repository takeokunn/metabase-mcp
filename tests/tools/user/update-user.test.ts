import { UpdateUserInputSchema } from '@src/schemas/user';
import { updateUserDefinition } from '@src/tools/user/update-user';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('updateUser tool', () => {
  it('should return formatted MCP response with updated user', async () => {
    const mockUpdatedUser = {
      id: 1,
      email: 'updated@example.com',
      first_name: 'Updated',
      last_name: 'User',
      is_active: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedUser);

    const input = {
      id: 1,
      first_name: 'Updated',
      last_name: 'User',
    };

    const result = await updateUserDefinition.handler(mockClient, input);

    expectMcpContent(result, mockUpdatedUser);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1', {
      first_name: 'Updated',
      last_name: 'User',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update email', async () => {
    const mockUpdatedUser = {
      id: 2,
      email: 'newemail@example.com',
      first_name: 'Test',
      last_name: 'User',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedUser);

    await updateUserDefinition.handler(mockClient, { id: 2, email: 'newemail@example.com' });

    expect(mockClient.put).toHaveBeenCalledWith('/api/user/2', {
      email: 'newemail@example.com',
    });
  });

  it('should update superuser status', async () => {
    const mockUpdatedUser = {
      id: 3,
      is_superuser: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedUser);

    await updateUserDefinition.handler(mockClient, { id: 3, is_superuser: true });

    expect(mockClient.put).toHaveBeenCalledWith('/api/user/3', {
      is_superuser: true,
    });
  });

  it('should update locale and login attributes', async () => {
    const mockClient = createMockClientWithResponse('put', { id: 4 });

    await updateUserDefinition.handler(mockClient, {
      id: 4,
      locale: 'en_US',
      login_attributes: { team: 'Engineering' },
    });

    expect(mockClient.put).toHaveBeenCalledWith('/api/user/4', {
      locale: 'en_US',
      login_attributes: { team: 'Engineering' },
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'User not found');

    await expect(updateUserDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/999', {});
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError('put', 'Forbidden', 403);

    await expect(
      updateUserDefinition.handler(mockClient, { id: 1, is_superuser: true }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateUserDefinition.name).toBe('update_user');
    expect(updateUserDefinition.description).toBe('Update an existing user in Metabase');
    expect(updateUserDefinition.inputSchema).toEqual(UpdateUserInputSchema);
  });
});
