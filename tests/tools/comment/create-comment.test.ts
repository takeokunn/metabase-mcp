import { CreateCommentInputSchema } from '@src/schemas/comment';
import { createCommentDefinition } from '@src/tools/comment/create-comment';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createComment tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, text: 'Hello world', model: 'card', model_id: 5 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createCommentDefinition.handler(mockClient, {
      text: 'Hello world',
      model: 'card',
      model_id: 5,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/comment', {
      text: 'Hello world',
      model: 'card',
      model_id: 5,
      mentioned_users: undefined,
    });
  });

  it('should create comment with mentioned users', async () => {
    const mockResult = { id: 2, text: 'Hey @user', model: 'dashboard', model_id: 3 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await createCommentDefinition.handler(mockClient, {
      text: 'Hey @user',
      model: 'dashboard',
      model_id: 3,
      mentioned_users: [42],
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/comment', {
      text: 'Hey @user',
      model: 'dashboard',
      model_id: 3,
      mentioned_users: [42],
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      createCommentDefinition.handler(mockClient, { text: 'Test', model: 'card', model_id: 1 }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      createCommentDefinition.handler(mockClient, { text: 'Test', model: 'card', model_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(createCommentDefinition.name).toBe('create_comment');
    expect(createCommentDefinition.inputSchema).toEqual(CreateCommentInputSchema);
  });
});
