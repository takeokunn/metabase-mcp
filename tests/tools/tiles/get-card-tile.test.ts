import { GetCardTileInputSchema } from '@src/schemas/tiles';
import { getCardTileDefinition } from '@src/tools/tiles/get-card-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardTile tool', () => {
  const input = { card_id: 42, zoom: 10, x: 512, y: 512 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getCardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/42/10/512/512');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCardTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getCardTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardTileDefinition.name).toBe('get_card_tile');
    expect(getCardTileDefinition.description).toBe('Get a map tile for a card in Metabase');
    expect(getCardTileDefinition.inputSchema).toEqual(GetCardTileInputSchema);
  });
});
