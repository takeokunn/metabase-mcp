import { deleteModelIndexDefinition } from '@src/tools/model-index/delete-model-index';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteModelIndex tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteModelIndexDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/model-index/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteModelIndexDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));
    await expect(deleteModelIndexDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteModelIndexDefinition.name).toBe('delete_model_index');
  });
});
