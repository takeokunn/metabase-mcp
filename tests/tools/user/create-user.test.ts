import { CreateUserInputSchema } from '@src/schemas/user';
import { createUserDefinition } from '@src/tools/user/create-user';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

describe('createUser tool', () => {
  it('should return formatted MCP response with created user', async () => {
    const mockCreatedUser = {
      id: 3,
      email: 'newuser@example.com',
      first_name: 'New',
      last_name: 'User',
      is_active: true,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedUser);

    const input = {
      first_name: 'New',
      last_name: 'User',
      email: 'newuser@example.com',
    };

    const result = await createUserDefinition.handler(mockClient, input);

    expectMcpContent(result, mockCreatedUser);
    expect(mockClient.post).toHaveBeenCalledWith('/api/user', {
      first_name: 'New',
      last_name: 'User',
      email: 'newuser@example.com',
      password: undefined,
      group_ids: undefined,
      login_attributes: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass all optional parameters', async () => {
    const mockCreatedUser = {
      id: 4,
      email: 'fulluser@example.com',
      first_name: 'Full',
      last_name: 'User',
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedUser);

    const input = {
      first_name: 'Full',
      last_name: 'User',
      email: 'fulluser@example.com',
      password: 'securePassword123',
      group_ids: [1, 2, 3],
      login_attributes: { department: 'Engineering' },
    };

    await createUserDefinition.handler(mockClient, input);

    expect(mockClient.post).toHaveBeenCalledWith('/api/user', {
      first_name: 'Full',
      last_name: 'User',
      email: 'fulluser@example.com',
      password: 'securePassword123',
      group_ids: [1, 2, 3],
      login_attributes: { department: 'Engineering' },
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Email already exists');

    const input = {
      first_name: 'Duplicate',
      last_name: 'User',
      email: 'existing@example.com',
    };

    await expect(createUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should propagate validation errors', async () => {
    const mockClient = createMockClientWithError('post', 'Invalid email format', 400);

    const input = {
      first_name: 'Bad',
      last_name: 'Email',
      email: 'invalid-email',
    };

    await expect(createUserDefinition.handler(mockClient, input)).rejects.toThrow(
      'Invalid email format',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createUserDefinition.name).toBe('create_user');
    expect(createUserDefinition.description).toBe('Create a new user in Metabase');
    expect(createUserDefinition.inputSchema).toEqual(CreateUserInputSchema);
  });
});
