import type { MetabaseClient } from '@src/client';
import { SearchParamsSchema } from '@src/schemas/search';
import { searchDefinition } from '@src/tools/search/search';
import { describe, expect, it, vi } from 'vitest';

describe('search tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockSearchResults = {
      data: [
        { id: 1, name: 'Sales Dashboard', model: 'dashboard', description: 'Sales metrics' },
        { id: 5, name: 'Sales Report', model: 'card', description: null },
      ],
      total: 2,
      limit: 50,
      offset: 0,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    const result = await searchDefinition.handler(mockClient, { q: 'sales' });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockSearchResults);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search', { q: 'sales' });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty search results', async () => {
    const mockSearchResults = {
      data: [],
      total: 0,
      limit: 50,
      offset: 0,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    const result = await searchDefinition.handler(mockClient, { q: 'nonexistent' });

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.data).toEqual([]);
    expect(parsedResult.total).toBe(0);
  });

  it('should pass models filter when provided', async () => {
    const mockSearchResults = {
      data: [{ id: 1, name: 'Dashboard 1', model: 'dashboard' }],
      total: 1,
      limit: 50,
      offset: 0,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    const result = await searchDefinition.handler(mockClient, {
      q: 'test',
      models: ['dashboard', 'card'],
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/search', {
      q: 'test',
      models: 'dashboard,card',
    });
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockSearchResults);
  });

  it('should pass pagination parameters when provided', async () => {
    const mockSearchResults = {
      data: [{ id: 10, name: 'Result 10', model: 'card' }],
      total: 100,
      limit: 10,
      offset: 20,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    const result = await searchDefinition.handler(mockClient, {
      q: 'query',
      limit: 10,
      offset: 20,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/search', {
      q: 'query',
      limit: 10,
      offset: 20,
    });
    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult.limit).toBe(10);
    expect(parsedResult.offset).toBe(20);
  });

  it('should pass table_db_id filter when provided', async () => {
    const mockSearchResults = {
      data: [{ id: 5, name: 'Users Table', model: 'table', database_id: 3 }],
      total: 1,
      limit: 50,
      offset: 0,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    await searchDefinition.handler(mockClient, {
      q: 'users',
      table_db_id: 3,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/search', {
      q: 'users',
      table_db_id: 3,
    });
  });

  it('should pass collection_id filter when provided', async () => {
    const mockSearchResults = {
      data: [{ id: 1, name: 'Item in Collection', model: 'card' }],
      total: 1,
      limit: 50,
      offset: 0,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    await searchDefinition.handler(mockClient, {
      q: 'report',
      collection_id: 5,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/search', {
      q: 'report',
      collection_id: 5,
    });
  });

  it('should pass all parameters when provided', async () => {
    const mockSearchResults = {
      data: [],
      total: 0,
      limit: 25,
      offset: 50,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockSearchResults),
    } as unknown as MetabaseClient;

    await searchDefinition.handler(mockClient, {
      q: 'complex',
      models: ['card', 'dashboard', 'collection'],
      limit: 25,
      offset: 50,
      table_db_id: 1,
      collection_id: 10,
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/search', {
      q: 'complex',
      models: 'card,dashboard,collection',
      limit: 25,
      offset: 50,
      table_db_id: 1,
      collection_id: 10,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Search failed')),
    } as unknown as MetabaseClient;

    await expect(searchDefinition.handler(mockClient, { q: 'test' })).rejects.toThrow(
      'Search failed',
    );
  });

  it('should propagate authentication errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(searchDefinition.handler(mockClient, { q: 'test' })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchDefinition.name).toBe('search');
    expect(searchDefinition.description).toBe(
      'Search for cards, dashboards, collections, tables, databases, actions, and indexed entities in Metabase',
    );
    expect(searchDefinition.inputSchema).toEqual(SearchParamsSchema);
  });
});
