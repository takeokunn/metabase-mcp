import { ExportEmbedDashcardQuerySchema } from '@src/schemas/embed';
import { exportEmbedDashcardQueryDefinition } from '@src/tools/embed/export-embed-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('exportEmbedDashcardQuery tool', () => {
  const input = {
    token: 'test-embed-token-abc123',
    dashcard_id: 42,
    card_id: 1,
    export_format: 'csv' as const,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = 'id,name\n1,Test';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await exportEmbedDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(exportEmbedDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(exportEmbedDashcardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(exportEmbedDashcardQueryDefinition.name).toBe('export_embed_dashcard_query');
    expect(exportEmbedDashcardQueryDefinition.description).toBe(
      'Export results of an embedded dashcard query in Metabase',
    );
    expect(exportEmbedDashcardQueryDefinition.inputSchema).toEqual(ExportEmbedDashcardQuerySchema);
  });
});
