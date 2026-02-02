import { describe, it, expect, vi } from 'vitest';
import { getDatabases } from '../../src/tools/get-databases.js';
import type { MetabaseClient } from '../../src/client.js';

describe('getDatabases tool', () => {
  it('should return formatted MCP response with databases', async () => {
    const mockDatabases = [
      { id: 1, name: 'Production DB', engine: 'postgres' },
      { id: 2, name: 'Analytics DB', engine: 'bigquery' },
    ];

    const mockClient = {
      getDatabases: vi.fn().mockResolvedValue(mockDatabases),
    } as unknown as MetabaseClient;

    const result = await getDatabases(mockClient);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse(result.content[0].text)).toEqual(mockDatabases);
    expect(mockClient.getDatabases).toHaveBeenCalledOnce();
  });

  it('should handle empty database list', async () => {
    const mockClient = {
      getDatabases: vi.fn().mockResolvedValue([]),
    } as unknown as MetabaseClient;

    const result = await getDatabases(mockClient);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse(result.content[0].text)).toEqual([]);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      getDatabases: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    await expect(getDatabases(mockClient)).rejects.toThrow('API error');
  });
});
