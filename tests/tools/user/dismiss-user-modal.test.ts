import { DismissUserModalInputSchema } from '@src/schemas/user';
import { dismissUserModalDefinition } from '@src/tools/user/dismiss-user-modal';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('dismissUserModal tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('put', { id: 1 });
    const result = await dismissUserModalDefinition.handler(mockClient, { id: 1, modal: 'onboarding' });
    expectMcpContent(result, { id: 1 });
    expect(mockClient.put).toHaveBeenCalledWith('/api/user/1/modal/onboarding', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Not found');
    await expect(dismissUserModalDefinition.handler(mockClient, { id: 999, modal: 'onboarding' })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(dismissUserModalDefinition.handler(mockClient, { id: 1, modal: 'onboarding' })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(dismissUserModalDefinition.name).toBe('dismiss_user_modal');
    expect(dismissUserModalDefinition.description).toBe('Dismiss a modal for a user in Metabase');
    expect(dismissUserModalDefinition.inputSchema).toEqual(DismissUserModalInputSchema);
  });
});
