import { DeleteDocumentInputSchema } from '@src/schemas/document';
import { deleteDocumentDefinition } from '@src/tools/document/delete-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteDocument tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('delete', null);
    const result = await deleteDocumentDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, null);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/document/1');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Not found');
    await expect(deleteDocumentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Unauthorized', 401));
    await expect(deleteDocumentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteDocumentDefinition.name).toBe('delete_document');
    expect(deleteDocumentDefinition.description).toBe('Delete a document by ID in Metabase');
    expect(deleteDocumentDefinition.inputSchema).toEqual(DeleteDocumentInputSchema);
  });
});
