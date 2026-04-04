import { ExportPublicDocumentCardSchema } from '@src/schemas/public';
import { exportPublicDocumentCardDefinition } from '@src/tools/public/export-public-document-card';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPublicDocumentCard tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    card_id: 42,
    export_format: 'csv',
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'exported-data' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await exportPublicDocumentCardDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      '/api/public/document/550e8400-e29b-41d4-a716-446655440000/card/42/csv',
      {},
    );
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      exportPublicDocumentCardDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(
      exportPublicDocumentCardDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPublicDocumentCardDefinition.name).toBe('export_public_document_card');
    expect(exportPublicDocumentCardDefinition.description).toBe(
      'Export a card from a publicly shared document in Metabase',
    );
    expect(exportPublicDocumentCardDefinition.inputSchema).toEqual(
      ExportPublicDocumentCardSchema,
    );
  });
});
