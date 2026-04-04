import { listSettingsDefinition } from '@src/tools/setting/list-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listSettings tool', () => {
  it('should return formatted MCP response with settings', async () => {
    const mockSettings = [
      { key: 'site-name', value: 'My Metabase' },
      { key: 'site-locale', value: 'en' },
    ];
    const mockClient = createMockClientWithResponse('get', mockSettings);

    const result = await listSettingsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockSettings);
    expect(mockClient.get).toHaveBeenCalledWith('/api/setting');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty settings list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await listSettingsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(listSettingsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(listSettingsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(listSettingsDefinition.name).toBe('list_settings');
    expect(listSettingsDefinition.description).toBe(
      'List all settings in Metabase (admin only)',
    );
    expect(listSettingsDefinition.inputSchema).toEqual({});
  });
});
