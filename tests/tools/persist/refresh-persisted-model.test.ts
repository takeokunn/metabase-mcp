import { refreshPersistedModelDefinition } from '@src/tools/persist/refresh-persisted-model';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('refreshPersistedModel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, card_id: 5, state: 'refreshing' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await refreshPersistedModelDefinition.handler(mockClient, { card_id: 5 });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/persist/card/5/refresh');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(refreshPersistedModelDefinition.handler(mockClient, { card_id: 5 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(refreshPersistedModelDefinition.handler(mockClient, { card_id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(refreshPersistedModelDefinition.name).toBe('refresh_persisted_model');
  });
});
