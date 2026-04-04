import { UpdateCacheConfigInputSchema } from '@src/schemas/cache';
import { updateCacheConfigDefinition } from '@src/tools/cache/update-cache-config';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateCacheConfig tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { model: 'database', model_id: 1, strategy: 'ttl' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = { model: 'database' as const, model_id: 1, strategy: 'ttl' as const };
    const result = await updateCacheConfigDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/cache', {
      model: 'database',
      model_id: 1,
      strategy: 'ttl',
      config: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(
      updateCacheConfigDefinition.handler(mockClient, { model: 'root', model_id: 1 }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(
      updateCacheConfigDefinition.handler(mockClient, { model: 'root', model_id: 1 }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateCacheConfigDefinition.name).toBe('update_cache_config');
    expect(updateCacheConfigDefinition.inputSchema).toEqual(UpdateCacheConfigInputSchema);
  });
});
