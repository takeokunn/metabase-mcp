import { DeleteDatabaseSchemaParamsSchema } from '@src/schemas/database';
import { deleteDatabaseSchemaDefinition } from '@src/tools/database/delete-database-schema';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDatabaseSchema tool', () => {
  it('should delete schema and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = createMockClientWithResponse('delete', mockResponse);

    const result = await deleteDatabaseSchemaDefinition.handler(mockClient, {
      id: 1,
      schema: 'public',
    });

    expectMcpContent(result, mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/database/1/schema/public');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should return default success message when API returns null', async () => {
    const mockClient = createMockClientWithResponse('delete', null);

    const result = await deleteDatabaseSchemaDefinition.handler(mockClient, {
      id: 1,
      schema: 'public',
    });

    expectMcpContent(result, { success: true, message: 'Database schema deleted' });
  });

  it('should URL-encode schema names with special characters', async () => {
    const mockClient = createMockClientWithResponse('delete', { success: true });

    await deleteDatabaseSchemaDefinition.handler(mockClient, { id: 2, schema: 'my schema' });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/database/2/schema/my%20schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Schema not found');

    await expect(
      deleteDatabaseSchemaDefinition.handler(mockClient, { id: 999, schema: 'missing' }),
    ).rejects.toThrow('Schema not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));

    await expect(
      deleteDatabaseSchemaDefinition.handler(mockClient, { id: 1, schema: 'public' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDatabaseSchemaDefinition.name).toBe('delete_database_schema');
    expect(deleteDatabaseSchemaDefinition.description).toBe(
      'Delete a schema from a database in Metabase',
    );
    expect(deleteDatabaseSchemaDefinition.inputSchema).toEqual(DeleteDatabaseSchemaParamsSchema);
  });
});
