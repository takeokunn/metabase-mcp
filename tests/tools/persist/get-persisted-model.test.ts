import { getPersistedModelDefinition } from '@src/tools/persist/get-persisted-model';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPersistedModel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, card_id: 5, state: 'persisted' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPersistedModelDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/persist/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPersistedModelDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPersistedModelDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPersistedModelDefinition.name).toBe('get_persisted_model');
  });
});
