import { ListDocumentsInputSchema } from '@src/schemas/document';
import { listDocumentsDefinition } from '@src/tools/document/list-documents';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listDocuments tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('get', [{ id: 1, name: 'Doc 1' }]);
    const result = await listDocumentsDefinition.handler(mockClient, {});
    expectMcpContent(result, [{ id: 1, name: 'Doc 1' }]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/document');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(listDocumentsDefinition.handler(mockClient, {})).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listDocumentsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listDocumentsDefinition.name).toBe('list_documents');
    expect(listDocumentsDefinition.description).toBe('List all documents in Metabase');
    expect(listDocumentsDefinition.inputSchema).toEqual(ListDocumentsInputSchema);
  });
});
