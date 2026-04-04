import { listUserNamespaceValuesDefinition } from '@src/tools/user-key-value/list-user-namespace-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listUserNamespaceValues tool', () => {
  const input = { namespace: 'ui-settings' };

  it('should return formatted MCP response with all key-value pairs', async () => {
    const mockResult = { 'sidebar-collapsed': true, theme: 'dark' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listUserNamespaceValuesDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL with namespace in path', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await listUserNamespaceValuesDefinition.handler(mockClient, input);
    expect(mockClient.get).toHaveBeenCalledWith('/api/user-key-value/namespace/ui-settings');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listUserNamespaceValuesDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listUserNamespaceValuesDefinition.handler(mockClient, input)).rejects.toThrow('Unauthorized');
  });
});
