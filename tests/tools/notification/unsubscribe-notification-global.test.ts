import { UnsubscribeGlobalInputSchema } from '@src/schemas/notification';
import { unsubscribeNotificationGlobalDefinition } from '@src/tools/notification/unsubscribe-notification-global';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unsubscribeNotificationGlobal tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await unsubscribeNotificationGlobalDefinition.handler(mockClient, {
      email: 'user@example.com',
      hash: 'abc123',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/unsubscribe', {
      email: 'user@example.com',
      hash: 'abc123',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      unsubscribeNotificationGlobalDefinition.handler(mockClient, {
        email: 'user@example.com',
        hash: 'abc123',
      }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad request', 400));
    await expect(
      unsubscribeNotificationGlobalDefinition.handler(mockClient, {
        email: 'user@example.com',
        hash: 'abc123',
      }),
    ).rejects.toThrow('Bad request');
  });

  it('should have correct tool definition metadata', () => {
    expect(unsubscribeNotificationGlobalDefinition.name).toBe('unsubscribe_notification_global');
    expect(unsubscribeNotificationGlobalDefinition.inputSchema).toEqual(UnsubscribeGlobalInputSchema);
  });
});
