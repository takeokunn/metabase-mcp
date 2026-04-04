import { GetPreviewEmbedDashboardTileSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedDashboardTileDefinition } from '@src/tools/preview-embed/get-preview-embed-dashboard-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedDashboardTile tool', () => {
  const input = {
    token: 'test-preview-embed-token-abc123',
    dashcard_id: 42,
    card_id: 1,
    zoom: 10,
    x: 5,
    y: 3,
  };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedDashboardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/tiles/dashboard/${input.token}/dashcard/${input.dashcard_id}/card/${input.card_id}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(
      getPreviewEmbedDashboardTileDefinition.handler(mockClient, input),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(
      getPreviewEmbedDashboardTileDefinition.handler(mockClient, input),
    ).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedDashboardTileDefinition.name).toBe('get_preview_embed_dashboard_tile');
    expect(getPreviewEmbedDashboardTileDefinition.description).toBe(
      'Get a map tile for a preview embedded dashboard dashcard in Metabase',
    );
    expect(getPreviewEmbedDashboardTileDefinition.inputSchema).toEqual(
      GetPreviewEmbedDashboardTileSchema,
    );
  });
});
