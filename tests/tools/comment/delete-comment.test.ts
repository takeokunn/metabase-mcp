import { DeleteCommentParamsSchema } from '@src/schemas/comment';
import { deleteCommentDefinition } from '@src/tools/comment/delete-comment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteComment tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteCommentDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/comment/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteCommentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteCommentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct metadata', () => {
    expect(deleteCommentDefinition.name).toBe('delete_comment');
    expect(deleteCommentDefinition.inputSchema).toEqual(DeleteCommentParamsSchema);
  });
});
