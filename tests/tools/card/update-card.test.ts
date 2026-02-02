import type { MetabaseClient } from '@src/client';
import { UpdateCardInputSchema } from '@src/schemas/card';
import { updateCardDefinition } from '@src/tools/card/update-card';
import { describe, expect, it, vi } from 'vitest';

describe('updateCard tool', () => {
  it('should return formatted MCP response with updated card', async () => {
    const mockUpdatedCard = {
      id: 1,
      name: 'Updated Sales Report',
      display: 'line',
      database_id: 1,
      collection_id: null,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Sales Report',
      display: 'line',
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedCard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/1', {
      name: 'Updated Sales Report',
      display: 'line',
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update card name only', async () => {
    const mockUpdatedCard = {
      id: 42,
      name: 'New Name',
      display: 'bar',
      database_id: 1,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 42,
      name: 'New Name',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedCard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/42', {
      name: 'New Name',
    });
  });

  it('should update card description', async () => {
    const mockUpdatedCard = {
      id: 5,
      name: 'My Card',
      description: 'Updated description for the card',
      display: 'table',
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 5,
      description: 'Updated description for the card',
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/5', {
      description: 'Updated description for the card',
    });
  });

  it('should update card collection_id', async () => {
    const mockUpdatedCard = {
      id: 3,
      name: 'Moved Card',
      display: 'pie',
      collection_id: 10,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 3,
      collection_id: 10,
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockUpdatedCard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/3', {
      collection_id: 10,
    });
  });

  it('should update card visualization_settings', async () => {
    const mockUpdatedCard = {
      id: 7,
      name: 'Chart Card',
      display: 'bar',
      visualization_settings: {
        'graph.dimensions': ['category'],
        'graph.metrics': ['count'],
      },
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 7,
      visualization_settings: {
        'graph.dimensions': ['category'],
        'graph.metrics': ['count'],
      },
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/7', {
      visualization_settings: {
        'graph.dimensions': ['category'],
        'graph.metrics': ['count'],
      },
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedCard = {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      display: 'area',
      collection_id: 5,
    };

    const mockClient = {
      put: vi.fn().mockResolvedValue(mockUpdatedCard),
    } as unknown as MetabaseClient;

    const result = await updateCardDefinition.handler(mockClient, {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      display: 'area',
      collection_id: 5,
    });

    expect(result.content[0].type).toBe('text');
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/10', {
      name: 'Comprehensive Update',
      description: 'New description',
      display: 'area',
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      put: vi.fn().mockRejectedValue(new Error('Card not found')),
    } as unknown as MetabaseClient;

    await expect(
      updateCardDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Card not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/999', { name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Bad Request');
    (apiError as Error & { status?: number }).status = 400;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(updateCardDefinition.handler(mockClient, { id: 1, name: 'Test' })).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      put: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(updateCardDefinition.handler(mockClient, { id: 1, name: 'Test' })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(updateCardDefinition.name).toBe('update_card');
    expect(updateCardDefinition.description).toBe(
      'Update an existing card (saved question) in Metabase',
    );
    expect(updateCardDefinition.inputSchema).toEqual(UpdateCardInputSchema);
  });
});
