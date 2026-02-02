import type { MetabaseClient } from '@src/client';
import { GetCollectionParamsSchema } from '@src/schemas/collection';
import { getCollectionDefinition } from '@src/tools/collection/get-collection';
import { describe, expect, it, vi } from 'vitest';

describe('getCollection tool', () => {
  it('should return formatted MCP response with collection data', async () => {
    const mockCollection = {
      id: 5,
      name: 'Marketing Reports',
      description: 'Collection for marketing team',
      location: '/5/',
      personal_owner_id: null,
      archived: false,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCollection),
    } as unknown as MetabaseClient;

    const result = await getCollectionDefinition.handler(mockClient, { id: 5 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/5');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle root collection with string id', async () => {
    const mockRootCollection = {
      id: 'root',
      name: 'Our analytics',
      description: null,
      location: '/',
      personal_owner_id: null,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockRootCollection),
    } as unknown as MetabaseClient;

    const result = await getCollectionDefinition.handler(mockClient, { id: 'root' });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockRootCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/root');
  });

  it('should handle collection with minimal data', async () => {
    const mockCollection = {
      id: 10,
      name: 'Simple Collection',
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCollection),
    } as unknown as MetabaseClient;

    const result = await getCollectionDefinition.handler(mockClient, { id: 10 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCollection);
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/10');
  });

  it('should handle personal collection', async () => {
    const mockPersonalCollection = {
      id: 15,
      name: "John's Collection",
      description: null,
      location: '/15/',
      personal_owner_id: 1,
    };

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockPersonalCollection),
    } as unknown as MetabaseClient;

    const result = await getCollectionDefinition.handler(mockClient, { id: 15 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(
      mockPersonalCollection,
    );
  });

  it('should propagate client errors for non-existent collection', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Collection not found')),
    } as unknown as MetabaseClient;

    await expect(getCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/collection/999');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCollectionDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(getCollectionDefinition.handler(mockClient, { id: 5 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCollectionDefinition.name).toBe('get_collection');
    expect(getCollectionDefinition.description).toBe(
      'Get a single collection by ID from Metabase (supports "root" for root collection)',
    );
    expect(getCollectionDefinition.inputSchema).toEqual(GetCollectionParamsSchema);
  });
});
