import { listRecentViewsDefinition } from '@src/tools/activity/list-recent-views';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listRecentViews tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ model: 'dashboard', model_id: 1, timestamp: '2024-01-01T00:00:00Z' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listRecentViewsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/activity/recent_views');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listRecentViewsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listRecentViewsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listRecentViewsDefinition.name).toBe('list_recent_views');
  });
});
