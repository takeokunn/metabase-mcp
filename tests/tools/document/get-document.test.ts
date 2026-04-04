import { GetDocumentInputSchema } from '@src/schemas/document';
import { getDocumentDefinition } from '@src/tools/document/get-document';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDocument tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', { id: 1, name: 'Doc 1' });
    const result = await getDocumentDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { id: 1, name: 'Doc 1' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/document/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getDocumentDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getDocumentDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDocumentDefinition.name).toBe('get_document');
    expect(getDocumentDefinition.description).toBe('Get a document by ID in Metabase');
    expect(getDocumentDefinition.inputSchema).toEqual(GetDocumentInputSchema);
  });
});
