import { ArchiveSnippetInputSchema } from '@src/schemas/snippet';
import { archiveSnippetDefinition } from '@src/tools/snippet/archive-snippet';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('archiveSnippet tool', () => {
  it('should return formatted MCP response after archiving snippet', async () => {
    const mockResult = {
      id: 1,
      name: 'Archived Snippet',
      content: 'SELECT 1',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await archiveSnippetDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/1', {
      archived: true,
    });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should archive snippet with different ID', async () => {
    const mockResult = {
      id: 42,
      name: 'Another Archived Snippet',
      content: 'SELECT * FROM orders',
      archived: true,
    };

    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await archiveSnippetDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/42', {
      archived: true,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Snippet not found');

    await expect(archiveSnippetDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Snippet not found',
    );
    expect(mockClient.put).toHaveBeenCalledWith('/api/native-query-snippet/999', {
      archived: true,
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(archiveSnippetDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should propagate unauthorized errors', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));

    await expect(archiveSnippetDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(archiveSnippetDefinition.name).toBe('archive_snippet');
    expect(archiveSnippetDefinition.description).toBe(
      'Archive a native query snippet in Metabase',
    );
    expect(archiveSnippetDefinition.inputSchema).toEqual(ArchiveSnippetInputSchema);
  });
});
