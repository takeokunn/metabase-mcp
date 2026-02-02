import type { MetabaseClient } from '@src/client';
import { searchModelsDefinition } from '@src/tools/search/search-models';
import { describe, expect, it, vi } from 'vitest';

describe('searchModels tool', () => {
  it('should return formatted MCP response with available search models', async () => {
    const mockModels = ['card', 'dashboard', 'collection', 'table', 'database', 'action'];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockModels),
    } as unknown as MetabaseClient;

    const result = await searchModelsDefinition.handler(mockClient, {});

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockModels);
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/models');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty models list', async () => {
    const mockModels: string[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockModels),
    } as unknown as MetabaseClient;

    const result = await searchModelsDefinition.handler(mockClient, {});

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
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

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockModels),
    } as unknown as MetabaseClient;

    const result = await searchModelsDefinition.handler(mockClient, {});

    const parsedResult = JSON.parse((result.content[0] as { text: string }).text);
    expect(parsedResult).toContain('card');
    expect(parsedResult).toContain('dashboard');
    expect(parsedResult).toContain('indexed-entity');
    expect(parsedResult).toHaveLength(9);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API error')),
    } as unknown as MetabaseClient;

    await expect(searchModelsDefinition.handler(mockClient, {})).rejects.toThrow('API error');
    expect(mockClient.get).toHaveBeenCalledWith('/api/search/models');
  });

  it('should propagate authentication errors', async () => {
    const apiError = new Error('Unauthorized');
    (apiError as Error & { status?: number }).status = 401;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(searchModelsDefinition.handler(mockClient, {})).rejects.toThrow('Unauthorized');
  });

  it('should propagate forbidden errors', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

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
