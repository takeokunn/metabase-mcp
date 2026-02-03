import { UpdateDashboardCardsInputSchema } from '@src/schemas/dashboard';
import { updateDashboardCardsDefinition } from '@src/tools/dashboard/update-dashboard-cards';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('updateDashboardCards tool', () => {
  const baseInput = {
    dashboard_id: 1,
    cards: [
      { id: 10, card_id: 42, row: 0, col: 0, size_x: 4, size_y: 3 },
      { id: 20, card_id: 43, row: 0, col: 4, size_x: 4, size_y: 3 },
    ],
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [{ id: 1, name: 'Tab 1' }],
    dashcards: [],
  };

  it('should bulk update dashboard cards', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardsDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: expect.arrayContaining([
          expect.objectContaining({ id: 10, card_id: 42 }),
          expect.objectContaining({ id: 20, card_id: 43 }),
        ]),
      }),
    );
  });

  it('should use existing tabs when ordered_tabs not provided', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardsDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [{ id: 1, name: 'Tab 1' }],
      }),
    );
  });

  it('should use ordered_tabs when provided', async () => {
    const inputWithTabs = {
      ...baseInput,
      ordered_tabs: [
        { id: 1, name: 'First Tab' },
        { id: 2, name: 'Second Tab' },
      ],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardsDefinition.handler(mockClient, inputWithTabs);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [
          { id: 1, name: 'First Tab' },
          { id: 2, name: 'Second Tab' },
        ],
      }),
    );
  });

  it('should format cards with default values', async () => {
    const inputWithMinimalCards = {
      dashboard_id: 1,
      cards: [{ id: -1, row: 0, col: 0, size_x: 4, size_y: 3 }],
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardsDefinition.handler(mockClient, inputWithMinimalCards);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        dashcards: [
          expect.objectContaining({
            id: -1,
            card_id: null,
            parameter_mappings: [],
            visualization_settings: {},
            series: [],
          }),
        ],
      }),
    );
  });

  it('should handle empty dashboard tabs', async () => {
    const dashboardNoTabs = { ...mockDashboard, tabs: undefined };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardNoTabs),
      put: vi.fn().mockResolvedValue(dashboardNoTabs),
    });

    await updateDashboardCardsDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1',
      expect.objectContaining({
        tabs: [],
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(updateDashboardCardsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Bad Request', 400)),
    });

    await expect(updateDashboardCardsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDashboardCardsDefinition.name).toBe('update_dashboard_cards');
    expect(updateDashboardCardsDefinition.description).toBe(
      'Bulk update dashboard cards in Metabase (v0.49+). Cards not in payload are removed.',
    );
    expect(updateDashboardCardsDefinition.inputSchema).toEqual(UpdateDashboardCardsInputSchema);
  });
});
