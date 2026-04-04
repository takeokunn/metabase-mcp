import { listMembershipsDefinition } from '@src/tools/permissions/list-memberships';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listMemberships tool', () => {
  it('should return formatted MCP response with memberships', async () => {
    const mockMemberships = {
      1: [{ membership_id: 1, user_id: 10, group_id: 1 }],
      2: [{ membership_id: 2, user_id: 11, group_id: 2 }],
    };

    const mockClient = createMockClientWithResponse('get', mockMemberships);

    const result = await listMembershipsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockMemberships);
    expect(mockClient.get).toHaveBeenCalledWith('/api/permissions/membership');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty memberships', async () => {
    const mockClient = createMockClientWithResponse('get', {});

    const result = await listMembershipsDefinition.handler(mockClient, {});

    expectMcpContent(result, {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Permission denied');

    await expect(listMembershipsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listMembershipsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listMembershipsDefinition.name).toBe('list_memberships');
    expect(listMembershipsDefinition.description).toBe(
      'List all permission group memberships in Metabase',
    );
    expect(listMembershipsDefinition.inputSchema).toEqual({});
  });
});
