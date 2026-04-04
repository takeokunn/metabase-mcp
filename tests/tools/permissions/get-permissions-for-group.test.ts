import { GetGroupPermissionsParamsSchema } from '@src/schemas/permissions';
import { getPermissionsForGroupDefinition } from '@src/tools/permissions/get-permissions-for-group';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPermissionsForGroup tool', () => {
  it('should return formatted MCP response with group permissions', async () => {
    const mockPermissions = { revision: 1, groups: { 2: { 1: { data: { schemas: 'all' } } } } };
    const mockClient = createMockClientWithResponse('get', mockPermissions);

    const input = { group_id: 2 };
    const result = await getPermissionsForGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPermissions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph/group/2');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle different group IDs', async () => {
    const mockPermissions = { revision: 3, groups: {} };
    const mockClient = createMockClientWithResponse('get', mockPermissions);

    const input = { group_id: 10 };
    const result = await getPermissionsForGroupDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPermissions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph/group/10');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Group not found');

    await expect(
      getPermissionsForGroupDefinition.handler(mockClient, { group_id: 999 }),
    ).rejects.toThrow('Group not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(
      getPermissionsForGroupDefinition.handler(mockClient, { group_id: 1 }),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPermissionsForGroupDefinition.name).toBe('get_permissions_for_group');
    expect(getPermissionsForGroupDefinition.description).toBe(
      'Get permissions for a specific permission group in Metabase',
    );
    expect(getPermissionsForGroupDefinition.inputSchema).toEqual(GetGroupPermissionsParamsSchema);
  });
});
