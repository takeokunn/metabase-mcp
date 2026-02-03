import { GetFieldValuesInputSchema } from '@src/schemas/field';
import { getFieldValuesDefinition } from '@src/tools/field/get-field-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldValues tool', () => {
  it('should return formatted MCP response with field values', async () => {
    const mockFieldValues = {
      field_id: 1,
      values: [
        ['active', 'Active'],
        ['inactive', 'Inactive'],
        ['pending', 'Pending'],
      ],
      has_more_values: false,
    };

    const mockClient = createMockClientWithResponse('get', mockFieldValues);

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/values');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with many values', async () => {
    const mockFieldValues = {
      field_id: 42,
      values: Array.from({ length: 100 }, (_, i) => [`value_${i}`, `Value ${i}`]),
      has_more_values: true,
    };

    const mockClient = createMockClientWithResponse('get', mockFieldValues);

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42/values');
  });

  it('should handle field with empty values', async () => {
    const mockFieldValues = {
      field_id: 10,
      values: [],
      has_more_values: false,
    };

    const mockClient = createMockClientWithResponse('get', mockFieldValues);

    const result = await getFieldValuesDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockFieldValues);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/10/values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');

    await expect(getFieldValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999/values');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getFieldValuesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldValuesDefinition.name).toBe('get_field_values');
    expect(getFieldValuesDefinition.description).toBe(
      'Get the cached distinct values for a field from Metabase',
    );
    expect(getFieldValuesDefinition.inputSchema).toEqual(GetFieldValuesInputSchema);
  });
});
