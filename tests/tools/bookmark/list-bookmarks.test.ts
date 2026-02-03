import { ListBookmarksParamsSchema } from '@src/schemas/bookmark';
import { listBookmarksDefinition } from '@src/tools/bookmark/list-bookmarks';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listBookmarks tool', () => {
  it('should return formatted MCP response with bookmarks', async () => {
    const mockBookmarks = [
      { type: 'card', item_id: 1, name: 'Sales Report' },
      { type: 'dashboard', item_id: 2, name: 'Analytics Dashboard' },
      { type: 'collection', item_id: 3, name: 'Marketing Collection' },
    ];

    const mockClient = createMockClientWithResponse('get', mockBookmarks);

    const result = await listBookmarksDefinition.handler(mockClient, {});

    expectMcpContent(result, mockBookmarks);
    expect(mockClient.get).toHaveBeenCalledWith('/api/bookmark');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty bookmark list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listBookmarksDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should handle bookmarks with minimal data', async () => {
    const mockBookmarks = [{ type: 'card', item_id: 42, name: 'Simple Question' }];

    const mockClient = createMockClientWithResponse('get', mockBookmarks);

    const result = await listBookmarksDefinition.handler(mockClient, {});

    expectMcpContent(result, mockBookmarks);
    expect(mockClient.get).toHaveBeenCalledWith('/api/bookmark');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listBookmarksDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listBookmarksDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listBookmarksDefinition.name).toBe('list_bookmarks');
    expect(listBookmarksDefinition.description).toBe(
      'Get list of all bookmarks for the current user in Metabase',
    );
    expect(listBookmarksDefinition.inputSchema).toEqual(ListBookmarksParamsSchema);
  });
});
