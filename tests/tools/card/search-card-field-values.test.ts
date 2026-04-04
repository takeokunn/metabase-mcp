import { SearchCardFieldValuesParamsSchema } from '@src/schemas/card';
import { searchCardFieldValuesDefinition } from '@src/tools/card/search-card-field-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('searchCardFieldValues tool', () => {
  const baseInput = { id: 1, field_id: 42, search_value: 'Elec' };

  it('should return formatted MCP response with matching field values', async () => {
    const mockResult = { values: [['Electronics']] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await searchCardFieldValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/field/42/search/Elec');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should encode search_value in the URL', async () => {
    const mockClient = createMockClientWithResponse('get', { values: [] });

    await searchCardFieldValuesDefinition.handler(mockClient, {
      id: 1,
      field_id: 42,
      search_value: 'hello world',
    });

    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/field/42/search/hello%20world');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');
    await expect(searchCardFieldValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Field not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(searchCardFieldValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(searchCardFieldValuesDefinition.name).toBe('search_card_field_values');
    expect(searchCardFieldValuesDefinition.inputSchema).toEqual(SearchCardFieldValuesParamsSchema);
  });
});
