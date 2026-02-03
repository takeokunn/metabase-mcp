import { CreateCardInputSchema } from '@src/schemas/card';
import { createCardDefinition } from '@src/tools/card/create-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

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

    const mockClient = createMockClientWithResponse('post', mockCreatedCard);

    const result = await createCardDefinition.handler(mockClient, baseCardInput);

    expectMcpContent(result, mockCreatedCard);
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

    const mockClient = createMockClientWithResponse('post', mockCreatedCard);

    const result = await createCardDefinition.handler(mockClient, inputWithSettings);

    expectMcpContent(result, mockCreatedCard);
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

    const mockClient = createMockClientWithResponse('post', mockCreatedCard);

    const result = await createCardDefinition.handler(mockClient, inputWithCollection);

    expectMcpContent(result, mockCreatedCard);
    expect(mockClient.post).toHaveBeenCalledWith('/api/card', {
      name: 'New Sales Report',
      display: 'bar',
      dataset_query: baseCardInput.dataset_query,
      visualization_settings: {},
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create card');

    await expect(createCardDefinition.handler(mockClient, baseCardInput)).rejects.toThrow(
      'Failed to create card',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

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
