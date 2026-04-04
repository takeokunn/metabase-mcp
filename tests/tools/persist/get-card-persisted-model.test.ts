import { getCardPersistedModelDefinition } from '@src/tools/persist/get-card-persisted-model';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardPersistedModel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, card_id: 5, state: 'persisted' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getCardPersistedModelDefinition.handler(mockClient, { card_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/persist/card/5');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCardPersistedModelDefinition.handler(mockClient, { card_id: 5 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getCardPersistedModelDefinition.handler(mockClient, { card_id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardPersistedModelDefinition.name).toBe('get_card_persisted_model');
  });
});
