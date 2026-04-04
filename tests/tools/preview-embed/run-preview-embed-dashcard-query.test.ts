import { RunPreviewEmbedDashcardQuerySchema } from '@src/schemas/preview-embed';
import { runPreviewEmbedDashcardQueryDefinition } from '@src/tools/preview-embed/run-preview-embed-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPreviewEmbedDashcardQuery tool', () => {
  const input = { token: 'test-preview-embed-token-abc123', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runPreviewEmbedDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      runPreviewEmbedDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      runPreviewEmbedDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runPreviewEmbedDashcardQueryDefinition.name).toBe('run_preview_embed_dashcard_query');
    expect(runPreviewEmbedDashcardQueryDefinition.description).toBe(
      'Run a query for a preview embedded dashcard in Metabase',
    );
    expect(runPreviewEmbedDashcardQueryDefinition.inputSchema).toEqual(
      RunPreviewEmbedDashcardQuerySchema,
    );
  });
});
