import { getMostRecentlyViewedDashboardDefinition } from '@src/tools/activity/get-most-recently-viewed-dashboard';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMostRecentlyViewedDashboard tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Sales Dashboard' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getMostRecentlyViewedDashboardDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/activity/most_recently_viewed_dashboard');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getMostRecentlyViewedDashboardDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getMostRecentlyViewedDashboardDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getMostRecentlyViewedDashboardDefinition.name).toBe('get_most_recently_viewed_dashboard');
  });
});
