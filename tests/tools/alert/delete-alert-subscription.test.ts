import { DeleteAlertSubscriptionInputSchema } from '@src/schemas/alert';
import { deleteAlertSubscriptionDefinition } from '@src/tools/alert/delete-alert-subscription';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteAlertSubscription tool', () => {
  it('should delete an alert subscription and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteAlertSubscriptionDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/1/subscription');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should use the correct ID in the URL', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    await deleteAlertSubscriptionDefinition.handler(mockClient, { id: 42 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/42/subscription');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Not found');

    await expect(deleteAlertSubscriptionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/alert/999/subscription');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(deleteAlertSubscriptionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteAlertSubscriptionDefinition.name).toBe('delete_alert_subscription');
    expect(deleteAlertSubscriptionDefinition.description).toBe(
      'Delete subscription to an alert in Metabase',
    );
    expect(deleteAlertSubscriptionDefinition.inputSchema).toEqual(DeleteAlertSubscriptionInputSchema);
  });
});
