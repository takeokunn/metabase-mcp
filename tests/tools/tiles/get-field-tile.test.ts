import { GetFieldTileInputSchema } from '@src/schemas/tiles';
import { getFieldTileDefinition } from '@src/tools/tiles/get-field-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldTile tool', () => {
  const input = { zoom: 10, x: 512, y: 512, lat_field_id: 1, lon_field_id: 2, field_id: 3, timeseries_enabled: false, token: 'abc-token' };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getFieldTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/10/512/512/1/2/3/false/abc-token');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getFieldTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getFieldTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldTileDefinition.name).toBe('get_field_tile');
    expect(getFieldTileDefinition.description).toBe('Get a map tile using field coordinates in Metabase');
    expect(getFieldTileDefinition.inputSchema).toEqual(GetFieldTileInputSchema);
  });
});
