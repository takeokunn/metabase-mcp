import type { MetabaseClient } from '@src/client';
import { GetFieldInputSchema } from '@src/schemas/field';
import { getFieldDefinition } from '@src/tools/field/get-field';
import { describe, expect, it, vi } from 'vitest';

describe('getField tool', () => {
  it('should return formatted MCP response with field data', async () => {
    const mockField = {
      id: 1,
      name: 'email',
      display_name: 'Email Address',
      base_type: 'type/Text',
      semantic_type: 'type/Email',
      table_id: 5,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockField),
    } as unknown as MetabaseClient;

    const result = await getFieldDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockField);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with minimal data', async () => {
    const mockField = {
      id: 42,
      name: 'status',
      base_type: 'type/Text',
      table_id: 10,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockField),
    } as unknown as MetabaseClient;

    const result = await getFieldDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockField);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(getFieldDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getFieldDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldDefinition.name).toBe('get_field');
    expect(getFieldDefinition.description).toBe(
      'Get details of a specific field by ID from Metabase',
    );
    expect(getFieldDefinition.inputSchema).toEqual(GetFieldInputSchema);
  });
});
