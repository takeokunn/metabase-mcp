import { updateMetabotSettingsDefinition } from '@src/tools/metabot/update-metabot-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateMetabotSettings tool', () => {
  const input = { settings: { enabled: true, model: 'gpt-4' } };

  it('should return formatted MCP response', async () => {
    const mockResult = { enabled: true, model: 'gpt-4' };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateMetabotSettingsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should have EE annotation in description', () => {
    expect(updateMetabotSettingsDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should call correct endpoint with settings', async () => {
    const mockClient = createMockClientWithResponse('put', {});
    await updateMetabotSettingsDefinition.handler(mockClient, input);
    expect(mockClient.put).toHaveBeenCalledWith('/api/metabot/settings', input.settings);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateMetabotSettingsDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(updateMetabotSettingsDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });
});
