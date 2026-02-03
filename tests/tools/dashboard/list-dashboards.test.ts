import { ListDashboardsParamsSchema } from '@src/schemas/dashboard';
import { listDashboardsDefinition } from '@src/tools/dashboard/list-dashboards';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDashboards tool', () => {
  it('should return formatted MCP response with dashboards', async () => {
    const mockDashboards = [
      {
        id: 1,
        name: 'Sales Dashboard',
        description: 'Monthly sales metrics',
        collection_id: 5,
      },
      {
        id: 2,
        name: 'Analytics Dashboard',
        description: 'User analytics overview',
        collection_id: 5,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockDashboards);

    const result = await listDashboardsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockDashboards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  // Note: Metabase's GET /api/dashboard does not support collection filtering.
  // Use get_collection_items with models: ["dashboard"] to filter by collection.

  it('should handle empty dashboard list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDashboardsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should handle dashboards with parameters', async () => {
    const mockDashboards = [
      {
        id: 4,
        name: 'Parameterized Dashboard',
        description: 'Dashboard with filters',
        collection_id: null,
        parameters: [
          {
            id: 'date_filter',
            name: 'Date Range',
            type: 'date/range',
          },
        ],
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockDashboards);

    const result = await listDashboardsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockDashboards);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listDashboardsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(listDashboardsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDashboardsDefinition.name).toBe('list_dashboards');
    expect(listDashboardsDefinition.description).toBe(
      'Get list of all dashboards in Metabase. Note: The Metabase API does not support filtering by collection on this endpoint. To get dashboards in a specific collection, use get_collection_items with models: ["dashboard"].',
    );
    expect(listDashboardsDefinition.inputSchema).toEqual(ListDashboardsParamsSchema);
  });
});
