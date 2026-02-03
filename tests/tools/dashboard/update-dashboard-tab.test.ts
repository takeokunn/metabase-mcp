import { UpdateDashboardTabInputSchema } from '@src/schemas/dashboard';
import { updateDashboardTabDefinition } from '@src/tools/dashboard/update-dashboard-tab';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('updateDashboardTab tool', () => {
  const baseInput = {
    dashboard_id: 1,
    tab_id: 1,
    name: 'Updated Tab Name',
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [
      { id: 1, name: 'Tab 1', position: 0 },
      { id: 2, name: 'Tab 2', position: 1 },
    ],
    dashcards: [{ id: 10, card_id: 42 }],
  };

  it('should update tab name', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: expect.arrayContaining([
        expect.objectContaining({ id: 1, name: 'Updated Tab Name' }),
      ]),
    }));
  });

  it('should update tab position', async () => {
    const inputWithPosition = { ...baseInput, position: 1 };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardTabDefinition.handler(mockClient, inputWithPosition);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: expect.arrayContaining([
        expect.objectContaining({ id: 1, position: 1 }),
      ]),
    }));
  });

  it('should preserve other tabs unchanged', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: expect.arrayContaining([
        expect.objectContaining({ id: 2, name: 'Tab 2' }),
      ]),
    }));
  });

  it('should preserve existing dashcards', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await updateDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      dashcards: [{ id: 10, card_id: 42 }],
    }));
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(updateDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Forbidden', 403)),
    });

    await expect(updateDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDashboardTabDefinition.name).toBe('update_dashboard_tab');
    expect(updateDashboardTabDefinition.description).toBe(
      'Update a dashboard tab name or position in Metabase (v0.49+)',
    );
    expect(updateDashboardTabDefinition.inputSchema).toEqual(UpdateDashboardTabInputSchema);
  });
});
