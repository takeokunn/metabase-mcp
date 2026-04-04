import { ExportPreviewEmbedDashcardQuerySchema } from '@src/schemas/preview-embed';
import { exportPreviewEmbedDashcardQueryDefinition } from '@src/tools/preview-embed/export-preview-embed-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPreviewEmbedDashcardQuery tool', () => {
  const input = {
    token: 'test-preview-embed-token-abc123',
    dashcard_id: 42,
    card_id: 1,
    export_format: 'csv' as const,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Test';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await exportPreviewEmbedDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      exportPreviewEmbedDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      exportPreviewEmbedDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPreviewEmbedDashcardQueryDefinition.name).toBe(
      'export_preview_embed_dashcard_query',
    );
    expect(exportPreviewEmbedDashcardQueryDefinition.description).toBe(
      'Export results of a preview embedded dashcard query in Metabase',
    );
    expect(exportPreviewEmbedDashcardQueryDefinition.inputSchema).toEqual(
      ExportPreviewEmbedDashcardQuerySchema,
    );
  });
});
