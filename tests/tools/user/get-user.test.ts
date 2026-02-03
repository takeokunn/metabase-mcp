import { GetUserInputSchema } from '@src/schemas/user';
import { getUserDefinition } from '@src/tools/user/get-user';
import { describe, expect, it } from 'vitest';

import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';

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

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getUserDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockUser);
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

    const mockClient = createMockClientWithResponse('get', mockUser);

    const result = await getUserDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockUser);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'User not found');

    await expect(getUserDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'User not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/user/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', 'Unauthorized', 401);

    await expect(getUserDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getUserDefinition.name).toBe('get_user');
    expect(getUserDefinition.description).toBe('Get a single user by ID from Metabase');
    expect(getUserDefinition.inputSchema).toEqual(GetUserInputSchema);
  });
});
