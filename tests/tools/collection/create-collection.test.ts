import type { MetabaseClient } from '@src/client';
import { CreateCollectionInputSchema } from '@src/schemas/collection';
import { createCollectionDefinition } from '@src/tools/collection/create-collection';
import { describe, expect, it, vi } from 'vitest';

describe('createCollection tool', () => {
  it('should return formatted MCP response with created collection', async () => {
    const mockCreatedCollection = {
      id: 10,
      name: 'Marketing Reports',
      description: 'Collection for marketing team',
      location: '/10/',
      personal_owner_id: null,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCollection),
    } as unknown as MetabaseClient;

    const result = await createCollectionDefinition.handler(mockClient, {
      name: 'Marketing Reports',
      description: 'Collection for marketing team',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCollection);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection', {
      name: 'Marketing Reports',
      description: 'Collection for marketing team',
      parent_id: undefined,
      color: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should create collection with name only', async () => {
    const mockCreatedCollection = {
      id: 15,
      name: 'Simple Collection',
      location: '/15/',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCollection),
    } as unknown as MetabaseClient;

    const result = await createCollectionDefinition.handler(mockClient, {
      name: 'Simple Collection',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCollection);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection', {
      name: 'Simple Collection',
      description: undefined,
      parent_id: undefined,
      color: undefined,
    });
  });

  it('should create nested collection with parent_id', async () => {
    const mockCreatedCollection = {
      id: 20,
      name: 'Sub Collection',
      location: '/5/20/',
      parent_id: 5,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCollection),
    } as unknown as MetabaseClient;

    const result = await createCollectionDefinition.handler(mockClient, {
      name: 'Sub Collection',
      parent_id: 5,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCollection);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection', {
      name: 'Sub Collection',
      description: undefined,
      parent_id: 5,
      color: undefined,
    });
  });

  it('should create collection with custom color', async () => {
    const mockCreatedCollection = {
      id: 25,
      name: 'Colored Collection',
      color: '#509EE3',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCollection),
    } as unknown as MetabaseClient;

    const result = await createCollectionDefinition.handler(mockClient, {
      name: 'Colored Collection',
      color: '#509EE3',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCollection);
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection', {
      name: 'Colored Collection',
      description: undefined,
      parent_id: undefined,
      color: '#509EE3',
    });
  });

  it('should create collection with all options', async () => {
    const mockCreatedCollection = {
      id: 30,
      name: 'Complete Collection',
      description: 'Full featured collection',
      location: '/10/30/',
      color: '#88BF4D',
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCollection),
    } as unknown as MetabaseClient;

    const result = await createCollectionDefinition.handler(mockClient, {
      name: 'Complete Collection',
      description: 'Full featured collection',
      parent_id: 10,
      color: '#88BF4D',
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.post).toHaveBeenCalledWith('/api/collection', {
      name: 'Complete Collection',
      description: 'Full featured collection',
      parent_id: 10,
      color: '#88BF4D',
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Failed to create collection')),
    } as unknown as MetabaseClient;

    await expect(createCollectionDefinition.handler(mockClient, { name: 'Test' })).rejects.toThrow(
      'Failed to create collection',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Bad Request');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(createCollectionDefinition.handler(mockClient, { name: 'Test' })).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(createCollectionDefinition.handler(mockClient, { name: 'Test' })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createCollectionDefinition.name).toBe('create_collection');
    expect(createCollectionDefinition.description).toBe(
      'Create a new collection (folder) in Metabase',
    );
    expect(createCollectionDefinition.inputSchema).toEqual(CreateCollectionInputSchema);
  });
});
