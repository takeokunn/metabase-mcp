import { CheckDatabaseWorkspacePermissionInputSchema } from '@src/schemas/database';
import { checkDatabaseWorkspacePermissionDefinition } from '@src/tools/database/check-database-workspace-permission';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('checkDatabaseWorkspacePermission tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { has_permission: true };
    const mockClient = createMockClientWithResponse('post', mockResponse);
    const result = await checkDatabaseWorkspacePermissionDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/permission/workspace/check', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      checkDatabaseWorkspacePermissionDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      checkDatabaseWorkspacePermissionDefinition.handler(mockClient, { id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(checkDatabaseWorkspacePermissionDefinition.name).toBe(
      'check_database_workspace_permission',
    );
    expect(checkDatabaseWorkspacePermissionDefinition.description).toBe(
      'Check workspace permission for a database in Metabase',
    );
    expect(checkDatabaseWorkspacePermissionDefinition.inputSchema).toEqual(
      CheckDatabaseWorkspacePermissionInputSchema,
    );
  });
});
