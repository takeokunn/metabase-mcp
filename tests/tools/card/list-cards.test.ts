import type { MetabaseClient } from '@src/client';
import { ListCardsParamsSchema } from '@src/schemas/card';
import { listCardsDefinition } from '@src/tools/card/list-cards';
import { describe, expect, it, vi } from 'vitest';

describe('listCards tool', () => {
  it('should return formatted MCP response with cards', async () => {
    const mockCards = [
      {
        id: 1,
        name: 'Sales Report',
        display: 'bar',
        database_id: 1,
        collection_id: 5,
      },
      {
        id: 2,
        name: 'Revenue Dashboard',
        display: 'line',
        database_id: 1,
        collection_id: 5,
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCards),
    } as unknown as MetabaseClient;

    const result = await listCardsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card', undefined);
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should filter by collection_id when provided', async () => {
    const mockCards = [
      {
        id: 3,
        name: 'Filtered Card',
        display: 'table',
        database_id: 2,
        collection_id: 10,
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockCards),
    } as unknown as MetabaseClient;

    const result = await listCardsDefinition.handler(mockClient, { collection_id: 10 });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCards);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card', { collection: 10 });
  });

  it('should handle empty card list', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue([]),
    } as unknown as MetabaseClient;

    const result = await listCardsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    await expect(listCardsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(listCardsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCardsDefinition.name).toBe('list_cards');
    expect(listCardsDefinition.description).toBe(
      'Get list of cards (saved questions) in Metabase, optionally filtered by collection',
    );
    expect(listCardsDefinition.inputSchema).toEqual(ListCardsParamsSchema);
  });
});
