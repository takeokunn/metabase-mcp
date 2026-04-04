import { listChannelsDefinition } from '@src/tools/channel/list-channels';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listChannels tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'Slack Channel', type: 'slack', active: true }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listChannelsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/channel');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listChannelsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listChannelsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listChannelsDefinition.name).toBe('list_channels');
  });
});
