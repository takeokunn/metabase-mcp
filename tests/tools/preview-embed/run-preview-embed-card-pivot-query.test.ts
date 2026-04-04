import { RunPreviewEmbedCardPivotQuerySchema } from '@src/schemas/preview-embed';
import { runPreviewEmbedCardPivotQueryDefinition } from '@src/tools/preview-embed/run-preview-embed-card-pivot-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runPreviewEmbedCardPivotQuery tool', () => {
  const input = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.preview' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runPreviewEmbedCardPivotQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/pivot/card/${input.token}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      runPreviewEmbedCardPivotQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      runPreviewEmbedCardPivotQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runPreviewEmbedCardPivotQueryDefinition.name).toBe('run_preview_embed_card_pivot_query');
    expect(runPreviewEmbedCardPivotQueryDefinition.description).toBe(
      'Run a pivot query for a preview embedded card in Metabase',
    );
    expect(runPreviewEmbedCardPivotQueryDefinition.inputSchema).toEqual(
      RunPreviewEmbedCardPivotQuerySchema,
    );
  });
});
