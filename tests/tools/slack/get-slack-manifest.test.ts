import { getSlackManifestDefinition } from '@src/tools/slack/get-slack-manifest';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSlackManifest tool', () => {
  it('should have EE annotation in description', () => {
    expect(getSlackManifestDefinition.description).toContain('[Requires Metabase Pro]');
  });

  it('should return formatted MCP response', async () => {
    const mockResult = { display_information: { name: 'Metabase' }, features: {} };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getSlackManifestDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/slack/manifest');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getSlackManifestDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getSlackManifestDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getSlackManifestDefinition.name).toBe('get_slack_manifest');
  });
});
