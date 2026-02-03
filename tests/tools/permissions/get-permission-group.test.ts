import { GetPermissionGroupInputSchema } from '@src/schemas/permissions';
import { getPermissionGroupDefinition } from '@src/tools/permissions/get-permission-group';
import { describe, expect, it } from 'vitest';
import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';
import { createApiError } from '../../__factories__';

describe('getPermissionGroup tool', () => {
  it('should return formatted MCP response with permission group data', async () => {
    const mockGroup = {
      id: 1,
      name: 'Administrators',
      members: [{ id: 1, email: 'admin@example.com', first_name: 'Admin', last_name: 'User' }],
    };

    const mockClient = createMockClientWithResponse('get', mockGroup);

    const result = await getPermissionGroupDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle group with no members', async () => {
    const mockGroup = {
      id: 3,
      name: 'Empty Group',
      members: [],
    };

    const mockClient = createMockClientWithResponse('get', mockGroup);

    const result = await getPermissionGroupDefinition.handler(mockClient, { id: 3 });

    expectMcpContent(result, mockGroup);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/3');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Group not found');

    await expect(getPermissionGroupDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Group not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getPermissionGroupDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPermissionGroupDefinition.name).toBe('get_permission_group');
    expect(getPermissionGroupDefinition.description).toBe(
      'Get a single permission group by ID from Metabase',
    );
    expect(getPermissionGroupDefinition.inputSchema).toEqual(GetPermissionGroupInputSchema);
  });
});
