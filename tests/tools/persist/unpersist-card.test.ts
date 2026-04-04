import { unpersistCardDefinition } from '@src/tools/persist/unpersist-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('unpersistCard tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, card_id: 5, state: 'deletable' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await unpersistCardDefinition.handler(mockClient, { card_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/card/5/unpersist');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(unpersistCardDefinition.handler(mockClient, { card_id: 5 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(unpersistCardDefinition.handler(mockClient, { card_id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(unpersistCardDefinition.name).toBe('unpersist_card');
  });
});
