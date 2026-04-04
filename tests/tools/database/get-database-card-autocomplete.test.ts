import { GetDatabaseCardAutocompleteParamsSchema } from '@src/schemas/database';
import { getDatabaseCardAutocompleteDefinition } from '@src/tools/database/get-database-card-autocomplete';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getDatabaseCardAutocomplete tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = [{ id: 1, name: 'Orders' }];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getDatabaseCardAutocompleteDefinition.handler(mockClient, {
      id: 1,
      query: 'ord',
    });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/database/1/card_autocomplete_suggestions', {
      query: 'ord',
    });
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(
      getDatabaseCardAutocompleteDefinition.handler(mockClient, { id: 999, query: 'test' }),
    ).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(
      getDatabaseCardAutocompleteDefinition.handler(mockClient, { id: 1, query: 'test' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getDatabaseCardAutocompleteDefinition.name).toBe('get_database_card_autocomplete');
    expect(getDatabaseCardAutocompleteDefinition.description).toBe(
      'Get card autocomplete suggestions for a database in Metabase',
    );
    expect(getDatabaseCardAutocompleteDefinition.inputSchema).toEqual(
      GetDatabaseCardAutocompleteParamsSchema,
    );
  });
});
