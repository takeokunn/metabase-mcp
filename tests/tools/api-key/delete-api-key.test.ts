import { DeleteApiKeyParamsSchema } from '@src/schemas/api-key';
import { deleteApiKeyDefinition } from '@src/tools/api-key/delete-api-key';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteApiKey tool', () => {
  it('should delete an API key and return formatted MCP response', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 10 };
    const result = await deleteApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/api-key/10');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should handle different API key IDs', async () => {
    const mockResponse = { success: true };
    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const input = { id: 42 };
    const result = await deleteApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/api-key/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API key not found');

    await expect(deleteApiKeyDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'API key not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));

    await expect(deleteApiKeyDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteApiKeyDefinition.name).toBe('delete_api_key');
    expect(deleteApiKeyDefinition.description).toBe('Delete an API key from Metabase');
    expect(deleteApiKeyDefinition.inputSchema).toEqual(DeleteApiKeyParamsSchema);
  });
});
