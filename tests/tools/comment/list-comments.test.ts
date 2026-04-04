import { ListCommentsParamsSchema } from '@src/schemas/comment';
import { listCommentsDefinition } from '@src/tools/comment/list-comments';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listComments tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, text: 'A comment', model: 'card', model_id: 1 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listCommentsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/comment', {
      model: undefined,
      model_id: undefined,
    });
  });

  it('should pass model and model_id params', async () => {
    const mockResult = [{ id: 1, text: 'A comment', model: 'card', model_id: 5 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listCommentsDefinition.handler(mockClient, { model: 'card', model_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/comment', {
      model: 'card',
      model_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listCommentsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listCommentsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct metadata', () => {
    expect(listCommentsDefinition.name).toBe('list_comments');
    expect(listCommentsDefinition.inputSchema).toEqual(ListCommentsParamsSchema);
  });
});
