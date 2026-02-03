import { DeleteBookmarkInputSchema } from '@src/schemas/bookmark';
import { deleteBookmarkDefinition } from '@src/tools/bookmark/delete-bookmark';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteBookmark tool', () => {
  it('should delete a card bookmark and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { model: 'card' as const, id: 1 };

    const result = await deleteBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/bookmark/card/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete a dashboard bookmark', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { model: 'dashboard' as const, id: 5 };

    const result = await deleteBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/bookmark/dashboard/5');
  });

  it('should delete a collection bookmark', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { model: 'collection' as const, id: 10 };

    const result = await deleteBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/bookmark/collection/10');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Bookmark not found');

    const input = { model: 'card' as const, id: 999 };

    await expect(deleteBookmarkDefinition.handler(mockClient, input)).rejects.toThrow(
      'Bookmark not found',
    );
    expect(mockClient.delete).toHaveBeenCalledWith('/api/bookmark/card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    const input = { model: 'dashboard' as const, id: 1 };

    await expect(deleteBookmarkDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteBookmarkDefinition.name).toBe('delete_bookmark');
    expect(deleteBookmarkDefinition.description).toBe(
      'Delete a bookmark for a card, dashboard, or collection from Metabase',
    );
    expect(deleteBookmarkDefinition.inputSchema).toEqual(DeleteBookmarkInputSchema);
  });
});
