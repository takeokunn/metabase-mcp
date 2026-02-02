import type { MetabaseClient } from '@src/client';
import { GetFieldRelatedInputSchema } from '@src/schemas/field';
import { getFieldRelatedDefinition } from '@src/tools/field/get-field-related';
import { describe, expect, it, vi } from 'vitest';

describe('getFieldRelated tool', () => {
  it('should return formatted MCP response with related entities', async () => {
    const mockRelated = {
      tables: [
        { id: 1, name: 'users' },
        { id: 2, name: 'orders' },
      ],
      fields: [
        { id: 10, name: 'user_id', table_id: 2 },
        { id: 11, name: 'created_by', table_id: 3 },
      ],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockRelated),
    } as unknown as MetabaseClient;

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockRelated);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/related');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with no related entities', async () => {
    const mockRelated = {
      tables: [],
      fields: [],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockRelated),
    } as unknown as MetabaseClient;

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockRelated);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42/related');
  });

  it('should handle field with only related tables', async () => {
    const mockRelated = {
      tables: [{ id: 5, name: 'products' }],
      fields: [],
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockRelated),
    } as unknown as MetabaseClient;

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 10 });

    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockRelated);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(getFieldRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999/related');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getFieldRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldRelatedDefinition.name).toBe('get_field_related');
    expect(getFieldRelatedDefinition.description).toBe(
      'Get related entities (tables, fields) for a field in Metabase',
    );
    expect(getFieldRelatedDefinition.inputSchema).toEqual(GetFieldRelatedInputSchema);
  });
});
