import { testChannelDefinition } from '@src/tools/channel/test-channel';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('testChannel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const input = { type: 'http', details: { url: 'https://example.com/hook' } };
    const result = await testChannelDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/channel/test', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      testChannelDefinition.handler(mockClient, { type: 'http', details: {} }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      testChannelDefinition.handler(mockClient, { type: 'http', details: {} }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(testChannelDefinition.name).toBe('test_channel');
  });
});
