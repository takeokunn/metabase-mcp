import { GetDatabaseAvailableSettingsParamsSchema } from '@src/schemas/database';
import { getDatabaseAvailableSettingsDefinition } from '@src/tools/database/get-database-available-settings';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseAvailableSettings tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { settings: [{ key: 'max_connections', value: 10 }] };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getDatabaseAvailableSettingsDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/settings-available');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getDatabaseAvailableSettingsDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getDatabaseAvailableSettingsDefinition.handler(mockClient, { id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseAvailableSettingsDefinition.name).toBe('get_database_available_settings');
    expect(getDatabaseAvailableSettingsDefinition.description).toBe(
      'Get available settings for a database connection in Metabase',
    );
    expect(getDatabaseAvailableSettingsDefinition.inputSchema).toEqual(
      GetDatabaseAvailableSettingsParamsSchema,
    );
  });
});
