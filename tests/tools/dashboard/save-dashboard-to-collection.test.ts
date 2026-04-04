import { SaveDashboardToCollectionInputSchema } from '@src/schemas/dashboard';
import { saveDashboardToCollectionDefinition } from '@src/tools/dashboard/save-dashboard-to-collection';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('saveDashboardToCollection tool', () => {
  it('should return formatted MCP response with saved dashboard', async () => {
    const dashboard = { id: 1, name: 'My Dashboard' };
    const mockClient = createMockClientWithResponse('post', dashboard);
    const result = await saveDashboardToCollectionDefinition.handler(mockClient, {
      parent_collection_id: 5,
      dashboard,
    });
    expectMcpContent(result, dashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/save/collection/5', dashboard);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      saveDashboardToCollectionDefinition.handler(mockClient, {
        parent_collection_id: 5,
        dashboard: {},
      }),
    ).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      saveDashboardToCollectionDefinition.handler(mockClient, {
        parent_collection_id: 5,
        dashboard: {},
      }),
    ).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(saveDashboardToCollectionDefinition.name).toBe('save_dashboard_to_collection');
    expect(saveDashboardToCollectionDefinition.description).toBe(
      'Save a dashboard to a specific collection in Metabase',
    );
    expect(saveDashboardToCollectionDefinition.inputSchema).toEqual(
      SaveDashboardToCollectionInputSchema,
    );
  });
});
