import { AddDashboardCardInputSchema } from '@src/schemas/dashboard';
import { addDashboardCardDefinition } from '@src/tools/dashboard/add-dashboard-card';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('addDashboardCard tool', () => {
  const baseInput = {
    dashboard_id: 1,
    card_id: 42,
    row: 0,
    col: 0,
    size_x: 4,
    size_y: 3,
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [],
    dashcards: [
      { id: 1, card_id: 10, row: 0, col: 0, size_x: 4, size_y: 3 },
      { id: 2, card_id: 20, row: 0, col: 4, size_x: 4, size_y: 3 },
    ],
  };

  it('should add card to dashboard with negative ID', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi
        .fn()
        .mockResolvedValue({
          ...mockDashboard,
          dashcards: [...mockDashboard.dashcards, { id: -1 }],
        }),
    });

    const result = await addDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [],
        dashcards: expect.arrayContaining([
          expect.objectContaining({ id: -1, card_id: 42, row: 0, col: 0 }),
        ]),
      }),
    );
    expect(result.content[0].type).toBe('text');
  });

  it('should handle dashboard with existing negative IDs', async () => {
    const dashboardWithNegativeIds = {
      ...mockDashboard,
      dashcards: [
        { id: -1, card_id: 10, row: 0, col: 0, size_x: 4, size_y: 3 },
        { id: 1, card_id: 20, row: 0, col: 4, size_x: 4, size_y: 3 },
      ],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardWithNegativeIds),
      put: vi.fn().mockResolvedValue(dashboardWithNegativeIds),
    });

    await addDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: expect.arrayContaining([
          expect.objectContaining({ id: -2 }), // New card should get -2 (minId - 1)
        ]),
      }),
    );
  });

  it('should handle empty dashboard', async () => {
    const emptyDashboard = { id: 1, name: 'Empty Dashboard', tabs: [], dashcards: [] };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(emptyDashboard),
      put: vi.fn().mockResolvedValue(emptyDashboard),
    });

    await addDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [expect.objectContaining({ id: -1 })],
      }),
    );
  });

  it('should handle dashboard with undefined dashcards', async () => {
    const dashboardWithoutCards = { id: 1, name: 'Dashboard' };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardWithoutCards),
      put: vi.fn().mockResolvedValue(dashboardWithoutCards),
    });

    await addDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [],
        dashcards: [expect.objectContaining({ id: -1, card_id: 42 })],
      }),
    );
  });

  it('should include virtual_card for text cards', async () => {
    const inputWithVirtualCard = {
      dashboard_id: 1,
      card_id: null,
      row: 0,
      col: 0,
      size_x: 4,
      size_y: 2,
      virtual_card: {
        name: null,
        display: 'text' as const,
        visualization_settings: { text: 'Hello World' },
      },
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue({ id: 1, tabs: [], dashcards: [] }),
      put: vi.fn().mockResolvedValue({ id: 1 }),
    });

    await addDashboardCardDefinition.handler(mockClient, inputWithVirtualCard);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [
          expect.objectContaining({
            card_id: null,
            virtual_card: expect.objectContaining({ display: 'text' }),
          }),
        ],
      }),
    );
  });

  it('should include dashboard_tab_id when provided', async () => {
    const inputWithTab = { ...baseInput, dashboard_tab_id: 5 };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await addDashboardCardDefinition.handler(mockClient, inputWithTab);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: expect.arrayContaining([expect.objectContaining({ dashboard_tab_id: 5 })]),
      }),
    );
  });

  it('should preserve existing tabs', async () => {
    const dashboardWithTabs = {
      ...mockDashboard,
      tabs: [
        { id: 1, name: 'Tab 1' },
        { id: 2, name: 'Tab 2' },
      ],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardWithTabs),
      put: vi.fn().mockResolvedValue(dashboardWithTabs),
    });

    await addDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [
          { id: 1, name: 'Tab 1' },
          { id: 2, name: 'Tab 2' },
        ],
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(addDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Not Found', 404)),
    });

    await expect(addDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(addDashboardCardDefinition.name).toBe('add_dashboard_card');
    expect(addDashboardCardDefinition.description).toBe(
      'Add a card to a dashboard in Metabase (v0.49+)',
    );
    expect(addDashboardCardDefinition.inputSchema).toEqual(AddDashboardCardInputSchema);
  });
});

// Import vi for mock functions
import { vi } from 'vitest';
