import { GetCardFieldValuesParamsSchema } from '@src/schemas/card';
import { getCardFieldValuesDefinition } from '@src/tools/card/get-card-field-values';
import { describe, expect, it } from 'vitest';

import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getCardFieldValues tool', () => {
  const baseInput = { id: 1, field_id: 42 };

  it('should return formatted MCP response with field values', async () => {
    const mockResult = { values: [['Electronics'], ['Clothing'], ['Books']] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await getCardFieldValuesDefinition.handler(mockClient, baseInput);

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/card/1/field/42/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');
    await expect(getCardFieldValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Field not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Forbidden', 403));
    await expect(getCardFieldValuesDefinition.handler(mockClient, baseInput)).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getCardFieldValuesDefinition.name).toBe('get_card_field_values');
    expect(getCardFieldValuesDefinition.inputSchema).toEqual(GetCardFieldValuesParamsSchema);
  });
});
