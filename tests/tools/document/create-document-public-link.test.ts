import { GetDocumentPublicLinkInputSchema } from '@src/schemas/document';
import { createDocumentPublicLinkDefinition } from '@src/tools/document/create-document-public-link';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createDocumentPublicLink tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { uuid: 'abc-123' });
    const result = await createDocumentPublicLinkDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { uuid: 'abc-123' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/document/1/public-link', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      createDocumentPublicLinkDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(createDocumentPublicLinkDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(createDocumentPublicLinkDefinition.name).toBe('create_document_public_link');
    expect(createDocumentPublicLinkDefinition.description).toBe(
      'Create a public link for a document in Metabase',
    );
    expect(createDocumentPublicLinkDefinition.inputSchema).toEqual(
      GetDocumentPublicLinkInputSchema,
    );
  });
});
