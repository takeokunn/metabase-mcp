import { GetBasicTileInputSchema } from '@src/schemas/tiles';
import { getBasicTileDefinition } from '@src/tools/tiles/get-basic-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getBasicTile tool', () => {
  const input = { zoom: 10, x: 512, y: 512 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getBasicTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/10/512/512');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getBasicTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getBasicTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getBasicTileDefinition.name).toBe('get_basic_tile');
    expect(getBasicTileDefinition.description).toBe(
      'Get a basic map tile by zoom level and coordinates in Metabase',
    );
    expect(getBasicTileDefinition.inputSchema).toEqual(GetBasicTileInputSchema);
  });
});
