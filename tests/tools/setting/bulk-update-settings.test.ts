import { BulkUpdateSettingsInputSchema } from '@src/schemas/setting';
import { bulkUpdateSettingsDefinition } from '@src/tools/setting/bulk-update-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('bulkUpdateSettings tool', () => {
  it('should update multiple settings and return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('put', mockResult);
    const settings = { 'site-name': 'Acme Corp', 'site-locale': 'en' };

    const result = await bulkUpdateSettingsDefinition.handler(mockClient, { settings });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/setting', settings);
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should handle empty settings map', async () => {
    const mockClient = createMockClientWithResponse('put', {});

    await bulkUpdateSettingsDefinition.handler(mockClient, { settings: {} });

    expect(mockClient.put).toHaveBeenCalledWith('/api/setting', {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'API error');

    await expect(
      bulkUpdateSettingsDefinition.handler(mockClient, { settings: { 'site-name': 'x' } }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      bulkUpdateSettingsDefinition.handler(mockClient, { settings: { 'site-name': 'x' } }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(bulkUpdateSettingsDefinition.name).toBe('bulk_update_settings');
    expect(bulkUpdateSettingsDefinition.inputSchema).toEqual(BulkUpdateSettingsInputSchema);
  });
});
