import { GetDatabaseVirtualSchemaParamsSchema } from '@src/schemas/database';
import { getDatabaseVirtualSchemaDefinition } from '@src/tools/database/get-database-virtual-schema';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseVirtualSchema tool', () => {
  it('should return formatted MCP response with virtual schema tables', async () => {
    const mockTables = [{ id: 'card__1', name: 'Revenue Report' }];

    const mockClient = createMockClientWithResponse('get', mockTables);

    const result = await getDatabaseVirtualSchemaDefinition.handler(mockClient, {
      id: 1,
      schema: 'analytics',
    });

    expectMcpContent(result, mockTables);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/datasets/analytics');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should URL-encode schema names with special characters', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await getDatabaseVirtualSchemaDefinition.handler(mockClient, {
      id: 2,
      schema: 'my schema',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/2/datasets/my%20schema');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(
      getDatabaseVirtualSchemaDefinition.handler(mockClient, { id: 999, schema: 'analytics' }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(
      getDatabaseVirtualSchemaDefinition.handler(mockClient, { id: 1, schema: 'analytics' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseVirtualSchemaDefinition.name).toBe('get_database_virtual_schema');
    expect(getDatabaseVirtualSchemaDefinition.description).toBe(
      'Get a virtual schema (datasets) for a database in Metabase',
    );
    expect(getDatabaseVirtualSchemaDefinition.inputSchema).toEqual(
      GetDatabaseVirtualSchemaParamsSchema,
    );
  });
});
