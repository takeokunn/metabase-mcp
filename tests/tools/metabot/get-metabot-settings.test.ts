import { getMetabotSettingsDefinition } from '@src/tools/metabot/get-metabot-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getMetabotSettings tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { enabled: true, model: 'gpt-4' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getMetabotSettingsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(getMetabotSettingsDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getMetabotSettingsDefinition.handler(mockClient, {});
    expect(mockClient.get).toHaveBeenCalledWith('/api/metabot/settings');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getMetabotSettingsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getMetabotSettingsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });
});
