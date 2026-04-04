import { CopyDocumentInputSchema } from '@src/schemas/document';
import { copyDocumentDefinition } from '@src/tools/document/copy-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('copyDocument tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { id: 2, name: 'Doc 1 (copy)' });
    const result = await copyDocumentDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 2, name: 'Doc 1 (copy)' });
    expect(mockClient.post).toHaveBeenCalledWith('/api/document/1/copy', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(copyDocumentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(copyDocumentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(copyDocumentDefinition.name).toBe('copy_document');
    expect(copyDocumentDefinition.description).toBe('Copy a document by ID in Metabase');
    expect(copyDocumentDefinition.inputSchema).toEqual(CopyDocumentInputSchema);
  });
});
