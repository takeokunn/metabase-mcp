import { getTableMapTileDefinition } from '@src/tools/tiles/get-table-map-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableMapTile tool', () => {
  const input = { zoom: 6, x: 32, y: 32 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getTableMapTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL without card_id', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getTableMapTileDefinition.handler(mockClient, input);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/6/32/32/tile.png', undefined);
  });

  it('should pass card_id as query param when provided', async () => {
    const inputWithCard = { ...input, card_id: 7 };
    const mockClient = createMockClientWithResponse('get', {});
    await getTableMapTileDefinition.handler(mockClient, inputWithCard);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/6/32/32/tile.png', { 'card-id': 7 });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getTableMapTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getTableMapTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });
});
