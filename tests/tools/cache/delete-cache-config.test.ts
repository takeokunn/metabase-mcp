import { deleteCacheConfigDefinition } from '@src/tools/cache/delete-cache-config';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteCacheConfig tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteCacheConfigDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/cache');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteCacheConfigDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteCacheConfigDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCacheConfigDefinition.name).toBe('delete_cache_config');
  });
});
