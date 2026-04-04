import { GetCardDashboardsInputSchema } from '@src/schemas/card';
import { getCardDashboardsDefinition } from '@src/tools/card/get-card-dashboards';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardDashboards tool', () => {
  it('should return formatted MCP response with dashboards data', async () => {
    const mockClient = createMockClientWithResponse('get', [{ id: 1, name: 'Dashboard 1' }]);
    const result = await getCardDashboardsDefinition.handler(mockClient, { id: 1 });
    expectMcpContent(result, [{ id: 1, name: 'Dashboard 1' }]);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/dashboards');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getCardDashboardsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getCardDashboardsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });
  it('should have correct tool definition metadata', () => {
    expect(getCardDashboardsDefinition.name).toBe('get_card_dashboards');
    expect(getCardDashboardsDefinition.description).toBe(
      'Get dashboards that contain a specific card in Metabase',
    );
    expect(getCardDashboardsDefinition.inputSchema).toEqual(GetCardDashboardsInputSchema);
  });
});
