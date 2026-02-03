import { ListDashboardSubscriptionsParamsSchema } from '@src/schemas/notification';
import { listDashboardSubscriptionsDefinition } from '@src/tools/dashboard/list-dashboard-subscriptions';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDashboardSubscriptions tool', () => {
  const baseInput = {};

  it('should return formatted MCP response with subscriptions', async () => {
    const mockResponse = [
      {
        id: 1,
        dashboard_id: 10,
        channels: [{ channel_type: 'email', enabled: true }],
      },
      {
        id: 2,
        dashboard_id: 20,
        channels: [{ channel_type: 'slack', enabled: true }],
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockResponse);

    const result = await listDashboardSubscriptionsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/notification');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by dashboard_id when provided', async () => {
    const inputWithFilter = { dashboard_id: 10 };

    const mockClient = createMockClientWithResponse('get', []);

    await listDashboardSubscriptionsDefinition.handler(mockClient, inputWithFilter);

    expect(mockClient.get).toHaveBeenCalledWith('/api/notification?dashboard_id=10');
  });

  it('should include archived parameter when provided', async () => {
    const inputWithArchived = { archived: true };

    const mockClient = createMockClientWithResponse('get', []);

    await listDashboardSubscriptionsDefinition.handler(mockClient, inputWithArchived);

    expect(mockClient.get).toHaveBeenCalledWith('/api/notification?archived=true');
  });

  it('should combine multiple parameters', async () => {
    const inputWithBoth = { dashboard_id: 10, archived: false };

    const mockClient = createMockClientWithResponse('get', []);

    await listDashboardSubscriptionsDefinition.handler(mockClient, inputWithBoth);

    expect(mockClient.get).toHaveBeenCalledWith('/api/notification?dashboard_id=10&archived=false');
  });

  it('should handle empty list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDashboardSubscriptionsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Failed to list subscriptions');

    await expect(listDashboardSubscriptionsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to list subscriptions',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(listDashboardSubscriptionsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listDashboardSubscriptionsDefinition.name).toBe('list_dashboard_subscriptions');
    expect(listDashboardSubscriptionsDefinition.description).toBe(
      'List dashboard subscriptions (email/Slack notifications) in Metabase',
    );
    expect(listDashboardSubscriptionsDefinition.inputSchema).toEqual(ListDashboardSubscriptionsParamsSchema);
  });
});
