import { GetDashboardRelatedInputSchema } from '@src/schemas/dashboard';
import { getDashboardRelatedDefinition } from '@src/tools/dashboard/get-dashboard-related';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardRelated tool', () => {
  it('should return formatted MCP response with related items', async () => {
    const mockClient = createMockClientWithResponse('get', { cards: [], dashboards: [] });
    const result = await getDashboardRelatedDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { cards: [], dashboards: [] });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/related');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getDashboardRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getDashboardRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });
  it('should have correct tool definition metadata', () => {
    expect(getDashboardRelatedDefinition.name).toBe('get_dashboard_related');
    expect(getDashboardRelatedDefinition.description).toBe(
      'Get related items for a dashboard in Metabase',
    );
    expect(getDashboardRelatedDefinition.inputSchema).toEqual(GetDashboardRelatedInputSchema);
  });
});
