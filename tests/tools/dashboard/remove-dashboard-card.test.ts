import { RemoveDashboardCardInputSchema } from '@src/schemas/dashboard';
import { removeDashboardCardDefinition } from '@src/tools/dashboard/remove-dashboard-card';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('removeDashboardCard tool', () => {
  const baseInput = {
    dashboard_id: 1,
    dashcard_id: 10,
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [{ id: 1, name: 'Tab 1' }],
    dashcards: [
      { id: 10, card_id: 42, row: 0, col: 0 },
      { id: 20, card_id: 43, row: 0, col: 4 },
    ],
  };

  it('should remove specified dashcard', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [expect.objectContaining({ id: 20 })],
      }),
    );
  });

  it('should preserve other dashcards', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardCardDefinition.handler(mockClient, baseInput);

    const putCall = mockClient.put.mock.calls[0];
    const dashcards = putCall[1].dashcards;
    expect(dashcards).toHaveLength(1);
    expect(dashcards[0].id).toBe(20);
  });

  it('should preserve existing tabs', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await removeDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [{ id: 1, name: 'Tab 1' }],
      }),
    );
  });

  it('should handle removing last dashcard', async () => {
    const singleCardDashboard = {
      ...mockDashboard,
      dashcards: [{ id: 10, card_id: 42 }],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(singleCardDashboard),
      put: vi.fn().mockResolvedValue(singleCardDashboard),
    });

    await removeDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [],
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(removeDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Not Found', 404)),
    });

    await expect(removeDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(removeDashboardCardDefinition.name).toBe('remove_dashboard_card');
    expect(removeDashboardCardDefinition.description).toBe(
      'Remove a card from a dashboard in Metabase (v0.49+)',
    );
    expect(removeDashboardCardDefinition.inputSchema).toEqual(RemoveDashboardCardInputSchema);
  });
});
