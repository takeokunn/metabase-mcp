import { getSlackAppInfoDefinition } from '@src/tools/slack/get-slack-app-info';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSlackAppInfo tool', () => {
  it('should have EE annotation in description', () => {
    expect(getSlackAppInfoDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should return formatted MCP response', async () => {
    const mockResult = { app_id: 'A123456', team_id: 'T123456', team_name: 'My Workspace' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getSlackAppInfoDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/slack/app-info');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getSlackAppInfoDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getSlackAppInfoDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getSlackAppInfoDefinition.name).toBe('get_slack_app_info');
  });
});
