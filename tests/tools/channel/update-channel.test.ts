import { updateChannelDefinition } from '@src/tools/channel/update-channel';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateChannel tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'Updated Webhook', type: 'http', active: false };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = { id: 1, name: 'Updated Webhook', active: false };
    const result = await updateChannelDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/channel/1', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateChannelDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Not Found', 404));
    await expect(updateChannelDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateChannelDefinition.name).toBe('update_channel');
  });
});
