import type { MetabaseClient } from '@src/client';
import { SearchFieldValuesInputSchema } from '@src/schemas/field';
import { searchFieldValuesDefinition } from '@src/tools/field/search-field-values';
import { describe, expect, it, vi } from 'vitest';

describe('searchFieldValues tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockResults = [['john@example.com'], ['jane@example.com'], ['johndoe@example.com']];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockResults),
    } as unknown as MetabaseClient;

    const result = await searchFieldValuesDefinition.handler(mockClient, { id: 1, value: 'john' });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/search/john', { limit: undefined });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass limit parameter when provided', async () => {
    const mockResults = [['value1'], ['value2']];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockResults),
    } as unknown as MetabaseClient;

    const result = await searchFieldValuesDefinition.handler(mockClient, {
      id: 1,
      value: 'test',
      limit: 10,
    });

    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual(mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/search/test', { limit: 10 });
  });

  it('should encode search value with special characters', async () => {
    const mockResults = [['test value']];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockResults),
    } as unknown as MetabaseClient;

    await searchFieldValuesDefinition.handler(mockClient, {
      id: 1,
      value: 'hello world',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/search/hello%20world', {
      limit: undefined,
    });
  });

  it('should handle empty search results', async () => {
    const mockResults: unknown[] = [];

    const mockClient = {
      get: vi.fn().mockResolvedValue(mockResults),
    } as unknown as MetabaseClient;

    const result = await searchFieldValuesDefinition.handler(mockClient, {
      id: 42,
      value: 'nonexistent',
    });

    expect(result.content[0].type).toBe('text');
    expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([]);
  });

  it('should propagate client errors', async () => {
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('Field not found')),
    } as unknown as MetabaseClient;

    await expect(
      searchFieldValuesDefinition.handler(mockClient, { id: 999, value: 'test' }),
    ).rejects.toThrow('Field not found');
  });

  it('should propagate API errors with status codes', async () => {
    const apiError = new Error('Forbidden');
    (apiError as Error & { status?: number }).status = 403;

    const mockClient = {
      get: vi.fn().mockRejectedValue(apiError),
    } as unknown as MetabaseClient;

    await expect(
      searchFieldValuesDefinition.handler(mockClient, { id: 1, value: 'test' }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(searchFieldValuesDefinition.name).toBe('search_field_values');
    expect(searchFieldValuesDefinition.description).toBe(
      'Search for specific values within a field in Metabase',
    );
    expect(searchFieldValuesDefinition.inputSchema).toEqual(SearchFieldValuesInputSchema);
  });
});
