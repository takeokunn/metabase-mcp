import { UpdateDocumentInputSchema } from '@src/schemas/document';
import { updateDocumentDefinition } from '@src/tools/document/update-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateDocument tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('put', { id: 1, name: 'Updated Doc' });
    const result = await updateDocumentDefinition.handler(mockClient, { id: 1, name: 'Updated Doc' });
    expectMcpContent(result, { id: 1, name: 'Updated Doc' });
    expect(mockClient.put).toHaveBeenCalledWith('/api/document/1', { name: 'Updated Doc', content: undefined, archived: undefined });
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Not found');
    await expect(updateDocumentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Unauthorized', 401));
    await expect(updateDocumentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateDocumentDefinition.name).toBe('update_document');
    expect(updateDocumentDefinition.description).toBe('Update a document by ID in Metabase');
    expect(updateDocumentDefinition.inputSchema).toEqual(UpdateDocumentInputSchema);
  });
});
