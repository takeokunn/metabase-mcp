import type { MetabaseClient } from '@src/client';
import { UpdateFieldValuesInputSchema } from '@src/schemas/field';
import { updateFieldValuesDefinition } from '@src/tools/field/update-field-values';
import { describe, expect, it, vi } from 'vitest';

describe('updateFieldValues tool', () => {
  it('should return formatted MCP response after updating field values', async () => {
    const mockResponse = {
      field_id: 1,
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 1,
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/values', {
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle update with numeric values', async () => {
    const mockResponse = {
      field_id: 42,
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 42,
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/values', {
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    });
  });

  it('should handle empty values array', async () => {
    const mockResponse = {
      field_id: 10,
      values: [],
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 10,
      values: [],
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/10/values', { values: [] });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(
      updateFieldValuesDefinition.handler(mockClient, {
        id: 999,
        values: [['test', 'Test']],
      }),
    ).rejects.toThrow('Field not found');
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/values', {
      values: [['test', 'Test']],
    });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      updateFieldValuesDefinition.handler(mockClient, {
        id: 1,
        values: [['test', 'Test']],
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateFieldValuesDefinition.name).toBe('update_field_values');
    expect(updateFieldValuesDefinition.description).toBe(
      'Update the human-readable values for a field in Metabase',
    );
    expect(updateFieldValuesDefinition.inputSchema).toEqual(UpdateFieldValuesInputSchema);
  });
});
