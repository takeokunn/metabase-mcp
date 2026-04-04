import { UnsubscribeNotificationInputSchema } from '@src/schemas/notification';
import { unsubscribeNotificationDefinition } from '@src/tools/notification/unsubscribe-notification';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unsubscribeNotification tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await unsubscribeNotificationDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/1/unsubscribe', {
      email: undefined,
    });
  });

  it('should pass email param', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await unsubscribeNotificationDefinition.handler(mockClient, {
      id: 1,
      email: 'user@example.com',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification/1/unsubscribe', {
      email: 'user@example.com',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(unsubscribeNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not found', 404));
    await expect(unsubscribeNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(unsubscribeNotificationDefinition.name).toBe('unsubscribe_notification');
    expect(unsubscribeNotificationDefinition.inputSchema).toEqual(
      UnsubscribeNotificationInputSchema,
    );
  });
});
