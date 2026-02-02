import type { MetabaseClient } from '@src/client';
import { ListTableFieldsParamsSchema } from '@src/schemas/table';
import { listTableFieldsDefinition } from '@src/tools/table/list-table-fields';
import { describe, expect, it, vi } from 'vitest';

describe('listTableFields tool', () => {
  it('should return formatted MCP response with table fields', async () => {
    const mockFields = [
      { id: 1, name: 'id', display_name: 'ID', base_type: 'type/Integer', table_id: 1 },
      { id: 2, name: 'name', display_name: 'Name', base_type: 'type/Text', table_id: 1 },
      { id: 3, name: 'email', display_name: 'Email', base_type: 'type/Text', table_id: 1 },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFields),
    } as unknown as MetabaseClient;

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockFields);
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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFields),
    } as unknown as MetabaseClient;

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 5 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toHaveLength(8);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/fields');
  });

  it('should handle empty fields list', async () => {
    const mockFields: unknown[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFields),
    } as unknown as MetabaseClient;

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 10 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toEqual([]);
    expect(parsedResult).toHaveLength(0);
  });

  it('should handle fields with various data types', async () => {
    const mockFields = [
      { id: 1, name: 'id', base_type: 'type/BigInteger', table_id: 3 },
      { id: 2, name: 'amount', base_type: 'type/Decimal', table_id: 3 },
      { id: 3, name: 'is_active', base_type: 'type/Boolean', table_id: 3 },
      { id: 4, name: 'data', base_type: 'type/JSON', table_id: 3 },
      { id: 5, name: 'uuid', base_type: 'type/UUID', table_id: 3 },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFields),
    } as unknown as MetabaseClient;

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 3 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult[0].base_type).toBe('type/BigInteger');
    expect(parsedResult[1].base_type).toBe('type/Decimal');
    expect(parsedResult[2].base_type).toBe('type/Boolean');
    expect(parsedResult[3].base_type).toBe('type/JSON');
    expect(parsedResult[4].base_type).toBe('type/UUID');
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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFields),
    } as unknown as MetabaseClient;

    const result = await listTableFieldsDefinition.handler(mockClient, { id: 2 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult[0].semantic_type).toBe('type/Email');
    expect(parsedResult[1].semantic_type).toBe('type/CreationTimestamp');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Table not found')),
    } as unknown as MetabaseClient;

    await expect(listTableFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/999/fields');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
