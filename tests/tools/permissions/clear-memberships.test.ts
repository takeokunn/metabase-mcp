import { ClearMembershipsParamsSchema } from '@src/schemas/permissions';
import { clearMembershipsDefinition } from '@src/tools/permissions/clear-memberships';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('clearMemberships tool', () => {
  it('should clear all memberships from a group and return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = { group_id: 3 };
    const result = await clearMembershipsDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/membership/3/clear');
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle different group IDs', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = { group_id: 10 };
    const result = await clearMembershipsDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/membership/10/clear');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Group not found');

    await expect(clearMembershipsDefinition.handler(mockClient, { group_id: 999 })).rejects.toThrow(
      'Group not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'put',
      createApiError('Cannot clear built-in group', 400),
    );

    await expect(clearMembershipsDefinition.handler(mockClient, { group_id: 1 })).rejects.toThrow(
      'Cannot clear built-in group',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(clearMembershipsDefinition.name).toBe('clear_memberships');
    expect(clearMembershipsDefinition.description).toBe(
      'Remove all users from a permission group in Metabase',
    );
    expect(clearMembershipsDefinition.inputSchema).toEqual(ClearMembershipsParamsSchema);
  });
});
