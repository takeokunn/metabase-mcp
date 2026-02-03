import { AddDashboardTabInputSchema } from '@src/schemas/dashboard';
import { addDashboardTabDefinition } from '@src/tools/dashboard/add-dashboard-tab';
import { describe, expect, it, vi } from 'vitest';

import { createApiError } from '../../__factories__';
import { createMockClient } from '../../__mocks__';

describe('addDashboardTab tool', () => {
  const baseInput = {
    dashboard_id: 1,
    name: 'New Tab',
  };

  const mockDashboard = {
    id: 1,
    name: 'Test Dashboard',
    tabs: [
      { id: 1, name: 'Tab 1', position: 0 },
      { id: 2, name: 'Tab 2', position: 1 },
    ],
    dashcards: [{ id: 1, card_id: 10 }],
  };

  it('should add tab with magic ID -2', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await addDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: expect.arrayContaining([
        { id: 1, name: 'Tab 1', position: 0 },
        { id: 2, name: 'Tab 2', position: 1 },
        { id: -2, name: 'New Tab', position: 2 },
      ]),
    }));
  });

  it('should set position based on existing tabs count', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await addDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: expect.arrayContaining([
        expect.objectContaining({ id: -2, position: 2 }),
      ]),
    }));
  });

  it('should handle dashboard with no existing tabs', async () => {
    const dashboardNoTabs = { id: 1, name: 'Dashboard', tabs: [], dashcards: [] };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardNoTabs),
      put: vi.fn().mockResolvedValue(dashboardNoTabs),
    });

    await addDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: [{ id: -2, name: 'New Tab', position: 0 }],
    }));
  });

  it('should handle dashboard with undefined tabs', async () => {
    const dashboardUndefinedTabs = { id: 1, name: 'Dashboard', dashcards: [] };

    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(dashboardUndefinedTabs),
      put: vi.fn().mockResolvedValue(dashboardUndefinedTabs),
    });

    await addDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      tabs: [{ id: -2, name: 'New Tab', position: 0 }],
    }));
  });

  it('should preserve existing dashcards', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockResolvedValue(mockDashboard),
      put: vi.fn().mockResolvedValue(mockDashboard),
    });

    await addDashboardTabDefinition.handler(mockClient, baseInput);

    expect(mockClient.put).toHaveBeenCalledWith('/api/dashboard/1', expect.objectContaining({
      dashcards: [{ id: 1, card_id: 10 }],
    }));
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    });

    await expect(addDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClient({
      get: vi.fn().mockRejectedValue(createApiError('Forbidden', 403)),
    });

    await expect(addDashboardTabDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(addDashboardTabDefinition.name).toBe('add_dashboard_tab');
    expect(addDashboardTabDefinition.description).toBe('Add a new tab to a dashboard in Metabase (v0.49+)');
    expect(addDashboardTabDefinition.inputSchema).toEqual(AddDashboardTabInputSchema);
  });
});
