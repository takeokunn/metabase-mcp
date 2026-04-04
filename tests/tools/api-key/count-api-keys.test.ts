import { countApiKeysDefinition } from '@src/tools/api-key/count-api-keys';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('countApiKeys tool', () => {
  it('should return formatted MCP response with count', async () => {
    const mockCount = { count: 5 };

    const mockClient = createMockClientWithResponse('get', mockCount);

    const result = await countApiKeysDefinition.handler(mockClient, {});

    expectMcpContent(result, mockCount);
    expect(mockClient.get).toHaveBeenCalledWith('/api/api-key/count');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle zero count', async () => {
    const mockClient = createMockClientWithResponse('get', { count: 0 });

    const result = await countApiKeysDefinition.handler(mockClient, {});

    expectMcpContent(result, { count: 0 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Permission denied');

    await expect(countApiKeysDefinition.handler(mockClient, {})).rejects.toThrow(
      'Permission denied',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(countApiKeysDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(countApiKeysDefinition.name).toBe('count_api_keys');
    expect(countApiKeysDefinition.description).toBe('Get the count of all API keys in Metabase');
    expect(countApiKeysDefinition.inputSchema).toEqual({});
  });
});
