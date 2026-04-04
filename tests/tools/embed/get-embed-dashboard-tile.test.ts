import { GetEmbedDashboardTileSchema } from '@src/schemas/embed';
import { getEmbedDashboardTileDefinition } from '@src/tools/embed/get-embed-dashboard-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedDashboardTile tool', () => {
  const input = { token: 'test-embed-token-abc123', dashcard_id: 42, card_id: 1, zoom: 10, x: 5, y: 3 };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedDashboardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/tiles/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedDashboardTileDefinition.name).toBe('get_embed_dashboard_tile');
    expect(getEmbedDashboardTileDefinition.description).toBe(
      'Get a map tile for an embedded dashboard dashcard in Metabase',
    );
    expect(getEmbedDashboardTileDefinition.inputSchema).toEqual(GetEmbedDashboardTileSchema);
  });
});
