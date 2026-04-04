import { createChannelDefinition } from '@src/tools/channel/create-channel';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createChannel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'My Webhook', type: 'http', active: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const input = { name: 'My Webhook', type: 'http', details: { url: 'https://example.com/hook' } };
    const result = await createChannelDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/channel', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      createChannelDefinition.handler(mockClient, { name: 'Test', type: 'http', details: {} }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      createChannelDefinition.handler(mockClient, { name: 'Test', type: 'http', details: {} }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(createChannelDefinition.name).toBe('create_channel');
  });
});
