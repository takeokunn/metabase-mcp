import { ReorderBookmarksInputSchema } from '@src/schemas/bookmark';
import { reorderBookmarksDefinition } from '@src/tools/bookmark/reorder-bookmarks';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('reorderBookmarks tool', () => {
  it('should reorder bookmarks and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      orderings: [
        { type: 'card' as const, item_id: 1 },
        { type: 'dashboard' as const, item_id: 2 },
        { type: 'collection' as const, item_id: 3 },
      ],
    };

    const result = await reorderBookmarksDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/bookmark/ordering', {
      orderings: [
        { type: 'card', item_id: 1 },
        { type: 'dashboard', item_id: 2 },
        { type: 'collection', item_id: 3 },
      ],
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle single bookmark ordering', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      orderings: [{ type: 'card' as const, item_id: 42 }],
    };

    const result = await reorderBookmarksDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/bookmark/ordering', {
      orderings: [{ type: 'card', item_id: 42 }],
    });
  });

  it('should handle reordering with same type bookmarks', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('put', mockResponse);

    const input = {
      orderings: [
        { type: 'card' as const, item_id: 3 },
        { type: 'card' as const, item_id: 1 },
        { type: 'card' as const, item_id: 2 },
      ],
    };

    const result = await reorderBookmarksDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/bookmark/ordering', {
      orderings: [
        { type: 'card', item_id: 3 },
        { type: 'card', item_id: 1 },
        { type: 'card', item_id: 2 },
      ],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Invalid ordering');

    const input = {
      orderings: [{ type: 'card' as const, item_id: 999 }],
    };

    await expect(reorderBookmarksDefinition.handler(mockClient, input)).rejects.toThrow(
      'Invalid ordering',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    const input = {
      orderings: [{ type: 'dashboard' as const, item_id: 1 }],
    };

    await expect(reorderBookmarksDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(reorderBookmarksDefinition.name).toBe('reorder_bookmarks');
    expect(reorderBookmarksDefinition.description).toBe(
      'Reorder bookmarks by providing the new ordering for the current user',
    );
    expect(reorderBookmarksDefinition.inputSchema).toEqual(ReorderBookmarksInputSchema);
  });
});
