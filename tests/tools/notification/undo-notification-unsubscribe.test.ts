import { UndoUnsubscribeInputSchema } from '@src/schemas/notification';
import { undoNotificationUnsubscribeDefinition } from '@src/tools/notification/undo-notification-unsubscribe';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('undoNotificationUnsubscribe tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await undoNotificationUnsubscribeDefinition.handler(mockClient, {
      email: 'user@example.com',
      hash: 'abc123',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/unsubscribe/undo', {
      email: 'user@example.com',
      hash: 'abc123',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      undoNotificationUnsubscribeDefinition.handler(mockClient, {
        email: 'user@example.com',
        hash: 'abc123',
      }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad request', 400));
    await expect(
      undoNotificationUnsubscribeDefinition.handler(mockClient, {
        email: 'user@example.com',
        hash: 'abc123',
      }),
    ).rejects.toThrow('Bad request');
  });

  it('should have correct tool definition metadata', () => {
    expect(undoNotificationUnsubscribeDefinition.name).toBe('undo_notification_unsubscribe');
    expect(undoNotificationUnsubscribeDefinition.inputSchema).toEqual(UndoUnsubscribeInputSchema);
  });
});
