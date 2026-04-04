import { RunPreviewEmbedDashboardPivotQuerySchema } from '@src/schemas/preview-embed';
import { runPreviewEmbedDashboardPivotQueryDefinition } from '@src/tools/preview-embed/run-preview-embed-dashboard-pivot-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPreviewEmbedDashboardPivotQuery tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await runPreviewEmbedDashboardPivotQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/preview_embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      {},
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(runPreviewEmbedDashboardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(runPreviewEmbedDashboardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runPreviewEmbedDashboardPivotQueryDefinition.name).toBe('run_preview_embed_dashboard_pivot_query');
    expect(runPreviewEmbedDashboardPivotQueryDefinition.description).toBe('Run a pivot query for a preview embedded dashboard dashcard in Metabase');
    expect(runPreviewEmbedDashboardPivotQueryDefinition.inputSchema).toEqual(RunPreviewEmbedDashboardPivotQuerySchema);
  });
});
