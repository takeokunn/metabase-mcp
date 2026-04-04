import { UpdateSlackSettingsInputSchema } from '@src/schemas/slack';
import { updateSlackSettingsDefinition } from '@src/tools/slack/update-slack-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateSlackSettings tool', () => {
  it('should have EE annotation in description', () => {
    expect(updateSlackSettingsDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const input = { 'slack-token': 'xoxb-token', 'slack-files-channel': '#metabase' };
    const result = await updateSlackSettingsDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/slack/settings', input);
  });

  it('should work with empty input', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const result = await updateSlackSettingsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/slack/settings', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');
    await expect(updateSlackSettingsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));
    await expect(updateSlackSettingsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateSlackSettingsDefinition.name).toBe('update_slack_settings');
    expect(updateSlackSettingsDefinition.inputSchema).toEqual(UpdateSlackSettingsInputSchema);
  });
});
