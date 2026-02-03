import { AddDashboardFavoriteInputSchema } from '@src/schemas/dashboard';
import { addDashboardFavoriteDefinition } from '@src/tools/dashboard/add-dashboard-favorite';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('addDashboardFavorite tool', () => {
  const baseInput = {
    dashboard_id: 1,
  };

  it('should return formatted MCP response when adding favorite', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await addDashboardFavoriteDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/1/favorite', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to add favorite');

    await expect(addDashboardFavoriteDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to add favorite',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Dashboard not found', 404));

    await expect(addDashboardFavoriteDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(addDashboardFavoriteDefinition.name).toBe('add_dashboard_favorite');
    expect(addDashboardFavoriteDefinition.description).toBe('Add a dashboard to favorites in Metabase');
    expect(addDashboardFavoriteDefinition.inputSchema).toEqual(AddDashboardFavoriteInputSchema);
  });
});
