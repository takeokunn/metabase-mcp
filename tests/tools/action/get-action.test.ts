import { GetActionParamsSchema } from '@src/schemas/action';
import { getActionDefinition } from '@src/tools/action/get-action';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getAction tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'My Action', type: 'query', model_id: 5 };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getActionDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/action/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getActionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not found', 404));
    await expect(getActionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Not found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getActionDefinition.name).toBe('get_action');
    expect(getActionDefinition.inputSchema).toEqual(GetActionParamsSchema);
  });
});
