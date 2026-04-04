import { DeleteDocumentPublicLinkInputSchema } from '@src/schemas/document';
import { deleteDocumentPublicLinkDefinition } from '@src/tools/document/delete-document-public-link';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDocumentPublicLink tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('delete', null);
    const result = await deleteDocumentPublicLinkDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, null);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/document/1/public-link');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Not found');
    await expect(deleteDocumentPublicLinkDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteDocumentPublicLinkDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDocumentPublicLinkDefinition.name).toBe('delete_document_public_link');
    expect(deleteDocumentPublicLinkDefinition.description).toBe('Delete the public link for a document in Metabase');
    expect(deleteDocumentPublicLinkDefinition.inputSchema).toEqual(DeleteDocumentPublicLinkInputSchema);
  });
});
