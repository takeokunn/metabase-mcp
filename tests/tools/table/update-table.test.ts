import type { MetabaseClient } from '@src/client';
import { UpdateTableInputSchema } from '@src/schemas/table';
import { updateTableDefinition } from '@src/tools/table/update-table';
import { describe, expect, it, vi } from 'vitest';

describe('updateTable tool', () => {
  it('should return formatted MCP response after updating table', async () => {
    const mockUpdatedTable = {
      id: 1,
      name: 'users',
      display_name: 'Application Users',
      description: 'Updated description',
      db_id: 1,
      schema: 'public',
      visibility_type: null,
      active: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 1,
      display_name: 'Application Users',
      description: 'Updated description',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedTable);
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/1', {
      display_name: 'Application Users',
      description: 'Updated description',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update only display_name', async () => {
    const mockUpdatedTable = {
      id: 5,
      name: 'orders',
      display_name: 'Customer Orders',
      db_id: 2,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 5,
      display_name: 'Customer Orders',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedTable);
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/5', {
      display_name: 'Customer Orders',
    });
  });

  it('should update visibility_type to hidden', async () => {
    const mockUpdatedTable = {
      id: 10,
      name: '_internal_logs',
      display_name: 'Internal Logs',
      db_id: 1,
      visibility_type: 'hidden',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 10,
      visibility_type: 'hidden',
    });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.visibility_type).toBe('hidden');
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/10', {
      visibility_type: 'hidden',
    });
  });

  it('should update visibility_type to technical', async () => {
    const mockUpdatedTable = {
      id: 15,
      name: 'system_metadata',
      visibility_type: 'technical',
      db_id: 1,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 15,
      visibility_type: 'technical',
    });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.visibility_type).toBe('technical');
  });

  it('should clear description by setting to null', async () => {
    const mockUpdatedTable = {
      id: 3,
      name: 'products',
      description: null,
      db_id: 1,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 3,
      description: null,
    });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.description).toBeNull();
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/3', {
      description: null,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedTable = {
      id: 7,
      name: 'transactions',
      display_name: 'Financial Transactions',
      description: 'All financial transactions',
      visibility_type: 'normal',
      db_id: 3,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedTable),
    } as unknown as MetabaseClient;

    const result = await updateTableDefinition.handler(mockClient, {
      id: 7,
      display_name: 'Financial Transactions',
      description: 'All financial transactions',
      visibility_type: 'normal',
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/7', {
      display_name: 'Financial Transactions',
      description: 'All financial transactions',
      visibility_type: 'normal',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Table not found')),
    } as unknown as MetabaseClient;

    await expect(
      updateTableDefinition.handler(mockClient, { id: 999, display_name: 'Test' }),
    ).rejects.toThrow('Table not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/999', { display_name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      updateTableDefinition.handler(mockClient, { id: 1, display_name: 'Test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateTableDefinition.name).toBe('update_table');
    expect(updateTableDefinition.description).toBe(
      'Update a table in Metabase (display name, description, visibility)',
    );
    expect(updateTableDefinition.inputSchema).toEqual(UpdateTableInputSchema);
  });
});
