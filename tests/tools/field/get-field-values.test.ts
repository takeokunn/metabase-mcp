import type { MetabaseClient } from '@src/client';
import { GetFieldValuesInputSchema } from '@src/schemas/field';
import { getFieldValuesDefinition } from '@src/tools/field/get-field-values';
import { describe, expect, it, vi } from 'vitest';

describe('getFieldValues tool', () => {
  it('should return formatted MCP response with field values', async () => {
    const mockFieldValues = {
      field_id: 1,
      values: [
        ['active', 'Active'],
        ['inactive', 'Inactive'],
        ['pending', 'Pending'],
      ],
      has_more_values: false,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFieldValues),
    } as unknown as MetabaseClient;

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with many values', async () => {
    const mockFieldValues = {
      field_id: 42,
      values: Array.from({ length: 100 }, (_, i) => [`value_${i}`, `Value ${i}`]),
      has_more_values: true,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFieldValues),
    } as unknown as MetabaseClient;

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42/values');
  });

  it('should handle field with empty values', async () => {
    const mockFieldValues = {
      field_id: 10,
      values: [],
      has_more_values: false,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockFieldValues),
    } as unknown as MetabaseClient;

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 10 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/10/values');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(getFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999/values');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getFieldValuesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldValuesDefinition.name).toBe('get_field_values');
    expect(getFieldValuesDefinition.description).toBe(
      'Get the cached distinct values for a field from Metabase',
    );
    expect(getFieldValuesDefinition.inputSchema).toEqual(GetFieldValuesInputSchema);
  });
});
