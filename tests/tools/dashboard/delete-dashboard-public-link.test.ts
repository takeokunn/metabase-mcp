import { DeleteDashboardPublicLinkInputSchema } from '@src/schemas/dashboard';
import { deleteDashboardPublicLinkDefinition } from '@src/tools/dashboard/delete-dashboard-public-link';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDashboardPublicLink tool', () => {
  const baseInput = {
    dashboard_id: 1,
  };

  it('should return formatted MCP response when deleting public link', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteDashboardPublicLinkDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/1/public_link');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Failed to delete public link');

    await expect(
      deleteDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Failed to delete public link');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Dashboard not found', 404),
    );

    await expect(
      deleteDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Dashboard not found');
  });

  it('should propagate permission errors', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Permission denied', 403),
    );

    await expect(
      deleteDashboardPublicLinkDefinition.handler(mockClient, baseInput),
    ).rejects.toThrow('Permission denied');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDashboardPublicLinkDefinition.name).toBe('delete_dashboard_public_link');
    expect(deleteDashboardPublicLinkDefinition.description).toBe(
      'Delete a public sharing link from a dashboard in Metabase',
    );
    expect(deleteDashboardPublicLinkDefinition.inputSchema).toEqual(
      DeleteDashboardPublicLinkInputSchema,
    );
  });
});
