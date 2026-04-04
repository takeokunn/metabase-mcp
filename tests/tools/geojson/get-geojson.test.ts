import { GetGeoJSONParamsSchema } from '@src/schemas/geojson';
import { getGeoJSONDefinition } from '@src/tools/geojson/get-geojson';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getGeoJSON tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { type: 'FeatureCollection', features: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await getGeoJSONDefinition.handler(mockClient, { key: 'us-states' });
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/geojson/us-states');
  });

  it('should use the key in the URL path', async () => {
    const mockResult = { type: 'FeatureCollection', features: [{ id: 1 }] };
    const mockClient = createMockClientWithResponse('get', mockResult);
    await getGeoJSONDefinition.handler(mockClient, { key: 'world-countries' });
    expect(mockClient.get).toHaveBeenCalledWith('/api/geojson/world-countries');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(getGeoJSONDefinition.handler(mockClient, { key: 'x' })).rejects.toThrow(
      'API error',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Not Found', 404));
    await expect(getGeoJSONDefinition.handler(mockClient, { key: 'missing' })).rejects.toThrow(
      'Not Found',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getGeoJSONDefinition.name).toBe('get_geojson');
    expect(getGeoJSONDefinition.description).toBe(
      'Get a specific GeoJSON file by key from Metabase',
    );
    expect(getGeoJSONDefinition.inputSchema).toEqual(GetGeoJSONParamsSchema);
  });
});
