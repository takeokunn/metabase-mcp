import { PreviewEmbedDashboardQueryParamsSchema } from '@src/schemas/preview-embed';
import { previewEmbedDashboardQueryDefinition } from '@src/tools/preview-embed/preview-embed-dashboard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('previewEmbedDashboardQuery tool', () => {
  const input = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview',
    dashcard_id: 10,
    card_id: 5,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[100]], cols: [{ name: 'count' }] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await previewEmbedDashboardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(previewEmbedDashboardQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(previewEmbedDashboardQueryDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(previewEmbedDashboardQueryDefinition.name).toBe('preview_embed_dashboard_query');
    expect(previewEmbedDashboardQueryDefinition.inputSchema).toEqual(PreviewEmbedDashboardQueryParamsSchema);
  });
});
