import { GetEmbedCardTileSchema } from '@src/schemas/embed';
import { getEmbedCardTileDefinition } from '@src/tools/embed/get-embed-card-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getEmbedCardTile tool', () => {
  const input = { token: 'test-embed-token-abc123', zoom: 10, x: 5, y: 3 };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getEmbedCardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/embed/tiles/card/${input.token}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getEmbedCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getEmbedCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getEmbedCardTileDefinition.name).toBe('get_embed_card_tile');
    expect(getEmbedCardTileDefinition.description).toBe(
      'Get a map tile for an embedded card in Metabase',
    );
    expect(getEmbedCardTileDefinition.inputSchema).toEqual(GetEmbedCardTileSchema);
  });
});
