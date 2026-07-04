import { getSlackAppInfoDefinition } from '@src/tools/slack/get-slack-app-info';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSlackAppInfo tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Slack 1' });
    const result = await getSlackAppInfoDefinition.handler(mockClient, {});
    expectMcpContent(result, { id: 1, name: 'Slack 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/slack/app-info');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getSlackAppInfoDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getSlackAppInfoDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getSlackAppInfoDefinition.name).toBe('get_slack_app_info');
    expect(getSlackAppInfoDefinition.description).toBe(
      'Get information about the configured Slack app in Metabase',
    );
    expect(getSlackAppInfoDefinition.inputSchema).toEqual({});
  });
});
