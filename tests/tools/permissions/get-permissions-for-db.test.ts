import { GetDbPermissionsParamsSchema } from '@src/schemas/permissions';
import { getPermissionsForDbDefinition } from '@src/tools/permissions/get-permissions-for-db';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPermissionsForDb tool', () => {
  it('should return formatted MCP response with database permissions', async () => {
    const mockPermissions = { revision: 1, groups: { 1: { data: { schemas: 'all' } } } };
    const mockClient = createMockClientWithResponse('get', mockPermissions);

    const input = { db_id: 5 };
    const result = await getPermissionsForDbDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPermissions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph/db/5');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle different database IDs', async () => {
    const mockPermissions = { revision: 2, groups: {} };
    const mockClient = createMockClientWithResponse('get', mockPermissions);

    const input = { db_id: 42 };
    const result = await getPermissionsForDbDefinition.handler(mockClient, input);

    expectMcpContent(result, mockPermissions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/graph/db/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getPermissionsForDbDefinition.handler(mockClient, { db_id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));

    await expect(getPermissionsForDbDefinition.handler(mockClient, { db_id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPermissionsForDbDefinition.name).toBe('get_permissions_for_db');
    expect(getPermissionsForDbDefinition.description).toBe(
      'Get data permissions for a specific database in Metabase',
    );
    expect(getPermissionsForDbDefinition.inputSchema).toEqual(GetDbPermissionsParamsSchema);
  });
});
