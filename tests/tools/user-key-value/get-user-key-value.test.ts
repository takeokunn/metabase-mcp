import { getUserKeyValueDefinition } from '@src/tools/user-key-value/get-user-key-value';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getUserKeyValue tool', () => {
  const input = { namespace: 'ui-settings', key: 'sidebar-collapsed' };

  it('should return formatted MCP response with value', async () => {
    const mockResult = { value: true };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getUserKeyValueDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL with namespace and key in path', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getUserKeyValueDefinition.handler(mockClient, input);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user-key-value/namespace/ui-settings/key/sidebar-collapsed');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });
});
