import { RemoveDashboardFavoriteInputSchema } from '@src/schemas/dashboard';
import { removeDashboardFavoriteDefinition } from '@src/tools/dashboard/remove-dashboard-favorite';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('removeDashboardFavorite tool', () => {
  const baseInput = {
    dashboard_id: 1,
  };

  it('should return formatted MCP response when removing favorite', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await removeDashboardFavoriteDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/dashboard/1/favorite');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Failed to remove favorite');

    await expect(removeDashboardFavoriteDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to remove favorite',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError(
      'delete',
      createApiError('Dashboard not found', 404),
    );

    await expect(removeDashboardFavoriteDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(removeDashboardFavoriteDefinition.name).toBe('remove_dashboard_favorite');
    expect(removeDashboardFavoriteDefinition.description).toBe(
      'Remove a dashboard from favorites in Metabase',
    );
    expect(removeDashboardFavoriteDefinition.inputSchema).toEqual(
      RemoveDashboardFavoriteInputSchema,
    );
  });
});
