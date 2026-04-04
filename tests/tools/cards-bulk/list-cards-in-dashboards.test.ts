import { ListCardsInDashboardsInputSchema } from '@src/schemas/cards-bulk';
import { listCardsInDashboardsDefinition } from '@src/tools/cards-bulk/list-cards-in-dashboards';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listCardsInDashboards tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = [{ id: 1, name: 'Dashboard A' }];
    const mockClient = createMockClientWithResponse('post', mockResult);
    const result = await listCardsInDashboardsDefinition.handler(mockClient, {
      card_ids: [1, 2, 3],
    });
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/cards/dashboards', { card_ids: [1, 2, 3] });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Not found');
    await expect(
      listCardsInDashboardsDefinition.handler(mockClient, { card_ids: [999] }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));
    await expect(
      listCardsInDashboardsDefinition.handler(mockClient, { card_ids: [1] }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listCardsInDashboardsDefinition.name).toBe('list_cards_in_dashboards');
    expect(listCardsInDashboardsDefinition.description).toBe(
      'Get dashboards that contain the specified cards in Metabase',
    );
    expect(listCardsInDashboardsDefinition.inputSchema).toEqual(ListCardsInDashboardsInputSchema);
  });
});
