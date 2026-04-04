import { getCardMapTileDefinition } from '@src/tools/tiles/get-card-map-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardMapTile tool', () => {
  const input = { zoom: 10, x: 512, y: 512, lat_field: 'latitude', lon_field: 'longitude', card_id: 42 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getCardMapTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL with path params', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getCardMapTileDefinition.handler(mockClient, input);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/tiles/42/10/512/512/latitude/longitude/tile.png`,
      undefined,
    );
  });

  it('should pass query param when provided', async () => {
    const inputWithQuery = { ...input, query: '{"filter": []}' };
    const mockClient = createMockClientWithResponse('get', {});
    await getCardMapTileDefinition.handler(mockClient, inputWithQuery);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/api/tiles/42/10/512/512/latitude/longitude/tile.png`,
      { query: '{"filter": []}' },
    );
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getCardMapTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getCardMapTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });
});
