import type { MetabaseClient } from '@src/client';
import { discardDatabaseValuesDefinition } from '@src/tools/database/discard-database-values';
import { describe, expect, it, vi } from 'vitest';

describe('discardDatabaseValues tool', () => {
  it('should discard values and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 1 };

    const result = await discardDatabaseValuesDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/discard_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    const input = { id: 999 };

    await expect(discardDatabaseValuesDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(discardDatabaseValuesDefinition.name).toBe('discard_database_values');
    expect(discardDatabaseValuesDefinition.description).toBe(
      'Discard cached field values for a database in Metabase',
    );
    expect(discardDatabaseValuesDefinition.inputSchema).toBeDefined();
  });
});
