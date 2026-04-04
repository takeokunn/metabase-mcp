import { UpdateDashboardCardInputSchema } from '@src/schemas/dashboard';
import { updateDashboardCardDefinition } from '@src/tools/dashboard/update-dashboard-card';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('updateDashboardCard tool', () => {
  const baseInput = {
    dashboard_id: 1,
    dashcard_id: 10,
    row: 5,
    col: 6,
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [{ id: 1, name: 'Tab 1' }],
    dashcards: [
      { id: 10, card_id: 42, row: 0, col: 0, size_x: 4, size_y: 3 },
      { id: 20, card_id: 43, row: 0, col: 4, size_x: 4, size_y: 3 },
    ],
  };

  it('should update dashcard position', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1/cards',
      expect.objectContaining({
        cards: expect.arrayContaining([expect.objectContaining({ id: 10, row: 5, col: 6 })]),
      }),
    );
  });

  it('should update dashcard size', async () => {
    const inputWithSize = { ...baseInput, size_x: 8, size_y: 6 };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardDefinition.handler(mockClient, inputWithSize);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1/cards',
      expect.objectContaining({
        cards: expect.arrayContaining([expect.objectContaining({ id: 10, size_x: 8, size_y: 6 })]),
      }),
    );
  });

  it('should update visualization_settings', async () => {
    const inputWithSettings = {
      ...baseInput,
      visualization_settings: { 'graph.colors': ['#FF0000'] },
    };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardDefinition.handler(mockClient, inputWithSettings);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1/cards',
      expect.objectContaining({
        cards: expect.arrayContaining([
          expect.objectContaining({ visualization_settings: { 'graph.colors': ['#FF0000'] } }),
        ]),
      }),
    );
  });

  it('should preserve other dashcards unchanged', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1/cards',
      expect.objectContaining({
        cards: expect.arrayContaining([
          expect.objectContaining({ id: 20, row: 0, col: 4 }), // Unchanged
        ]),
      }),
    );
  });

  it('should PUT to /cards endpoint (not full dashboard)', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardCardDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/dashboard/1/cards',
      expect.objectContaining({
        cards: expect.any(Array),
      }),
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(updateDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Forbidden', 403)),
    });

    await expect(updateDashboardCardDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDashboardCardDefinition.name).toBe('update_dashboard_card');
    expect(updateDashboardCardDefinition.description).toBe(
      'Update a dashboard card position, size, or settings in Metabase (v0.49+)',
    );
    expect(updateDashboardCardDefinition.inputSchema).toEqual(UpdateDashboardCardInputSchema);
  });
});
