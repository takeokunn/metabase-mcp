import { UpdateApiKeyInputSchema } from '@src/schemas/api-key';
import { updateApiKeyDefinition } from '@src/tools/api-key/update-api-key';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateApiKey tool', () => {
  it('should return formatted MCP response', async () => {
    const input = { id: 10, name: 'Updated Key' };
    const mockResult = { id: 10, name: 'Updated Key', group_id: 1 };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/api-key/10', { name: 'Updated Key' });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle update without optional fields', async () => {
    const input = { id: 5 };
    const mockResult = { id: 5, name: 'My Key', group_id: 1 };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateApiKeyDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/api-key/5', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API key not found');

    await expect(updateApiKeyDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'API key not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));

    await expect(updateApiKeyDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateApiKeyDefinition.name).toBe('update_api_key');
    expect(updateApiKeyDefinition.description).toBe('Update an existing API key in Metabase');
    expect(updateApiKeyDefinition.inputSchema).toEqual(UpdateApiKeyInputSchema);
  });
});
