import { GetDatabaseFieldsParamsSchema } from '@src/schemas/database';
import { getDatabaseFieldsDefinition } from '@src/tools/database/get-database-fields';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseFields tool', () => {
  it('should return formatted MCP response with fields', async () => {
    const mockFields = [
      { id: 1, name: 'id', base_type: 'type/Integer' },
      { id: 2, name: 'name', base_type: 'type/Text' },
    ];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await getDatabaseFieldsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockFields);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/fields');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty fields list', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    const result = await getDatabaseFieldsDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, []);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/42/fields');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseFieldsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseFieldsDefinition.name).toBe('get_database_fields');
    expect(getDatabaseFieldsDefinition.description).toBe(
      'Get all fields for a database in Metabase',
    );
    expect(getDatabaseFieldsDefinition.inputSchema).toEqual(GetDatabaseFieldsParamsSchema);
  });
});
