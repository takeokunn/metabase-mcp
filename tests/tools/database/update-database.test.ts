import type { MetabaseClient } from '@src/client';
import { updateDatabaseDefinition } from '@src/tools/database/update-database';
import { describe, expect, it, vi } from 'vitest';

describe('updateDatabase tool', () => {
  it('should update a database and return formatted MCP response', async () => {
    const mockResponse = {
      id: 1,
      name: 'Updated Database',
      engine: 'postgres',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
      name: 'Updated Database',
      details: { host: 'newhost', port: 5432 },
    };

    const result = await updateDatabaseDefinition.handler(mockClient, input);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.put).toHaveBeenCalledWith('/api/database/1', {
      name: 'Updated Database',
      details: { host: 'newhost', port: 5432 },
    });
  });

  it('should handle partial updates', async () => {
    const mockResponse = { id: 1, name: 'Renamed DB', engine: 'postgres' };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const input = {
      id: 1,
      name: 'Renamed DB',
    };

    await updateDatabaseDefinition.handler(mockClient, input);

    expect(mockClient.put).toHaveBeenCalledWith('/api/database/1', {
      name: 'Renamed DB',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    const input = {
      id: 999,
      name: 'Test',
    };

    await expect(updateDatabaseDefinition.handler(mockClient, input)).rejects.toThrow(
      'Database not found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDatabaseDefinition.name).toBe('update_database');
    expect(updateDatabaseDefinition.description).toBe(
      'Update an existing database connection configuration in Metabase',
    );
    expect(updateDatabaseDefinition.inputSchema).toBeDefined();
  });
});
