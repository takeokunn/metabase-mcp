import { persistCardDefinition } from '@src/tools/persist/persist-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('persistCard tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, card_id: 5, state: 'persisted' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await persistCardDefinition.handler(mockClient, { card_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/card/5/persist');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(persistCardDefinition.handler(mockClient, { card_id: 5 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(persistCardDefinition.handler(mockClient, { card_id: 5 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(persistCardDefinition.name).toBe('persist_card');
  });
});
