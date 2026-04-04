import { RunEmbedDashboardPivotQuerySchema } from '@src/schemas/embed';
import { runEmbedDashboardPivotQueryDefinition } from '@src/tools/embed/run-embed-dashboard-pivot-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('runEmbedDashboardPivotQuery tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 42, card_id: 1 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [] } };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await runEmbedDashboardPivotQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith(
      `/api/embed/pivot/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query`,
      {},
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(runEmbedDashboardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Not Found', 404));
    await expect(runEmbedDashboardPivotQueryDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(runEmbedDashboardPivotQueryDefinition.name).toBe('run_embed_dashboard_pivot_query');
    expect(runEmbedDashboardPivotQueryDefinition.description).toBe('Run a pivot query for an embedded dashboard dashcard in Metabase');
    expect(runEmbedDashboardPivotQueryDefinition.inputSchema).toEqual(RunEmbedDashboardPivotQuerySchema);
  });
});
