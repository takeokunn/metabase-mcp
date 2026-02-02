import type { MetabaseClient } from '@src/client';
import { GetDashboardParamsSchema } from '@src/schemas/dashboard';
import { getDashboardDefinition } from '@src/tools/dashboard/get-dashboard';
import { describe, expect, it, vi } from 'vitest';

describe('getDashboard tool', () => {
  it('should return formatted MCP response with dashboard data', async () => {
    const mockDashboard = {
      id: 1,
      name: 'Executive Dashboard',
      description: 'High-level business metrics',
      collection_id: 10,
      parameters: [
        {
          id: 'date_filter',
          name: 'Date Range',
          type: 'date/range',
        },
      ],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockDashboard),
    } as unknown as MetabaseClient;

    const result = await getDashboardDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockDashboard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle dashboard with minimal data', async () => {
    const mockDashboard = {
      id: 5,
      name: 'Simple Dashboard',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockDashboard),
    } as unknown as MetabaseClient;

    const result = await getDashboardDefinition.handler(mockClient, { id: 5 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockDashboard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/5');
  });

  it('should handle dashboard with dashcards (embedded cards)', async () => {
    const mockDashboard = {
      id: 3,
      name: 'Analytics Dashboard',
      dashcards: [
        { id: 1, card_id: 10, row: 0, col: 0 },
        { id: 2, card_id: 20, row: 0, col: 6 },
      ],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockDashboard),
    } as unknown as MetabaseClient;

    const result = await getDashboardDefinition.handler(mockClient, { id: 3 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.dashcards).toHaveLength(2);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Dashboard not found')),
    } as unknown as MetabaseClient;

    await expect(getDashboardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getDashboardDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDashboardDefinition.name).toBe('get_dashboard');
    expect(getDashboardDefinition.description).toBe('Get a single dashboard by ID from Metabase');
    expect(getDashboardDefinition.inputSchema).toEqual(GetDashboardParamsSchema);
  });
});
