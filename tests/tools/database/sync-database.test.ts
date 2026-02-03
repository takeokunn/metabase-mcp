import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { syncDatabaseDefinition } from '@src/tools/database/sync-database';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('syncDatabase tool', () => {
  it('should trigger sync and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/sync');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should return default success message when API returns null', async () => {
    const mockClient = createMockClientWithResponse('post', null);

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, {
      success: true,
      message: 'Database sync triggered',
    });
  });

  it('should return default success message when API returns undefined', async () => {
    const mockClient = createMockClientWithResponse('post', undefined);

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, {
      success: true,
      message: 'Database sync triggered',
    });
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/42/sync');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    await expect(syncDatabaseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/999/sync');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(syncDatabaseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(syncDatabaseDefinition.name).toBe('sync_database');
    expect(syncDatabaseDefinition.description).toBe('Trigger a sync for a database in Metabase');
    expect(syncDatabaseDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
