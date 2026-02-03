import { CreateSnippetInputSchema } from '@src/schemas/snippet';
import { createSnippetDefinition } from '@src/tools/snippet/create-snippet';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createSnippet tool', () => {
  const baseSnippetInput = {
    name: 'New Date Filter',
    content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
  };

  it('should return formatted MCP response with created snippet', async () => {
    const mockCreatedSnippet = {
      id: 42,
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      creator_id: 1,
      archived: false,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSnippet);

    const result = await createSnippetDefinition.handler(mockClient, baseSnippetInput);

    expectMcpContent(result, mockCreatedSnippet);
    expect(mockClient.post).toHaveBeenCalledWith('/api/native-query-snippet', {
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      description: undefined,
      collection_id: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should include optional description when provided', async () => {
    const inputWithDescription = {
      ...baseSnippetInput,
      description: 'Filters records from the last 7 days',
    };

    const mockCreatedSnippet = {
      id: 43,
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      description: 'Filters records from the last 7 days',
      creator_id: 1,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSnippet);

    const result = await createSnippetDefinition.handler(mockClient, inputWithDescription);

    expectMcpContent(result, mockCreatedSnippet);
    expect(mockClient.post).toHaveBeenCalledWith('/api/native-query-snippet', {
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      description: 'Filters records from the last 7 days',
      collection_id: undefined,
    });
  });

  it('should include collection_id when provided', async () => {
    const inputWithCollection = {
      ...baseSnippetInput,
      collection_id: 5,
    };

    const mockCreatedSnippet = {
      id: 44,
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      collection_id: 5,
    };

    const mockClient = createMockClientWithResponse('post', mockCreatedSnippet);

    const result = await createSnippetDefinition.handler(mockClient, inputWithCollection);

    expectMcpContent(result, mockCreatedSnippet);
    expect(mockClient.post).toHaveBeenCalledWith('/api/native-query-snippet', {
      name: 'New Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      description: undefined,
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Failed to create snippet');

    await expect(createSnippetDefinition.handler(mockClient, baseSnippetInput)).rejects.toThrow(
      'Failed to create snippet',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));

    await expect(createSnippetDefinition.handler(mockClient, baseSnippetInput)).rejects.toThrow(
      'Bad Request',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createSnippetDefinition.name).toBe('create_snippet');
    expect(createSnippetDefinition.description).toBe(
      'Create a new native query snippet in Metabase',
    );
    expect(createSnippetDefinition.inputSchema).toEqual(CreateSnippetInputSchema);
  });
});
