import { listModelIndexesDefinition } from '@src/tools/model-index/list-model-indexes';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listModelIndexes tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, model_id: 5, state: 'indexed' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listModelIndexesDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/model-index');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listModelIndexesDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listModelIndexesDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listModelIndexesDefinition.name).toBe('list_model_indexes');
  });
});
