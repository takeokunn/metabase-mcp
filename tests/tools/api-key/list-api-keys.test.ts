import { listApiKeysDefinition } from '@src/tools/api-key/list-api-keys';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listApiKeys tool', () => {
  it('should return formatted MCP response with API keys', async () => {
    const mockApiKeys = [
      { id: 1, name: 'My API Key', group_id: 1 },
      { id: 2, name: 'Another Key', group_id: 2 },
    ];

    const mockClient = createMockClientWithResponse('get', mockApiKeys);

    const result = await listApiKeysDefinition.handler(mockClient, {});

    expectMcpContent(result, mockApiKeys);
    expect(mockClient.get).toHaveBeenCalledWith('/api/api-key');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty API keys list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listApiKeysDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Permission denied');

    await expect(listApiKeysDefinition.handler(mockClient, {})).rejects.toThrow('Permission denied');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listApiKeysDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listApiKeysDefinition.name).toBe('list_api_keys');
    expect(listApiKeysDefinition.description).toBe('List all API keys in Metabase');
    expect(listApiKeysDefinition.inputSchema).toEqual({});
  });
});
