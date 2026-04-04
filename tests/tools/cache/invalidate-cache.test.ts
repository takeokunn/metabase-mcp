import { InvalidateCacheInputSchema } from '@src/schemas/cache';
import { invalidateCacheDefinition } from '@src/tools/cache/invalidate-cache';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('invalidateCache tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await invalidateCacheDefinition.handler(mockClient, {
      model: 'dashboard',
      model_id: 1,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/cache/invalidate', {
      model: 'dashboard',
      model_id: 1,
    });
  });

  it('should work without optional params', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await invalidateCacheDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/cache/invalidate', {
      model: undefined,
      model_id: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(invalidateCacheDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));
    await expect(invalidateCacheDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(invalidateCacheDefinition.name).toBe('invalidate_cache');
    expect(invalidateCacheDefinition.inputSchema).toEqual(InvalidateCacheInputSchema);
  });
});
