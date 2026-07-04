import { GetEmbedDashboardQueryParamsSchema } from '@src/schemas/embed';
import { getEmbedDashboardQueryDefinition } from '@src/tools/embed/get-embed-dashboard-query';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboardQuery tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 10, card_id: 5 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: { rows: [[100]], cols: [{ name: 'count' }] } };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardQueryDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedDashboardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getEmbedDashboardQueryDefinition.handler(mockClient, input)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardQueryDefinition.name).toBe('get_embed_dashboard_query');
    expect(getEmbedDashboardQueryDefinition.inputSchema).toEqual(
      GetEmbedDashboardQueryParamsSchema,
    );
  });
});
