import { searchModelsDefinition } from '@src/tools/search/search-models';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchModels tool', () => {
  it('should return formatted MCP response with available search models', async () => {
    const mockModels = ['card', 'dashboard', 'collection', 'table', 'database', 'action'];

    const mockClient = createMockClientWithResponse('get', mockModels);

    const result = await searchModelsDefinition.handler(mockClient, {});

    expectMcpContent(result, mockModels);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/models');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty models list', async () => {
    const mockModels: string[] = [];

    const mockClient = createMockClientWithResponse('get', mockModels);

    const result = await searchModelsDefinition.handler(mockClient, {});

    expectMcpContent(result, []);
  });

  it('should handle models with additional types', async () => {
    const mockModels = [
      'card',
      'dashboard',
      'collection',
      'table',
      'database',
      'action',
      'indexed-entity',
      'segment',
      'metric',
    ];

    const mockClient = createMockClientWithResponse('get', mockModels);

    const result = await searchModelsDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toContain('card');
    expect(parsedResult).toContain('dashboard');
    expect(parsedResult).toContain('indexed-entity');
    expect(parsedResult).toHaveLength(9);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'API error');

    await expect(searchModelsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/models');
  });

  it('should propagate authentication errors', async () => {
    const apiError = createApiError('Unauthorized', 401);
    const mockClient = createMockClientWithError('get', apiError);

    await expect(searchModelsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should propagate forbidden errors', async () => {
    const apiError = createApiError('Forbidden', 403);
    const mockClient = createMockClientWithError('get', apiError);

    await expect(searchModelsDefinition.handler(mockClient, {})).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchModelsDefinition.name).toBe('search_models');
    expect(searchModelsDefinition.description).toBe(
      'Get the list of available model types that can be searched in Metabase',
    );
    expect(searchModelsDefinition.inputSchema).toEqual({});
  });
});
