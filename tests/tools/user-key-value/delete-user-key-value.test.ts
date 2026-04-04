import { deleteUserKeyValueDefinition } from '@src/tools/user-key-value/delete-user-key-value';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteUserKeyValue tool', () => {
  const input = { namespace: 'ui-settings', key: 'sidebar-collapsed' };

  it('should return formatted MCP response', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);
    const result = await deleteUserKeyValueDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL with namespace and key in path', async () => {
    const mockClient = createMockClientWithResponse('delete', null);
    await deleteUserKeyValueDefinition.handler(mockClient, input);
    expect(mockClient.delete).toHaveBeenCalledWith(
      '/api/user-key-value/namespace/ui-settings/key/sidebar-collapsed',
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'API error');
    await expect(deleteUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Not Found', 404));
    await expect(deleteUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });
});
