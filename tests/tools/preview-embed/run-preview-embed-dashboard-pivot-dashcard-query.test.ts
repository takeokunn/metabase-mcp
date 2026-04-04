import { RunPreviewEmbedDashboardPivotDashcardQuerySchema } from '@src/schemas/preview-embed';
import { runPreviewEmbedDashboardPivotDashcardQueryDefinition } from '@src/tools/preview-embed/run-preview-embed-dashboard-pivot-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPreviewEmbedDashboardPivotDashcardQuery tool', () => {
  const input = { token: 'test-preview-embed-token-abc123', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runPreviewEmbedDashboardPivotDashcardQueryDefinition.handler(
      mockClient,
      input,
    );
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      runPreviewEmbedDashboardPivotDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      runPreviewEmbedDashboardPivotDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runPreviewEmbedDashboardPivotDashcardQueryDefinition.name).toBe(
      'run_preview_embed_dashboard_pivot_dashcard_query',
    );
    expect(runPreviewEmbedDashboardPivotDashcardQueryDefinition.description).toBe(
      'Run a pivot query for a preview embedded dashboard dashcard in Metabase',
    );
    expect(runPreviewEmbedDashboardPivotDashcardQueryDefinition.inputSchema).toEqual(
      RunPreviewEmbedDashboardPivotDashcardQuerySchema,
    );
  });
});
