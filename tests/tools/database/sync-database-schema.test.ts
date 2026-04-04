import { SyncDatabaseSchemaParamsSchema } from '@src/schemas/database';
import { syncDatabaseSchemaDefinition } from '@src/tools/database/sync-database-schema';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('syncDatabaseSchema tool', () => {
  it('should trigger schema sync and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await syncDatabaseSchemaDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/sync_schema');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should return default success message when API returns null', async () => {
    const mockClient = createMockClientWithResponse('post', null);

    const result = await syncDatabaseSchemaDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, {
      success: true,
      message: 'Database schema sync triggered',
    });
  });

  it('should return default success message when API returns undefined', async () => {
    const mockClient = createMockClientWithResponse('post', undefined);

    const result = await syncDatabaseSchemaDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, {
      success: true,
      message: 'Database schema sync triggered',
    });
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/42/sync_schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    await expect(syncDatabaseSchemaDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(syncDatabaseSchemaDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(syncDatabaseSchemaDefinition.name).toBe('sync_database_schema');
    expect(syncDatabaseSchemaDefinition.description).toBe(
      'Sync the schema of a database in Metabase (schema only, not a full resync)',
    );
    expect(syncDatabaseSchemaDefinition.inputSchema).toEqual(SyncDatabaseSchemaParamsSchema);
  });
});
