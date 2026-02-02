import type { MetabaseClient } from '@src/client';
import { ListCollectionsParamsSchema } from '@src/schemas/collection';
import { listCollectionsDefinition } from '@src/tools/collection/list-collections';
import { describe, expect, it, vi } from 'vitest';

describe('listCollections tool', () => {
  it('should return formatted MCP response with collections', async () => {
    const mockCollections = [
      { id: 1, name: 'Marketing', description: 'Marketing team dashboards', location: '/' },
      { id: 2, name: 'Sales', description: 'Sales analytics', location: '/' },
      { id: 3, name: 'Engineering', description: null, location: '/1/' },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCollections),
    } as unknown as MetabaseClient;

    const result = await listCollectionsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCollections);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection', { namespace: undefined });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty collections list', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue([]),
    } as unknown as MetabaseClient;

    const result = await listCollectionsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
  });

  it('should pass namespace parameter when provided', async () => {
    const mockCollections = [{ id: 10, name: 'Snippets Collection', location: '/' }];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCollections),
    } as unknown as MetabaseClient;

    const result = await listCollectionsDefinition.handler(mockClient, { namespace: 'snippets' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/collection', { namespace: 'snippets' });
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCollections);
  });

  it('should handle personal collections', async () => {
    const mockCollections = [
      { id: 1, name: 'Shared', location: '/' },
      { id: 100, name: "John's Personal Collection", personal_owner_id: 5, location: '/' },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCollections),
    } as unknown as MetabaseClient;

    const result = await listCollectionsDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toHaveLength(2);
    expect(parsedResult[1].personal_owner_id).toBe(5);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    await expect(listCollectionsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate authentication errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(listCollectionsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCollectionsDefinition.name).toBe('list_collections');
    expect(listCollectionsDefinition.description).toBe(
      'Get list of all collections (folders) in Metabase',
    );
    expect(listCollectionsDefinition.inputSchema).toEqual(ListCollectionsParamsSchema);
  });
});
