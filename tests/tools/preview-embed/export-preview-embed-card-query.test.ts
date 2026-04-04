import { ExportPreviewEmbedCardQuerySchema } from '@src/schemas/preview-embed';
import { exportPreviewEmbedCardQueryDefinition } from '@src/tools/preview-embed/export-preview-embed-card-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportPreviewEmbedCardQuery tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', export_format: 'csv' as const };

  it('should return formatted MCP response', async () => {
    const mockResult = 'col1,col2\nval1,val2';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await exportPreviewEmbedCardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/card/${input.token}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(exportPreviewEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(exportPreviewEmbedCardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(exportPreviewEmbedCardQueryDefinition.name).toBe('export_preview_embed_card_query');
    expect(exportPreviewEmbedCardQueryDefinition.description).toBe('Export results of a preview embedded card query in Metabase');
    expect(exportPreviewEmbedCardQueryDefinition.inputSchema).toEqual(ExportPreviewEmbedCardQuerySchema);
  });
});
