import { GetPublicDashboardQueryFormatParamsSchema } from '@src/schemas/public';
import { getPublicDashboardQueryFormatDefinition } from '@src/tools/public/get-public-dashboard-query-format';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashboardQueryFormat tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    dashcard_id: 10,
    card_id: 5,
    export_format: 'json' as const,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = [{ count: 100 }];
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDashboardQueryFormatDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/query/${input.export_format}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDashboardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getPublicDashboardQueryFormatDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDashboardQueryFormatDefinition.name).toBe('get_public_dashboard_query_format');
    expect(getPublicDashboardQueryFormatDefinition.inputSchema).toEqual(GetPublicDashboardQueryFormatParamsSchema);
  });
});
