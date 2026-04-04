import { GetDatabaseIdFieldsParamsSchema } from '@src/schemas/database';
import { getDatabaseIdFieldsDefinition } from '@src/tools/database/get-database-id-fields';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseIdFields tool', () => {
  it('should return formatted MCP response with ID fields', async () => {
    const mockFields = [{ id: 1, name: 'id', base_type: 'type/Integer' }];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await getDatabaseIdFieldsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockFields);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/idfields', {
      include_editable_data_model: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass include_editable_data_model param when provided', async () => {
    const mockFields = [{ id: 1, name: 'id' }];
    const mockClient = createMockClientWithResponse('get', mockFields);

    await getDatabaseIdFieldsDefinition.handler(mockClient, {
      id: 5,
      include_editable_data_model: true,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/5/idfields', {
      include_editable_data_model: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(getDatabaseIdFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseIdFieldsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseIdFieldsDefinition.name).toBe('get_database_id_fields');
    expect(getDatabaseIdFieldsDefinition.description).toBe(
      'Get all ID-type fields for a database in Metabase',
    );
    expect(getDatabaseIdFieldsDefinition.inputSchema).toEqual(GetDatabaseIdFieldsParamsSchema);
  });
});
