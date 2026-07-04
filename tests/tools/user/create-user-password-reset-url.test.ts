import { CreateUserPasswordResetUrlInputSchema } from '@src/schemas/user';
import { createUserPasswordResetUrlDefinition } from '@src/tools/user/create-user-password-reset-url';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createUserPasswordResetUrl tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 1, name: 'User 1' });
    const result = await createUserPasswordResetUrlDefinition.handler(mockClient, { id: 5 });
    expectMcpContent(result, { id: 1, name: 'User 1' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/user/5/password-reset-url');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      createUserPasswordResetUrlDefinition.handler(mockClient, { id: 5 }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      createUserPasswordResetUrlDefinition.handler(mockClient, { id: 5 }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(createUserPasswordResetUrlDefinition.name).toBe('create_user_password_reset_url');
    expect(createUserPasswordResetUrlDefinition.description).toBe(
      'Generate a password reset URL for a user in Metabase (admin only)',
    );
    expect(createUserPasswordResetUrlDefinition.inputSchema).toEqual(
      CreateUserPasswordResetUrlInputSchema,
    );
  });
});
