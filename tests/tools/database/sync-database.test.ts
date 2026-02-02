import type { MetabaseClient } from '@src/client';
import { GetDatabaseParamsSchema } from '@src/schemas/database';
import { syncDatabaseDefinition } from '@src/tools/database/sync-database';
import { describe, expect, it, vi } from 'vitest';

describe('syncDatabase tool', () => {
  it('should trigger sync and return formatted MCP response', async () => {
    const mockResponse = { success: true };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockResponse),
    } as unknown as MetabaseClient;

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/sync');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should return default success message when API returns null', async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(null),
    } as unknown as MetabaseClient;

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 1 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual({
      success: true,
      message: 'Database sync triggered',
    });
  });

  it('should return default success message when API returns undefined', async () => {
    const mockClient = {
      post: vi.fn().mockResolvedValue(undefined),
    } as unknown as MetabaseClient;

    const result = await syncDatabaseDefinition.handler(mockClient, { id: 42 });

    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual({
      success: true,
      message: 'Database sync triggered',
    });
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/42/sync');
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Database not found')),
    } as unknown as MetabaseClient;

    await expect(syncDatabaseDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Database not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/999/sync');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(syncDatabaseDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(syncDatabaseDefinition.name).toBe('sync_database');
    expect(syncDatabaseDefinition.description).toBe('Trigger a sync for a database in Metabase');
    expect(syncDatabaseDefinition.inputSchema).toEqual(GetDatabaseParamsSchema);
  });
});
