import { SaveDashboardInputSchema } from '@src/schemas/dashboard';
import { saveDashboardDefinition } from '@src/tools/dashboard/save-dashboard';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('saveDashboard tool', () => {
  it('should return formatted MCP response with saved dashboard', async () => {
    const dashboard = { id: 1, name: 'My Dashboard' };
    const mockClient = createMockClientWithResponse('post', dashboard);
    const result = await saveDashboardDefinition.handler(mockClient, { dashboard });
    expectMcpContent(result, dashboard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/dashboard/save', dashboard);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(saveDashboardDefinition.handler(mockClient, { dashboard: {} })).rejects.toThrow(
      'Not found',
    );
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(saveDashboardDefinition.handler(mockClient, { dashboard: {} })).rejects.toThrow(
      'Unauthorized',
    );
  });
  it('should have correct tool definition metadata', () => {
    expect(saveDashboardDefinition.name).toBe('save_dashboard');
    expect(saveDashboardDefinition.description).toBe(
      'Save a dashboard (creates or updates) in Metabase',
    );
    expect(saveDashboardDefinition.inputSchema).toEqual(SaveDashboardInputSchema);
  });
});
