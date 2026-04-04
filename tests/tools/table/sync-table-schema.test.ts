import { TableIdInputSchema } from '@src/schemas/table';
import { syncTableSchemaDefinition } from '@src/tools/table/sync-table-schema';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('syncTableSchema tool', () => {
  it('should return formatted MCP response after syncing table schema', async () => {
    const mockResult = { status: 'success' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await syncTableSchemaDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/5/sync_schema');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should sync schema for different table ID', async () => {
    const mockClient = createMockClientWithResponse('post', { status: 'success' });

    await syncTableSchemaDefinition.handler(mockClient, { id: 10 });

    expect(mockClient.post).toHaveBeenCalledWith('/api/table/10/sync_schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Table not found');

    await expect(syncTableSchemaDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(syncTableSchemaDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(syncTableSchemaDefinition.name).toBe('sync_table_schema');
    expect(syncTableSchemaDefinition.description).toBe('Sync the schema for a table in Metabase');
    expect(syncTableSchemaDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
