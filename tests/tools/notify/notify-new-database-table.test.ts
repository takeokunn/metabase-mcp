import { NotifyNewDatabaseTableInputSchema } from '@src/schemas/notify';
import { notifyNewDatabaseTableDefinition } from '@src/tools/notify/notify-new-database-table';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('notifyNewDatabaseTable tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { success: true };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await notifyNewDatabaseTableDefinition.handler(mockClient, {
      id: 1,
      table_id: 42,
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/notify/db/1/new-table', { table_id: 42 });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should use the correct database ID in the URL', async () => {
    const mockClient = createMockClientWithResponse('post', { success: true });
    await notifyNewDatabaseTableDefinition.handler(mockClient, { id: 99, table_id: 5 });
    expect(mockClient.post).toHaveBeenCalledWith('/api/notify/db/99/new-table', { table_id: 5 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      notifyNewDatabaseTableDefinition.handler(mockClient, { id: 999, table_id: 1 }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      notifyNewDatabaseTableDefinition.handler(mockClient, { id: 1, table_id: 1 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(notifyNewDatabaseTableDefinition.name).toBe('notify_new_database_table');
    expect(notifyNewDatabaseTableDefinition.description).toBe(
      'Notify Metabase of a new table in a database',
    );
    expect(notifyNewDatabaseTableDefinition.inputSchema).toEqual(NotifyNewDatabaseTableInputSchema);
  });
});
