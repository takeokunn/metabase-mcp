import { GetSnippetParamsSchema } from '@src/schemas/snippet';
import { getSnippetDefinition } from '@src/tools/snippet/get-snippet';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getSnippet tool', () => {
  it('should return formatted MCP response with snippet data', async () => {
    const mockSnippet = {
      id: 1,
      name: 'Date Filter',
      description: 'Filters records from the last 30 days',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)",
      creator_id: 1,
      archived: false,
      collection_id: 5,
    };

    const mockClient = createMockClientWithResponse('get', mockSnippet);

    const result = await getSnippetDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockSnippet);
    expect(mockClient.get).toHaveBeenCalledWith('/api/native-query-snippet/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle snippet with minimal data', async () => {
    const mockSnippet = {
      id: 42,
      name: 'Simple Snippet',
      content: 'SELECT 1',
    };

    const mockClient = createMockClientWithResponse('get', mockSnippet);

    const result = await getSnippetDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockSnippet);
    expect(mockClient.get).toHaveBeenCalledWith('/api/native-query-snippet/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Snippet not found');

    await expect(getSnippetDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Snippet not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/native-query-snippet/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getSnippetDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getSnippetDefinition.name).toBe('get_snippet');
    expect(getSnippetDefinition.description).toBe(
      'Get a single native query snippet by ID from Metabase',
    );
    expect(getSnippetDefinition.inputSchema).toEqual(GetSnippetParamsSchema);
  });
});
