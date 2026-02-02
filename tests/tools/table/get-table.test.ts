import type { MetabaseClient } from '@src/client';
import { GetTableParamsSchema } from '@src/schemas/table';
import { getTableDefinition } from '@src/tools/table/get-table';
import { describe, expect, it, vi } from 'vitest';

describe('getTable tool', () => {
  it('should return formatted MCP response with table data', async () => {
    const mockTable = {
      id: 1,
      name: 'users',
      display_name: 'Users',
      description: 'Application users table',
      db_id: 1,
      schema: 'public',
      visibility_type: null,
      active: true,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTable),
    } as unknown as MetabaseClient;

    const result = await getTableDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockTable);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle table with minimal data', async () => {
    const mockTable = {
      id: 42,
      name: 'orders',
      db_id: 2,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTable),
    } as unknown as MetabaseClient;

    const result = await getTableDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockTable);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/42');
  });

  it('should handle hidden table', async () => {
    const mockTable = {
      id: 10,
      name: '_internal_logs',
      display_name: 'Internal Logs',
      db_id: 1,
      schema: 'internal',
      visibility_type: 'hidden',
      active: true,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTable),
    } as unknown as MetabaseClient;

    const result = await getTableDefinition.handler(mockClient, { id: 10 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.visibility_type).toBe('hidden');
  });

  it('should handle table with fields data', async () => {
    const mockTable = {
      id: 5,
      name: 'products',
      db_id: 1,
      fields: [
        { id: 1, name: 'id', base_type: 'type/Integer' },
        { id: 2, name: 'name', base_type: 'type/Text' },
        { id: 3, name: 'price', base_type: 'type/Decimal' },
      ],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockTable),
    } as unknown as MetabaseClient;

    const result = await getTableDefinition.handler(mockClient, { id: 5 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.fields).toHaveLength(3);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Table not found')),
    } as unknown as MetabaseClient;

    await expect(getTableDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getTableDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getTableDefinition.name).toBe('get_table');
    expect(getTableDefinition.description).toBe('Get a single table by ID from Metabase');
    expect(getTableDefinition.inputSchema).toEqual(GetTableParamsSchema);
  });
});
