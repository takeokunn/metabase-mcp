import { ListNotificationsParamsSchema } from '@src/schemas/notification';
import { listNotificationsDefinition } from '@src/tools/notification/list-notifications';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listNotifications tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, dashboard_id: 10 }, { id: 2, dashboard_id: 20 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listNotificationsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/notification', {
      archived: undefined,
      dashboard_id: undefined,
    });
  });

  it('should pass archived param', async () => {
    const mockResult = [{ id: 1, archived: true }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listNotificationsDefinition.handler(mockClient, { archived: true });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/notification', {
      archived: true,
      dashboard_id: undefined,
    });
  });

  it('should pass dashboard_id param', async () => {
    const mockResult = [{ id: 1, dashboard_id: 5 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listNotificationsDefinition.handler(mockClient, { dashboard_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/notification', {
      archived: undefined,
      dashboard_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listNotificationsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listNotificationsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listNotificationsDefinition.name).toBe('list_notifications');
    expect(listNotificationsDefinition.inputSchema).toEqual(ListNotificationsParamsSchema);
  });
});
