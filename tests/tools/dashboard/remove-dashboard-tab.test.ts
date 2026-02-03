import { RemoveDashboardTabInputSchema } from '@src/schemas/dashboard';
import { removeDashboardTabDefinition } from '@src/tools/dashboard/remove-dashboard-tab';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('removeDashboardTab tool', () => {
  const baseInput = {
    dashboard_id: 1,
    tab_id: 1,
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [
      { id: 1, name: 'Tab 1' },
      { id: 2, name: 'Tab 2' },
    ],
    dashcards: [
      { id: 10, card_id: 42, dashboard_tab_id: 1 },
      { id: 20, card_id: 43, dashboard_tab_id: 2 },
    ],
  };

  it('should remove specified tab', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [{ id: 2, name: 'Tab 2' }],
      }),
    );
  });

  it('should remove cards belonging to removed tab', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [expect.objectContaining({ id: 20, dashboard_tab_id: 2 })],
      }),
    );
  });

  it('should preserve cards on other tabs', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardTabDefinition.handler(mockClient, baseInput);

    const putCall = mockClient.put.mock.calls[0];
    const dashcards = putCall[1].dashcards;
    expect(dashcards).toHaveLength(1);
    expect(dashcards[0].id).toBe(20);
  });

  it('should handle removing last tab', async () => {
    const singleTabDashboard = {
      ...mockDashboard,
      tabs: [{ id: 1, name: 'Tab 1' }],
      dashcards: [{ id: 10, card_id: 42, dashboard_tab_id: 1 }],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(singleTabDashboard),
      put: vi.fn().mockResolvedValue(singleTabDashboard),
    });

    await removeDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [],
        dashcards: [],
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(removeDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Not Found', 404)),
    });

    await expect(removeDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(removeDashboardTabDefinition.name).toBe('remove_dashboard_tab');
    expect(removeDashboardTabDefinition.description).toBe(
      'Remove a tab from a dashboard in Metabase (v0.49+)',
    );
    expect(removeDashboardTabDefinition.inputSchema).toEqual(RemoveDashboardTabInputSchema);
  });
});
