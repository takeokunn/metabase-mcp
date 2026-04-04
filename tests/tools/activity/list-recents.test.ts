import { ListRecentsParamsSchema } from '@src/schemas/activity';
import { listRecentsDefinition } from '@src/tools/activity/list-recents';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listRecents tool', () => {
  it('should return formatted MCP response without context', async () => {
    const mockResult = [{ model: 'dashboard', model_id: 1 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listRecentsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/activity/recents', undefined);
  });

  it('should pass context param when provided', async () => {
    const mockResult = [{ model: 'dashboard', model_id: 1 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listRecentsDefinition.handler(mockClient, { context: 'views' });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/activity/recents', { context: 'views' });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listRecentsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listRecentsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listRecentsDefinition.name).toBe('list_recents');
    expect(listRecentsDefinition.inputSchema).toEqual(ListRecentsParamsSchema);
  });
});
