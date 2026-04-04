import { GetDatabaseAutocompleteParamsSchema } from '@src/schemas/database';
import { getDatabaseAutocompleteDefinition } from '@src/tools/database/get-database-autocomplete';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseAutocomplete tool', () => {
  it('should return formatted MCP response with autocomplete suggestions', async () => {
    const mockSuggestions = [
      ['orders', 'table'],
      ['orders.id', 'field'],
    ];

    const mockClient = createMockClientWithResponse('get', mockSuggestions);

    const result = await getDatabaseAutocompleteDefinition.handler(mockClient, {
      id: 1,
      prefix: 'ord',
    });

    expectMcpContent(result, mockSuggestions);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/autocomplete_suggestions', {
      prefix: 'ord',
      substring: undefined,
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should pass substring param when provided', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await getDatabaseAutocompleteDefinition.handler(mockClient, { id: 2, substring: 'user' });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/2/autocomplete_suggestions', {
      prefix: undefined,
      substring: 'user',
    });
  });

  it('should handle no optional params', async () => {
    const mockClient = createMockClientWithResponse('get', []);

    await getDatabaseAutocompleteDefinition.handler(mockClient, { id: 3 });

    expect(mockClient.get).toHaveBeenCalledWith('/api/database/3/autocomplete_suggestions', {
      prefix: undefined,
      substring: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Database not found');

    await expect(
      getDatabaseAutocompleteDefinition.handler(mockClient, { id: 999 }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getDatabaseAutocompleteDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseAutocompleteDefinition.name).toBe('get_database_autocomplete');
    expect(getDatabaseAutocompleteDefinition.description).toBe(
      'Get autocomplete suggestions for a database in Metabase',
    );
    expect(getDatabaseAutocompleteDefinition.inputSchema).toEqual(
      GetDatabaseAutocompleteParamsSchema,
    );
  });
});
