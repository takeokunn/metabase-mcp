import { GetCommentMentionsInputSchema } from '@src/schemas/comment';
import { getCommentMentionsDefinition } from '@src/tools/comment/get-comment-mentions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCommentMentions tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', [{ id: 1, text: 'mention' }]);
    const result = await getCommentMentionsDefinition.handler(mockClient, {});
    expectMcpContent(result, [{ id: 1, text: 'mention' }]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/comment/mentions');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getCommentMentionsDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCommentMentionsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCommentMentionsDefinition.name).toBe('get_comment_mentions');
    expect(getCommentMentionsDefinition.description).toBe(
      'Get comment mentions for the current user in Metabase',
    );
    expect(getCommentMentionsDefinition.inputSchema).toEqual(GetCommentMentionsInputSchema);
  });
});
