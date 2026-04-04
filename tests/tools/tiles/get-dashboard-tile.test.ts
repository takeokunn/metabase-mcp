import { GetDashboardTileInputSchema } from '@src/schemas/tiles';
import { getDashboardTileDefinition } from '@src/tools/tiles/get-dashboard-tile';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDashboardTile tool', () => {
  const input = { dashboard_id: 1, dashcard_id: 2, card_id: 3, zoom: 10, x: 512, y: 512 };

  it('should return formatted MCP response', async () => {
    const mockResult = { data: 'png-binary-data' };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getDashboardTileDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/tiles/1/dashcard/2/card/3/10/512/512');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getDashboardTileDefinition.handler(mockClient, input)).rejects.toThrow('Not Found');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDashboardTileDefinition.name).toBe('get_dashboard_tile');
    expect(getDashboardTileDefinition.description).toBe('Get a map tile for a dashboard card in Metabase');
    expect(getDashboardTileDefinition.inputSchema).toEqual(GetDashboardTileInputSchema);
  });
});
