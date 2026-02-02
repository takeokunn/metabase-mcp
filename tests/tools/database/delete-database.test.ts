import type { MetabaseClient } from '@src/client';
import { deleteDatabaseDefinition } from '@src/tools/database/delete-database';
import { describe, expect, it, vi } from 'vitest';

describe('deleteDatabase tool', () => {
  it('should delete a database and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      delete: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = { id: 1 };

    const result = await deleteDatabaseDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/database/1');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      delete: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    const input = { id: 999 };

    await expect(deleteDatabaseDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDatabaseDefinition.name).toBe('delete_database');
    expect(deleteDatabaseDefinition.description).toBe('Delete a database connection from Metabase');
    expect(deleteDatabaseDefinition.inputSchema).toBeDefined();
  });
});
