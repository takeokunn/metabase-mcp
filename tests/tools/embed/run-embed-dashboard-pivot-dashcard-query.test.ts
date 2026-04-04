import { RunEmbedDashboardPivotDashcardQuerySchema } from '@src/schemas/embed';
import { runEmbedDashboardPivotDashcardQueryDefinition } from '@src/tools/embed/run-embed-dashboard-pivot-dashcard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runEmbedDashboardPivotDashcardQuery tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await runEmbedDashboardPivotDashcardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      runEmbedDashboardPivotDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      runEmbedDashboardPivotDashcardQueryDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runEmbedDashboardPivotDashcardQueryDefinition.name).toBe(
      'run_embed_dashboard_pivot_dashcard_query',
    );
    expect(runEmbedDashboardPivotDashcardQueryDefinition.description).toBe(
      'Run a pivot query for an embedded dashboard dashcard in Metabase',
    );
    expect(runEmbedDashboardPivotDashcardQueryDefinition.inputSchema).toEqual(
      RunEmbedDashboardPivotDashcardQuerySchema,
    );
  });
});
