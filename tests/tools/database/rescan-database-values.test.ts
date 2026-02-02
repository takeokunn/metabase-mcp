import type { MetabaseClient } from '@src/client';
import { rescanDatabaseValuesDefinition } from '@src/tools/database/rescan-database-values';
import { describe, expect, it, vi } from 'vitest';

describe('rescanDatabaseValues tool', () => {
  it('should trigger rescan and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 1 };

    const result = await rescanDatabaseValuesDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/rescan_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    const input = { id: 999 };

    await expect(rescanDatabaseValuesDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(rescanDatabaseValuesDefinition.name).toBe('rescan_database_values');
    expect(rescanDatabaseValuesDefinition.description).toBe(
      'Rescan field values for a database in Metabase',
    );
    expect(rescanDatabaseValuesDefinition.inputSchema).toBeDefined();
  });
});
