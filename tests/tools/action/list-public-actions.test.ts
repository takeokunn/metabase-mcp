import { listPublicActionsDefinition } from '@src/tools/action/list-public-actions';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPublicActions tool', () => {
  it('should return formatted MCP response with public actions', async () => {
    const mockActions = [
      { id: 1, name: 'Public Action', type: 'http', model_id: 5, public_uuid: 'abc-123' },
    ];
    const mockClient = createMockClientWithResponse('get', mockActions);

    const result = await listPublicActionsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockActions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/action/public');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty public actions list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listPublicActionsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listPublicActionsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(listPublicActionsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(listPublicActionsDefinition.name).toBe('list_public_actions');
    expect(listPublicActionsDefinition.inputSchema).toEqual({});
  });
});
