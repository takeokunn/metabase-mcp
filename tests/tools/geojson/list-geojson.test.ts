import { listGeoJSONDefinition } from '@src/tools/geojson/list-geojson';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listGeoJSON tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = {
      us_states: { name: 'United States', url: 'https://example.com/us-states.json' },
      world_countries: { name: 'World Countries', url: 'https://example.com/world.json' },
    };
    const mockClient = createMockClientWithResponse('get', mockResult);
    const result = await listGeoJSONDefinition.handler(mockClient, {});
    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/geojson');
  });

  it('should handle empty result', async () => {
    const mockClient = createMockClientWithResponse('get', {});
    const result = await listGeoJSONDefinition.handler(mockClient, {});
    expectMcpContent(result, {});
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');
    await expect(listGeoJSONDefinition.handler(mockClient, {})).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(listGeoJSONDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(listGeoJSONDefinition.name).toBe('list_geojson');
    expect(listGeoJSONDefinition.description).toBe(
      'List all custom GeoJSON files available in Metabase',
    );
  });
});
