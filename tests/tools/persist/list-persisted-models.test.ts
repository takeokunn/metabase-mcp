import { listPersistedModelsDefinition } from '@src/tools/persist/list-persisted-models';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPersistedModels tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, card_id: 5, state: 'persisted' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listPersistedModelsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/persist');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listPersistedModelsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listPersistedModelsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listPersistedModelsDefinition.name).toBe('list_persisted_models');
  });
});
