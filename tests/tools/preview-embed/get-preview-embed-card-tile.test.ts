import { GetPreviewEmbedCardTileSchema } from '@src/schemas/preview-embed';
import { getPreviewEmbedCardTileDefinition } from '@src/tools/preview-embed/get-preview-embed-card-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPreviewEmbedCardTile tool', () => {
  const input = { token: 'test-preview-embed-token-abc123', zoom: 10, x: 5, y: 3 };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPreviewEmbedCardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/preview_embed/tiles/card/${input.token}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPreviewEmbedCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPreviewEmbedCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPreviewEmbedCardTileDefinition.name).toBe('get_preview_embed_card_tile');
    expect(getPreviewEmbedCardTileDefinition.description).toBe(
      'Get a map tile for a preview embedded card in Metabase',
    );
    expect(getPreviewEmbedCardTileDefinition.inputSchema).toEqual(GetPreviewEmbedCardTileSchema);
  });
});
