import { ListUsersInputSchema } from '@src/schemas/user';
import { listUsersDefinition } from '@src/tools/user/list-users';
import { describe, expect, it } from 'vitest';

import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listUsers tool', () => {
  it('should return formatted MCP response with users', async () => {
    const mockUsers = {
      data: [
        { id: 1, email: 'admin@example.com', first_name: 'Admin', last_name: 'User' },
        { id: 2, email: 'user@example.com', first_name: 'Regular', last_name: 'User' },
      ],
      total: 2,
    };

    const mockClient = createMockClientWithResponse('get', mockUsers);

    const result = await listUsersDefinition.handler(mockClient, {});

    expectMcpContent(result, mockUsers);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user', {});
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass filter parameters', async () => {
    const mockClient = createMockClientWithResponse('get', { data: [], total: 0 });

    await listUsersDefinition.handler(mockClient, { status: 'active', query: 'admin' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/user', { status: 'active', query: 'admin' });
  });

  it('should pass pagination parameters', async () => {
    const mockClient = createMockClientWithResponse('get', { data: [], total: 0 });

    await listUsersDefinition.handler(mockClient, { limit: 10, offset: 20 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/user', { limit: 10, offset: 20 });
  });

  it('should pass group_id parameter', async () => {
    const mockClient = createMockClientWithResponse('get', { data: [], total: 0 });

    await listUsersDefinition.handler(mockClient, { group_id: 5 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/user', { group_id: 5 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Unauthorized');

    await expect(listUsersDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listUsersDefinition.name).toBe('list_users');
    expect(listUsersDefinition.description).toBe(
      'List all users with optional filtering by status, search query, or group',
    );
    expect(listUsersDefinition.inputSchema).toEqual(ListUsersInputSchema);
  });
});
