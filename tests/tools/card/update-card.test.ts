import { UpdateCardInputSchema } from '@src/schemas/card';
import { updateCardDefinition } from '@src/tools/card/update-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateCard tool', () => {
  it('should return formatted MCP response with updated card', async () => {
    const mockUpdatedCard = {
      id: 1,
      name: 'Updated Sales Report',
      display: 'line',
      database_id: 1,
      collection_id: null,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Sales Report',
      display: 'line',
    });

    expectMcpContent(result, mockUpdatedCard);
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

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 42,
      name: 'New Name',
    });

    expectMcpContent(result, mockUpdatedCard);
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

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 5,
      description: 'Updated description for the card',
    });

    expectMcpContent(result, mockUpdatedCard);
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

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 3,
      collection_id: 10,
    });

    expectMcpContent(result, mockUpdatedCard);
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

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 7,
      visualization_settings: {
        'graph.dimensions': ['category'],
        'graph.metrics': ['count'],
      },
    });

    expectMcpContent(result, mockUpdatedCard);
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

    const mockClient = createMockClientWithResponse('put', mockUpdatedCard);

    const result = await updateCardDefinition.handler(mockClient, {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      display: 'area',
      collection_id: 5,
    });

    expectMcpContent(result, mockUpdatedCard);
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/10', {
      name: 'Comprehensive Update',
      description: 'New description',
      display: 'area',
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Card not found');

    await expect(
      updateCardDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Card not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/card/999', { name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(updateCardDefinition.handler(mockClient, { id: 1, name: 'Test' })).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

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
