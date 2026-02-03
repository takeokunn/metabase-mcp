import { UpdateDashboardSubscriptionInputSchema } from '@src/schemas/notification';
import { updateDashboardSubscriptionDefinition } from '@src/tools/dashboard/update-dashboard-subscription';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateDashboardSubscription tool', () => {
  const baseInput = {
    id: 100,
    channels: [
      {
        channel_type: 'email' as const,
        enabled: true,
        schedule_type: 'weekly' as const,
        schedule_day: 'mon' as const,
      },
    ],
  };

  it('should return formatted MCP response when updating subscription', async () => {
    const mockResponse = {
      id: 100,
      channels: baseInput.channels,
    };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const result = await updateDashboardSubscriptionDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/notification/100', {
      channels: baseInput.channels,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update parameters when provided', async () => {
    const inputWithParams = {
      id: 100,
      parameters: [{ parameter_id: 'date', value: '2024-06-01' }],
    };

    const mockClient = createMockClientWithResponse('put', { id: 100 });

    await updateDashboardSubscriptionDefinition.handler(mockClient, inputWithParams);

    expect(mockClient.put).toHaveBeenCalledWith('/api/notification/100', {
      parameters: inputWithParams.parameters,
    });
  });

  it('should archive subscription when archived=true', async () => {
    const archiveInput = {
      id: 100,
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', { id: 100, archived: true });

    await updateDashboardSubscriptionDefinition.handler(mockClient, archiveInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/notification/100', {
      archived: true,
    });
  });

  it('should handle multiple updates at once', async () => {
    const multiUpdateInput = {
      id: 100,
      channels: [{ channel_type: 'slack' as const, enabled: false }],
      parameters: [{ filter: 'new' }],
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', { id: 100 });

    await updateDashboardSubscriptionDefinition.handler(mockClient, multiUpdateInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/notification/100', {
      channels: multiUpdateInput.channels,
      parameters: multiUpdateInput.parameters,
      archived: false,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Failed to update subscription');

    await expect(
      updateDashboardSubscriptionDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Failed to update subscription');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'put',
      createApiError('Subscription not found', 404),
    );

    await expect(
      updateDashboardSubscriptionDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Subscription not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDashboardSubscriptionDefinition.name).toBe('update_dashboard_subscription');
    expect(updateDashboardSubscriptionDefinition.description).toBe(
      'Update a dashboard subscription (email/Slack notification) in Metabase',
    );
    expect(updateDashboardSubscriptionDefinition.inputSchema).toEqual(
      UpdateDashboardSubscriptionInputSchema,
    );
  });
});
