import { getCacheConfigDefinition } from '@src/tools/cache/get-cache-config';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCacheConfig tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { model: 'root', strategy: 'ttl', config: { duration: 3600 } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getCacheConfigDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/cache');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCacheConfigDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCacheConfigDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCacheConfigDefinition.name).toBe('get_cache_config');
  });
});
