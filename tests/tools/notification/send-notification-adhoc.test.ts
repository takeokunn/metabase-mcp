import { SendAdhocNotificationInputSchema } from '@src/schemas/notification';
import { sendAdhocNotificationDefinition } from '@src/tools/notification/send-notification-adhoc';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('sendAdhocNotification tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const payload = { card_id: 1, recipients: ['user@example.com'] };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await sendAdhocNotificationDefinition.handler(mockClient, {
      notification: payload,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/send', payload);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      sendAdhocNotificationDefinition.handler(mockClient, { notification: {} }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad request', 400));
    await expect(
      sendAdhocNotificationDefinition.handler(mockClient, { notification: {} }),
    ).rejects.toThrow('Bad request');
  });

  it('should have correct tool definition metadata', () => {
    expect(sendAdhocNotificationDefinition.name).toBe('send_adhoc_notification');
    expect(sendAdhocNotificationDefinition.inputSchema).toEqual(SendAdhocNotificationInputSchema);
  });
});
