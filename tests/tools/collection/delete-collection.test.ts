import type { MetabaseClient } from '@src/client';
import { DeleteCollectionInputSchema } from '@src/schemas/collection';
import { deleteCollectionDefinition } from '@src/tools/collection/delete-collection';
import { describe, expect, it, vi } from 'vitest';

describe('deleteCollection tool', () => {
  it('should return formatted MCP response after archiving collection', async () => {
    const mockResult = {
      id: 1,
      name: 'Archived Collection',
      archived: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteCollectionDefinition.handler(mockClient, { id: 1 });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/1', { archived: true });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should archive collection with different ID', async () => {
    const mockResult = {
      id: 42,
      name: 'Another Archived Collection',
      archived: true,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockResult),
    } as unknown as MetabaseClient;

    const result = await deleteCollectionDefinition.handler(mockClient, { id: 42 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/42', { archived: true });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Collection not found')),
    } as unknown as MetabaseClient;

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Collection not found',
    );
    expect(mockClient.put).toHaveBeenCalledWith('/api/collection/999', { archived: true });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(deleteCollectionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteCollectionDefinition.name).toBe('delete_collection');
    expect(deleteCollectionDefinition.description).toBe(
      'Archive (soft-delete) a collection in Metabase',
    );
    expect(deleteCollectionDefinition.inputSchema).toEqual(DeleteCollectionInputSchema);
  });
});
