import { listPopularItemsDefinition } from '@src/tools/activity/list-popular-items';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPopularItems tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ model: 'dashboard', model_id: 1, views: 42 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listPopularItemsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/activity/popular_items');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listPopularItemsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listPopularItemsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listPopularItemsDefinition.name).toBe('list_popular_items');
  });
});
