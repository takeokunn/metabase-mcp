import { SendNotificationParamsSchema } from '@src/schemas/notification';
import { sendNotificationDefinition } from '@src/tools/notification/send-notification';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('sendNotification tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await sendNotificationDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/1/send', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(sendNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not found', 404));
    await expect(sendNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(sendNotificationDefinition.name).toBe('send_notification');
    expect(sendNotificationDefinition.inputSchema).toEqual(SendNotificationParamsSchema);
  });
});
