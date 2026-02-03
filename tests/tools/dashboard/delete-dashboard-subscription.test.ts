import { DeleteDashboardSubscriptionInputSchema } from '@src/schemas/notification';
import { deleteDashboardSubscriptionDefinition } from '@src/tools/dashboard/delete-dashboard-subscription';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDashboardSubscription tool', () => {
  const baseInput = {
    id: 100,
  };

  it('should return formatted MCP response when deleting subscription', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteDashboardSubscriptionDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/notification/100');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Failed to delete subscription');

    await expect(
      deleteDashboardSubscriptionDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Failed to delete subscription');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Subscription not found', 404),
    );

    await expect(
      deleteDashboardSubscriptionDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Subscription not found');
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Permission denied', 403),
    );

    await expect(
      deleteDashboardSubscriptionDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Permission denied');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDashboardSubscriptionDefinition.name).toBe('delete_dashboard_subscription');
    expect(deleteDashboardSubscriptionDefinition.description).toBe(
      'Delete a dashboard subscription in Metabase',
    );
    expect(deleteDashboardSubscriptionDefinition.inputSchema).toEqual(
      DeleteDashboardSubscriptionInputSchema,
    );
  });
});
