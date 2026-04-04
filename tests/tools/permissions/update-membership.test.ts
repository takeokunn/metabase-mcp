import { UpdateMembershipInputSchema } from '@src/schemas/permissions';
import { updateMembershipDefinition } from '@src/tools/permissions/update-membership';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateMembership tool', () => {
  it('should return formatted MCP response', async () => {
    const input = { id: 10, is_group_manager: true };
    const mockResult = { id: 10, user_id: 1, group_id: 2, is_group_manager: true };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateMembershipDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/membership/10', {
      is_group_manager: true,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle update without optional fields', async () => {
    const input = { id: 5 };
    const mockResult = { id: 5, user_id: 2, group_id: 3 };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateMembershipDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/permissions/membership/5', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Membership not found');

    await expect(updateMembershipDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Membership not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));

    await expect(updateMembershipDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateMembershipDefinition.name).toBe('update_membership');
    expect(updateMembershipDefinition.description).toBe(
      'Update a permission group membership in Metabase',
    );
    expect(updateMembershipDefinition.inputSchema).toEqual(UpdateMembershipInputSchema);
  });
});
