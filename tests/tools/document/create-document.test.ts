import { CreateDocumentInputSchema } from '@src/schemas/document';
import { createDocumentDefinition } from '@src/tools/document/create-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createDocument tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 1, name: 'New Doc' });
    const result = await createDocumentDefinition.handler(mockClient, { name: 'New Doc' });
    expectMcpContent(result, { id: 1, name: 'New Doc' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/document', { name: 'New Doc', content: undefined, collection_id: undefined });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(createDocumentDefinition.handler(mockClient, { name: 'Doc' })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(createDocumentDefinition.handler(mockClient, { name: 'Doc' })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(createDocumentDefinition.name).toBe('create_document');
    expect(createDocumentDefinition.description).toBe('Create a new document in Metabase');
    expect(createDocumentDefinition.inputSchema).toEqual(CreateDocumentInputSchema);
  });
});
