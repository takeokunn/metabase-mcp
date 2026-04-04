import { DeleteMembershipParamsSchema } from '@src/schemas/permissions';
import { deleteMembershipDefinition } from '@src/tools/permissions/delete-membership';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteMembership tool', () => {
  it('should delete a membership and return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 10 };
    const result = await deleteMembershipDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/membership/10');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should handle different membership IDs', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 42 };
    const result = await deleteMembershipDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/permissions/membership/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Membership not found');

    await expect(deleteMembershipDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Membership not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));

    await expect(deleteMembershipDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteMembershipDefinition.name).toBe('delete_membership');
    expect(deleteMembershipDefinition.description).toBe(
      'Delete a permission group membership in Metabase',
    );
    expect(deleteMembershipDefinition.inputSchema).toEqual(DeleteMembershipParamsSchema);
  });
});
