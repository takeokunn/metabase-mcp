import { GetDashboardParamsSchema } from '@src/schemas/dashboard';
import { getDashboardDefinition } from '@src/tools/dashboard/get-dashboard';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

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

    const mockClient = createMockClientWithResponse('get', mockDashboard);

    const result = await getDashboardDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockDashboard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle dashboard with minimal data', async () => {
    const mockDashboard = {
      id: 5,
      name: 'Simple Dashboard',
    };

    const mockClient = createMockClientWithResponse('get', mockDashboard);

    const result = await getDashboardDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockDashboard);
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

    const mockClient = createMockClientWithResponse('get', mockDashboard);

    const result = await getDashboardDefinition.handler(mockClient, { id: 3 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.dashcards).toHaveLength(2);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Dashboard not found');

    await expect(getDashboardDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Dashboard not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

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
