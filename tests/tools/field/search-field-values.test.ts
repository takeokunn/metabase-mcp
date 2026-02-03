import { SearchFieldValuesInputSchema } from '@src/schemas/field';
import { searchFieldValuesDefinition } from '@src/tools/field/search-field-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchFieldValues tool', () => {
  it('should return formatted MCP response with search results', async () => {
    const mockResults = [['john@example.com'], ['jane@example.com'], ['johndoe@example.com']];

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchFieldValuesDefinition.handler(mockClient, { id: 1, value: 'john' });

    expectMcpContent(result, mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/search/john', { limit: undefined });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass limit parameter when provided', async () => {
    const mockResults = [['value1'], ['value2']];

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchFieldValuesDefinition.handler(mockClient, {
      id: 1,
      value: 'test',
      limit: 10,
    });

    expectMcpContent(result, mockResults);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/search/test', { limit: 10 });
  });

  it('should encode search value with special characters', async () => {
    const mockResults = [['test value']];

    const mockClient = createMockClientWithResponse('get', mockResults);

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

    const mockClient = createMockClientWithResponse('get', mockResults);

    const result = await searchFieldValuesDefinition.handler(mockClient, {
      id: 42,
      value: 'nonexistent',
    });

    expectMcpContent(result, mockResults);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');

    await expect(
      searchFieldValuesDefinition.handler(mockClient, { id: 999, value: 'test' }),
    ).rejects.toThrow('Field not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));

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
