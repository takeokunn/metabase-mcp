import { ListTableFieldsParamsSchema } from '@src/schemas/table';
import { listTableFieldsDefinition } from '@src/tools/table/list-table-fields';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listTableFields tool', () => {
  it('should return formatted MCP response with table fields', async () => {
    const mockFields = [
      { id: 1, name: 'id', display_name: 'ID', base_type: 'type/Integer', table_id: 1 },
      { id: 2, name: 'name', display_name: 'Name', base_type: 'type/Text', table_id: 1 },
      { id: 3, name: 'email', display_name: 'Email', base_type: 'type/Text', table_id: 1 },
    ];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockFields);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1/fields');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle table with many fields', async () => {
    const mockFields = [
      { id: 1, name: 'id', base_type: 'type/Integer', table_id: 5 },
      { id: 2, name: 'created_at', base_type: 'type/DateTime', table_id: 5 },
      { id: 3, name: 'updated_at', base_type: 'type/DateTime', table_id: 5 },
      { id: 4, name: 'user_id', base_type: 'type/Integer', table_id: 5 },
      { id: 5, name: 'product_id', base_type: 'type/Integer', table_id: 5 },
      { id: 6, name: 'quantity', base_type: 'type/Integer', table_id: 5 },
      { id: 7, name: 'total_price', base_type: 'type/Decimal', table_id: 5 },
      { id: 8, name: 'status', base_type: 'type/Text', table_id: 5 },
    ];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockFields);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/fields');
  });

  it('should handle empty fields list', async () => {
    const mockFields: unknown[] = [];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockFields);
  });

  it('should handle fields with various data types', async () => {
    const mockFields = [
      { id: 1, name: 'id', base_type: 'type/BigInteger', table_id: 3 },
      { id: 2, name: 'amount', base_type: 'type/Decimal', table_id: 3 },
      { id: 3, name: 'is_active', base_type: 'type/Boolean', table_id: 3 },
      { id: 4, name: 'data', base_type: 'type/JSON', table_id: 3 },
      { id: 5, name: 'uuid', base_type: 'type/UUID', table_id: 3 },
    ];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 3 });

    expectMcpContent(result, mockFields);
  });

  it('should handle fields with semantic types', async () => {
    const mockFields = [
      {
        id: 1,
        name: 'email',
        base_type: 'type/Text',
        semantic_type: 'type/Email',
        table_id: 2,
      },
      {
        id: 2,
        name: 'created_at',
        base_type: 'type/DateTime',
        semantic_type: 'type/CreationTimestamp',
        table_id: 2,
      },
    ];

    const mockClient = createMockClientWithResponse('get', mockFields);

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 2 });

    expectMcpContent(result, mockFields);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Table not found');

    await expect(listTableFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/999/fields');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

    await expect(listTableFieldsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listTableFieldsDefinition.name).toBe('list_table_fields');
    expect(listTableFieldsDefinition.description).toBe('List all fields for a table from Metabase');
    expect(listTableFieldsDefinition.inputSchema).toEqual(ListTableFieldsParamsSchema);
  });
});
