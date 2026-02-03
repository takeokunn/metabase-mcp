import { ListDashboardRevisionsParamsSchema } from '@src/schemas/dashboard';
import { listDashboardRevisionsDefinition } from '@src/tools/dashboard/list-dashboard-revisions';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDashboardRevisions tool', () => {
  const baseInput = {
    dashboard_id: 1,
  };

  it('should return formatted MCP response with revisions', async () => {
    const mockResponse = [
      {
        id: 1,
        dashboard_id: 1,
        user: { id: 1, common_name: 'Admin' },
        is_creation: true,
        timestamp: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        dashboard_id: 1,
        user: { id: 1, common_name: 'Admin' },
        is_creation: false,
        timestamp: '2024-01-02T00:00:00Z',
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockResponse);

    const result = await listDashboardRevisionsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/revisions');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty revisions', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listDashboardRevisionsDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Failed to list revisions');

    await expect(listDashboardRevisionsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Failed to list revisions',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Dashboard not found', 404));

    await expect(listDashboardRevisionsDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Dashboard not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listDashboardRevisionsDefinition.name).toBe('list_dashboard_revisions');
    expect(listDashboardRevisionsDefinition.description).toBe(
      'List revision history for a dashboard in Metabase',
    );
    expect(listDashboardRevisionsDefinition.inputSchema).toEqual(
      ListDashboardRevisionsParamsSchema,
    );
  });
});
