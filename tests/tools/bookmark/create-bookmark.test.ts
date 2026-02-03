import { CreateBookmarkInputSchema } from '@src/schemas/bookmark';
import { createBookmarkDefinition } from '@src/tools/bookmark/create-bookmark';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createBookmark tool', () => {
  it('should create a card bookmark and return formatted MCP response', async () => {
    const mockResponse = {
      type: 'card',
      item_id: 1,
      name: 'Sales Report',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { model: 'card' as const, id: 1 };

    const result = await createBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/bookmark/card/1');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should create a dashboard bookmark', async () => {
    const mockResponse = {
      type: 'dashboard',
      item_id: 5,
      name: 'Analytics Dashboard',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { model: 'dashboard' as const, id: 5 };

    const result = await createBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/bookmark/dashboard/5');
  });

  it('should create a collection bookmark', async () => {
    const mockResponse = {
      type: 'collection',
      item_id: 10,
      name: 'Marketing Collection',
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { model: 'collection' as const, id: 10 };

    const result = await createBookmarkDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/bookmark/collection/10');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Item not found');

    const input = { model: 'card' as const, id: 999 };

    await expect(createBookmarkDefinition.handler(mockClient, input)).rejects.toThrow(
      'Item not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/bookmark/card/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    const input = { model: 'dashboard' as const, id: 1 };

    await expect(createBookmarkDefinition.handler(mockClient, input)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createBookmarkDefinition.name).toBe('create_bookmark');
    expect(createBookmarkDefinition.description).toBe(
      'Create a new bookmark for a card, dashboard, or collection in Metabase',
    );
    expect(createBookmarkDefinition.inputSchema).toEqual(CreateBookmarkInputSchema);
  });
});
