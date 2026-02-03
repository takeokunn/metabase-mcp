import { CreateDashboardSubscriptionInputSchema } from '@src/schemas/notification';
import { createDashboardSubscriptionDefinition } from '@src/tools/dashboard/create-dashboard-subscription';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createDashboardSubscription tool', () => {
  const baseInput = {
    dashboard_id: 1,
    channels: [
      {
        channel_type: 'email' as const,
        enabled: true,
        recipients: [{ email: 'user@example.com' }],
        schedule_type: 'daily' as const,
        schedule_hour: 9,
      },
    ],
  };

  it('should return formatted MCP response when creating subscription', async () => {
    const mockResponse = {
      id: 100,
      dashboard_id: 1,
      channels: baseInput.channels,
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await createDashboardSubscriptionDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notification', {
      dashboard_id: 1,
      channels: baseInput.channels,
      parameters: [],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include parameters when provided', async () => {
    const inputWithParams = {
      ...baseInput,
      parameters: [{ parameter_id: 'date', value: '2024-01-01' }],
    };

    const mockClient = createMockClientWithResponse('post', { id: 100 });

    await createDashboardSubscriptionDefinition.handler(mockClient, inputWithParams);

    expect(mockClient.post).toHaveBeenCalledWith('/api/notification', {
      dashboard_id: 1,
      channels: baseInput.channels,
      parameters: inputWithParams.parameters,
    });
  });

  it('should handle Slack channel', async () => {
    const slackInput = {
      dashboard_id: 1,
      channels: [
        {
          channel_type: 'slack' as const,
          enabled: true,
          details: { channel: '#analytics' },
          schedule_type: 'weekly' as const,
          schedule_day: 'mon' as const,
        },
      ],
    };

    const mockClient = createMockClientWithResponse('post', { id: 101 });

    await createDashboardSubscriptionDefinition.handler(mockClient, slackInput);

    expect(mockClient.post).toHaveBeenCalledWith('/api/notification', expect.objectContaining({
      channels: expect.arrayContaining([
        expect.objectContaining({ channel_type: 'slack' }),
      ]),
    }));
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create subscription');

    await expect(createDashboardSubscriptionDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to create subscription',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Dashboard not found', 404));

    await expect(createDashboardSubscriptionDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createDashboardSubscriptionDefinition.name).toBe('create_dashboard_subscription');
    expect(createDashboardSubscriptionDefinition.description).toBe(
      'Create a dashboard subscription (email/Slack notification) in Metabase',
    );
    expect(createDashboardSubscriptionDefinition.inputSchema).toEqual(CreateDashboardSubscriptionInputSchema);
  });
});
