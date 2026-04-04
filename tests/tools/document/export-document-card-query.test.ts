import { RunDocumentCardQueryInputSchema } from '@src/schemas/document';
import { exportDocumentCardQueryDefinition } from '@src/tools/document/export-document-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportDocumentCardQuery tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', 'col1,col2\nval1,val2');
    const result = await exportDocumentCardQueryDefinition.handler(mockClient, { id: 1, card_id: 42, export_format: 'csv' });
    expectMcpContent(result, 'col1,col2\nval1,val2');
    expect(mockClient.post).toHaveBeenCalledWith('/api/document/1/card/42/query/csv', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(exportDocumentCardQueryDefinition.handler(mockClient, { id: 999, card_id: 1, export_format: 'json' })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(exportDocumentCardQueryDefinition.handler(mockClient, { id: 1, card_id: 1, export_format: 'xlsx' })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportDocumentCardQueryDefinition.name).toBe('export_document_card_query');
    expect(exportDocumentCardQueryDefinition.description).toBe('Export a card query result from a document in Metabase');
    expect(exportDocumentCardQueryDefinition.inputSchema).toEqual(RunDocumentCardQueryInputSchema);
  });
});
