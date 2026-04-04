import { GetDashboardItemsInputSchema } from '@src/schemas/dashboard';
import { getDashboardItemsDefinition } from '@src/tools/dashboard/get-dashboard-items';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardItems tool', () => {
  it('should return formatted MCP response with dashboard items', async () => {
    const mockClient = createMockClientWithResponse('get', { dashcards: [] });
    const result = await getDashboardItemsDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, { dashcards: [] });
    expect(mockClient.get).toHaveBeenCalledWith('/api/dashboard/1/items');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getDashboardItemsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getDashboardItemsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });
  it('should have correct tool definition metadata', () => {
    expect(getDashboardItemsDefinition.name).toBe('get_dashboard_items');
    expect(getDashboardItemsDefinition.description).toBe(
      'Get items (dashcards) of a dashboard in Metabase',
    );
    expect(getDashboardItemsDefinition.inputSchema).toEqual(GetDashboardItemsInputSchema);
  });
});
