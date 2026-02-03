import { listPermissionGroupsDefinition } from '@src/tools/permissions/list-permission-groups';
import { describe, expect, it } from 'vitest';
import { createMockClientWithResponse, createMockClientWithError } from '../../__mocks__';
import { expectMcpContent } from '../../__helpers__';
import { createApiError } from '../../__factories__';

describe('listPermissionGroups tool', () => {
  it('should return formatted MCP response with permission groups', async () => {
    const mockGroups = [
      { id: 1, name: 'All Users' },
      { id: 2, name: 'Administrators' },
      { id: 3, name: 'Analysts' },
    ];

    const mockClient = createMockClientWithResponse('get', mockGroups);

    const result = await listPermissionGroupsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockGroups);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty groups list', async () => {
    const mockGroups: unknown[] = [];

    const mockClient = createMockClientWithResponse('get', mockGroups);

    const result = await listPermissionGroupsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/group');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Permission denied');

    await expect(listPermissionGroupsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listPermissionGroupsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listPermissionGroupsDefinition.name).toBe('list_permission_groups');
    expect(listPermissionGroupsDefinition.description).toBe(
      'List all permission groups in Metabase',
    );
    expect(listPermissionGroupsDefinition.inputSchema).toEqual({});
  });
});
