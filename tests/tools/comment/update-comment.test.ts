import { UpdateCommentInputSchema } from '@src/schemas/comment';
import { updateCommentDefinition } from '@src/tools/comment/update-comment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateComment tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, text: 'Updated text' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateCommentDefinition.handler(mockClient, {
      id: 1,
      text: 'Updated text',
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/comment/1', { text: 'Updated text' });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(
      updateCommentDefinition.handler(mockClient, { id: 1, text: 'Test' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(
      updateCommentDefinition.handler(mockClient, { id: 1, text: 'Test' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(updateCommentDefinition.name).toBe('update_comment');
    expect(updateCommentDefinition.inputSchema).toEqual(UpdateCommentInputSchema);
  });
});
