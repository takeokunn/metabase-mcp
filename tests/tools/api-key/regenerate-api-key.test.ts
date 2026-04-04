import { RegenerateApiKeyParamsSchema } from '@src/schemas/api-key';
import { regenerateApiKeyDefinition } from '@src/tools/api-key/regenerate-api-key';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('regenerateApiKey tool', () => {
  it('should regenerate an API key and return formatted MCP response', async () => {
    const mockResult = { id: 10, name: 'My Key', key: 'mb_newkey123' };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const input = { id: 10 };
    const result = await regenerateApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/api-key/10/regenerate', {});
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle different API key IDs', async () => {
    const mockResult = { id: 5, name: 'Another Key', key: 'mb_anotherkey' };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const input = { id: 5 };
    const result = await regenerateApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/api-key/5/regenerate', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API key not found');

    await expect(regenerateApiKeyDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'API key not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));

    await expect(regenerateApiKeyDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(regenerateApiKeyDefinition.name).toBe('regenerate_api_key');
    expect(regenerateApiKeyDefinition.description).toBe('Regenerate an API key in Metabase');
    expect(regenerateApiKeyDefinition.inputSchema).toEqual(RegenerateApiKeyParamsSchema);
  });
});
