import { GetNotificationParamsSchema } from '@src/schemas/notification';
import { getNotificationDefinition } from '@src/tools/notification/get-notification';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getNotification tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, dashboard_id: 10 };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getNotificationDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/notification/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not found', 404));
    await expect(getNotificationDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getNotificationDefinition.name).toBe('get_notification');
    expect(getNotificationDefinition.inputSchema).toEqual(GetNotificationParamsSchema);
  });
});
