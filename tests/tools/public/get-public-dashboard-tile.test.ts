import { GetPublicDashboardTileSchema } from '@src/schemas/public';
import { getPublicDashboardTileDefinition } from '@src/tools/public/get-public-dashboard-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicDashboardTile tool', () => {
  const input = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    dashcard_id: 42,
    card_id: 1,
    zoom: 10,
    x: 5,
    y: 3,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicDashboardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/tiles/dashboard/${input.uuid}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicDashboardTileDefinition.name).toBe('get_public_dashboard_tile');
    expect(getPublicDashboardTileDefinition.description).toBe(
      'Get a map tile for a public dashboard dashcard in Metabase',
    );
    expect(getPublicDashboardTileDefinition.inputSchema).toEqual(GetPublicDashboardTileSchema);
  });
});
