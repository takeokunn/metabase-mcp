import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { listDatabaseSchemasDefinition } from '@src/tools/database/list-database-schemas';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDatabaseSchemas tool', () => {
  it('should return formatted MCP response with schemas', async () => {
    const mockSchemas = ['public', 'analytics', 'reporting'];

    const mockClient = createMockClientWithResponse('get', mockSchemas);

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockSchemas);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/schemas');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty schema list', async () => {
    const mockSchemas: string[] = [];

    const mockClient = createMockClientWithResponse('get', mockSchemas);

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/schemas');
  });

  it('should handle single schema', async () => {
    const mockSchemas = ['public'];

    const mockClient = createMockClientWithResponse('get', mockSchemas);

    const result = await listDatabaseSchemasDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, ['public']);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/5/schemas');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(listDatabaseSchemasDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/999/schemas');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listDatabaseSchemasDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listDatabaseSchemasDefinition.name).toBe('list_database_schemas');
    expect(listDatabaseSchemasDefinition.description).toBe(
      'List all schemas in a database from Metabase',
    );
    expect(listDatabaseSchemasDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
