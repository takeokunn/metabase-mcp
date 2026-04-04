import { getFieldMapTileDefinition } from '@src/tools/tiles/get-field-map-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldMapTile tool', () => {
  const input = { zoom: 8, x: 256, y: 256, lat_field_id: 10, lon_field_id: 11 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getFieldMapTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
  });

  it('should call correct URL with path params', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    await getFieldMapTileDefinition.handler(mockClient, input);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/8/256/256/10/11/tile.png');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getFieldMapTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getFieldMapTileDefinition.handler(mockClient, input)).rejects.toThrow('Forbidden');
  });
});
