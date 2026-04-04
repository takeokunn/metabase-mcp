import { putUserKeyValueDefinition } from '@src/tools/user-key-value/put-user-key-value';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('putUserKeyValue tool', () => {
  const input = { namespace: 'ui-settings', key: 'theme', value: 'dark' };

  it('should return formatted MCP response', async () => {
    const mockResult = { namespace: 'ui-settings', key: 'theme', value: 'dark' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await putUserKeyValueDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL and pass value as body', async () => {
    const mockClient = createMockClientWithResponse('put', {});
    await putUserKeyValueDefinition.handler(mockClient, input);
    expect(mockClient.put).toHaveBeenCalledWith(
      '/api/user-key-value/namespace/ui-settings/key/theme',
      'dark',
    );
  });

  it('should handle object values', async () => {
    const inputWithObject = {
      namespace: 'prefs',
      key: 'filters',
      value: { active: true, count: 5 },
    };
    const mockClient = createMockClientWithResponse('put', {});
    await putUserKeyValueDefinition.handler(mockClient, inputWithObject);
    expect(mockClient.put).toHaveBeenCalledWith('/api/user-key-value/namespace/prefs/key/filters', {
      active: true,
      count: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(putUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(putUserKeyValueDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });
});
