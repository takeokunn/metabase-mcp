import { getModelIndexDefinition } from '@src/tools/model-index/get-model-index';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getModelIndex tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, model_id: 5, state: 'indexed' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getModelIndexDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/model-index/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getModelIndexDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getModelIndexDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getModelIndexDefinition.name).toBe('get_model_index');
  });
});
