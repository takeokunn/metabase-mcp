import { ListPublicDocumentsInputSchema } from '@src/schemas/document';
import { listPublicDocumentsDefinition } from '@src/tools/document/list-public-documents';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listPublicDocuments tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'Doc 1' }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listPublicDocumentsDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/document/public');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listPublicDocumentsDefinition.handler(mockClient, {})).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listPublicDocumentsDefinition.handler(mockClient, {})).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listPublicDocumentsDefinition.name).toBe('list_public_documents');
    expect(listPublicDocumentsDefinition.description).toBe(
      'List all documents with public links in Metabase',
    );
    expect(listPublicDocumentsDefinition.inputSchema).toEqual(ListPublicDocumentsInputSchema);
  });
});
