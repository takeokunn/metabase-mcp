import { RunDocumentCardQueryInputSchema } from '@src/schemas/document';
import { runDocumentCardQueryDefinition } from '@src/tools/document/run-document-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runDocumentCardQuery tool', () => {
  it('should return formatted MCP response', async () => {
    const mockClient = createMockClientWithResponse('post', { data: { rows: [] } });
    const result = await runDocumentCardQueryDefinition.handler(mockClient, { id: 1, card_id: 42 });
    expectMcpContent(result, { data: { rows: [] } });
    expect(mockClient.post).toHaveBeenCalledWith('/api/document/1/card/42/query', {});
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(runDocumentCardQueryDefinition.handler(mockClient, { id: 999, card_id: 1 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(runDocumentCardQueryDefinition.handler(mockClient, { id: 1, card_id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(runDocumentCardQueryDefinition.name).toBe('run_document_card_query');
    expect(runDocumentCardQueryDefinition.description).toBe('Run a card query within a document in Metabase');
    expect(runDocumentCardQueryDefinition.inputSchema).toEqual(RunDocumentCardQueryInputSchema);
  });
});
