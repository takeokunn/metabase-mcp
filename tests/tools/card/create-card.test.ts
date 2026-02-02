import type { MetabaseClient } from '@src/client';
import { CreateCardInputSchema } from '@src/schemas/card';
import { createCardDefinition } from '@src/tools/card/create-card';
import { describe, expect, it, vi } from 'vitest';

describe('createCard tool', () => {
  const baseCardInput = {
    name: 'New Sales Report',
    display: 'bar' as const,
    dataset_query: {
      database: 1,
      type: 'query',
      query: {
        'source-table': 1,
      },
    },
  };

  it('should return formatted MCP response with created card', async () => {
    const mockCreatedCard = {
      id: 42,
      name: 'New Sales Report',
      display: 'bar',
      database_id: 1,
      collection_id: null,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCard),
    } as unknown as MetabaseClient;

    const result = await createCardDefinition.handler(mockClient, baseCardInput);

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card', {
      name: 'New Sales Report',
      display: 'bar',
      dataset_query: baseCardInput.dataset_query,
      visualization_settings: {},
      collection_id: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include optional visualization_settings when provided', async () => {
    const inputWithSettings = {
      ...baseCardInput,
      visualization_settings: {
        'graph.dimensions': ['category'],
        'graph.metrics': ['count'],
      },
    };

    const mockCreatedCard = {
      id: 43,
      name: 'New Sales Report',
      display: 'bar',
      database_id: 1,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCard),
    } as unknown as MetabaseClient;

    const result = await createCardDefinition.handler(mockClient, inputWithSettings);

    expect(result.content[0].type).toBe('text');
    expect(mockClient.post).toHaveBeenCalledWith('/api/card', {
      name: 'New Sales Report',
      display: 'bar',
      dataset_query: baseCardInput.dataset_query,
      visualization_settings: inputWithSettings.visualization_settings,
      collection_id: undefined,
    });
  });

  it('should include collection_id when provided', async () => {
    const inputWithCollection = {
      ...baseCardInput,
      collection_id: 5,
    };

    const mockCreatedCard = {
      id: 44,
      name: 'New Sales Report',
      display: 'bar',
      database_id: 1,
      collection_id: 5,
    };

    const mockClient = {
      post: vi.fn().mockResolvedValue(mockCreatedCard),
    } as unknown as MetabaseClient;

    const result = await createCardDefinition.handler(mockClient, inputWithCollection);

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockCreatedCard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card', {
      name: 'New Sales Report',
      display: 'bar',
      dataset_query: baseCardInput.dataset_query,
      visualization_settings: {},
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      post: vi.fn().mockRejectedValue(new Error('Failed to create card')),
    } as unknown as MetabaseClient;

    await expect(createCardDefinition.handler(mockClient, baseCardInput)).rejects.toThrow(
      'Failed to create card',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Bad Request');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      post: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(createCardDefinition.handler(mockClient, baseCardInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createCardDefinition.name).toBe('create_card');
    expect(createCardDefinition.description).toBe('Create a new card (saved question) in Metabase');
    expect(createCardDefinition.inputSchema).toEqual(CreateCardInputSchema);
  });
});
