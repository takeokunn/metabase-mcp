import { CreateApiKeyInputSchema } from '@src/schemas/api-key';
import { createApiKeyDefinition } from '@src/tools/api-key/create-api-key';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createApiKey tool', () => {
  const input = { name: 'My API Key', group_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { id: 10, name: 'My API Key', group_id: 1, key: 'mb_abc123' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await createApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/api-key', input);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');

    await expect(createApiKeyDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(createApiKeyDefinition.handler(mockClient, input)).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(createApiKeyDefinition.name).toBe('create_api_key');
    expect(createApiKeyDefinition.description).toBe('Create a new API key in Metabase');
    expect(createApiKeyDefinition.inputSchema).toEqual(CreateApiKeyInputSchema);
  });
});
