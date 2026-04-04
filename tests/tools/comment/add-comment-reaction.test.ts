import { AddCommentReactionInputSchema } from '@src/schemas/comment';
import { addCommentReactionDefinition } from '@src/tools/comment/add-comment-reaction';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('addCommentReaction tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, emoji: '👍' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await addCommentReactionDefinition.handler(mockClient, { id: 1, emoji: '👍' });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/comment/1/reaction', { emoji: '👍' });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      addCommentReactionDefinition.handler(mockClient, { id: 1, emoji: '👍' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      addCommentReactionDefinition.handler(mockClient, { id: 1, emoji: '👍' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(addCommentReactionDefinition.name).toBe('add_comment_reaction');
    expect(addCommentReactionDefinition.inputSchema).toEqual(AddCommentReactionInputSchema);
  });
});
