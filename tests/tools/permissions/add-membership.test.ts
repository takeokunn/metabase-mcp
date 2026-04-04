import { AddMembershipInputSchema } from '@src/schemas/permissions';
import { addMembershipDefinition } from '@src/tools/permissions/add-membership';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('addMembership tool', () => {
  const input = { user_id: 1, group_id: 2 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 10, user_id: 1, group_id: 2 };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await addMembershipDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/permissions/membership', input);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(addMembershipDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'post',
      createApiError('User already in group', 400),
    );

    await expect(addMembershipDefinition.handler(mockClient, input)).rejects.toThrow(
      'User already in group',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(addMembershipDefinition.name).toBe('add_membership');
    expect(addMembershipDefinition.description).toBe(
      'Add a user to a permission group in Metabase',
    );
    expect(addMembershipDefinition.inputSchema).toEqual(AddMembershipInputSchema);
  });
});
