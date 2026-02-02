import type { MetabaseClient } from '@src/client';
import { TableIdInputSchema } from '@src/schemas/table';
import { resyncTableFieldsDefinition } from '@src/tools/table/resync-table-fields';
import { describe, expect, it, vi } from 'vitest';

describe('resyncTableFields tool', () => {
  it('should return formatted MCP response after resyncing table fields', async () => {
    const mockResult = { success: true };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/1/rescan_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle resync for different table IDs', async () => {
    const mockResult = { success: true };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/42/rescan_values');
  });

  it('should handle empty response from API', async () => {
    const mockResult = {};

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 5 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toEqual({});
  });

  it('should handle null response from API', async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(null),
    } as unknown as MetabaseClient;

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 10 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toBeNull();
  });

  it('should handle response with message', async () => {
    const mockResult = {
      success: true,
      message: 'Rescan initiated for table',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 15 });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.success).toBe(true);
    expect(parsedResult.message).toBe('Rescan initiated for table');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Table not found')),
    } as unknown as MetabaseClient;

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/999/rescan_values');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should handle server error during resync', async () => {
    const apiError = new Error('Internal Server Error');
    (apiError as Error & { status?: number }).status = 500;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 3 })).rejects.toThrow(
      'Internal Server Error',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(resyncTableFieldsDefinition.name).toBe('resync_table_fields');
    expect(resyncTableFieldsDefinition.description).toBe(
      'Rescan field values for a table in Metabase',
    );
    expect(resyncTableFieldsDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
