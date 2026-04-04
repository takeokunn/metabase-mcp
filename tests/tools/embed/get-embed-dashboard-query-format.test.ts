import { GetEmbedDashboardQueryFormatParamsSchema } from '@src/schemas/embed';
import { getEmbedDashboardQueryFormatDefinition } from '@src/tools/embed/get-embed-dashboard-query-format';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboardQueryFormat tool', () => {
  const input = {
    token: 'test-embed-token-abc123',
    dashcard_id: 10,
    card_id: 5,
    export_format: 'csv' as const,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = 'count\n100\n';
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardQueryFormatDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedDashboardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getEmbedDashboardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardQueryFormatDefinition.name).toBe('get_embed_dashboard_query_format');
    expect(getEmbedDashboardQueryFormatDefinition.inputSchema).toEqual(GetEmbedDashboardQueryFormatParamsSchema);
  });
});
