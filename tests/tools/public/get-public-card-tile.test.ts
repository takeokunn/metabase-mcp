import { GetPublicCardTileSchema } from '@src/schemas/public';
import { getPublicCardTileDefinition } from '@src/tools/public/get-public-card-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getPublicCardTile tool', () => {
  const input = { uuid: '550e8400-e29b-41d4-a716-446655440000', zoom: 10, x: 5, y: 3 };

  it('should return formatted MCP response', async () => {
    const mockResult = {};
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getPublicCardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/public/tiles/card/${input.uuid}/${input.zoom}/${input.x}/${input.y}`,
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getPublicCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getPublicCardTileDefinition.handler(mockClient, input)).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getPublicCardTileDefinition.name).toBe('get_public_card_tile');
    expect(getPublicCardTileDefinition.description).toBe(
      'Get a map tile for a public card in Metabase',
    );
    expect(getPublicCardTileDefinition.inputSchema).toEqual(GetPublicCardTileSchema);
  });
});
