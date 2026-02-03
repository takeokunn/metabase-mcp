import { UpdateSnippetInputSchema } from '@src/schemas/snippet';
import { updateSnippetDefinition } from '@src/tools/snippet/update-snippet';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateSnippet tool', () => {
  it('should return formatted MCP response with updated snippet', async () => {
    const mockUpdatedSnippet = {
      id: 1,
      name: 'Updated Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)",
      creator_id: 1,
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 1,
      name: 'Updated Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)",
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/1', {
      name: 'Updated Date Filter',
      content: "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)",
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should update snippet name only', async () => {
    const mockUpdatedSnippet = {
      id: 42,
      name: 'New Name',
      content: 'SELECT 1',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 42,
      name: 'New Name',
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/42', {
      name: 'New Name',
    });
  });

  it('should update snippet content only', async () => {
    const mockUpdatedSnippet = {
      id: 5,
      name: 'Date Filter',
      content: 'WHERE created_at > NOW()',
      archived: false,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 5,
      content: 'WHERE created_at > NOW()',
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/5', {
      content: 'WHERE created_at > NOW()',
    });
  });

  it('should update snippet description', async () => {
    const mockUpdatedSnippet = {
      id: 7,
      name: 'Date Filter',
      description: 'Updated description',
      content: 'SELECT 1',
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 7,
      description: 'Updated description',
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/7', {
      description: 'Updated description',
    });
  });

  it('should update snippet archived status', async () => {
    const mockUpdatedSnippet = {
      id: 3,
      name: 'Old Snippet',
      content: 'SELECT 1',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 3,
      archived: true,
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/3', {
      archived: true,
    });
  });

  it('should update snippet collection_id', async () => {
    const mockUpdatedSnippet = {
      id: 8,
      name: 'Moved Snippet',
      content: 'SELECT 1',
      collection_id: 10,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 8,
      collection_id: 10,
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/8', {
      collection_id: 10,
    });
  });

  it('should update multiple fields at once', async () => {
    const mockUpdatedSnippet = {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      content: 'SELECT * FROM users',
      collection_id: 5,
    };

    const mockClient = createMockClientWithResponse('put', mockUpdatedSnippet);

    const result = await updateSnippetDefinition.handler(mockClient, {
      id: 10,
      name: 'Comprehensive Update',
      description: 'New description',
      content: 'SELECT * FROM users',
      collection_id: 5,
    });

    expectMcpContent(result, mockUpdatedSnippet);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/10', {
      name: 'Comprehensive Update',
      description: 'New description',
      content: 'SELECT * FROM users',
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Snippet not found');

    await expect(
      updateSnippetDefinition.handler(mockClient, { id: 999, name: 'Test' }),
    ).rejects.toThrow('Snippet not found');
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/999', { name: 'Test' });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Bad Request', 400));

    await expect(
      updateSnippetDefinition.handler(mockClient, { id: 1, name: 'Test' }),
    ).rejects.toThrow('Bad Request');
  });

  it('should propagate forbidden errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateSnippetDefinition.handler(mockClient, { id: 1, name: 'Test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateSnippetDefinition.name).toBe('update_snippet');
    expect(updateSnippetDefinition.description).toBe(
      'Update an existing native query snippet in Metabase',
    );
    expect(updateSnippetDefinition.inputSchema).toEqual(UpdateSnippetInputSchema);
  });
});
