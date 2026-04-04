import { GetDatabaseSyncableSchemasParamsSchema } from '@src/schemas/database';
import { getDatabaseSyncableSchemasDefinition } from '@src/tools/database/get-database-syncable-schemas';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseSyncableSchemas tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = ['public', 'analytics'];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getDatabaseSyncableSchemasDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/syncable_schemas');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getDatabaseSyncableSchemasDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getDatabaseSyncableSchemasDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseSyncableSchemasDefinition.name).toBe('get_database_syncable_schemas');
    expect(getDatabaseSyncableSchemasDefinition.description).toBe('Get syncable schemas for a database in Metabase');
    expect(getDatabaseSyncableSchemasDefinition.inputSchema).toEqual(GetDatabaseSyncableSchemasParamsSchema);
  });
});
