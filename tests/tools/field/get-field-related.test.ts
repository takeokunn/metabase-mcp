import { GetFieldRelatedInputSchema } from '@src/schemas/field';
import { getFieldRelatedDefinition } from '@src/tools/field/get-field-related';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldRelated tool', () => {
  it('should return formatted MCP response with related entities', async () => {
    const mockRelated = {
      tables: [
        { id: 1, name: 'users' },
        { id: 2, name: 'orders' },
      ],
      fields: [
        { id: 10, name: 'user_id', table_id: 2 },
        { id: 11, name: 'created_by', table_id: 3 },
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockRelated);

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockRelated);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/related');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with no related entities', async () => {
    const mockRelated = {
      tables: [],
      fields: [],
    };

    const mockClient = createMockClientWithResponse('get', mockRelated);

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockRelated);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42/related');
  });

  it('should handle field with only related tables', async () => {
    const mockRelated = {
      tables: [{ id: 5, name: 'products' }],
      fields: [],
    };

    const mockClient = createMockClientWithResponse('get', mockRelated);

    const result = await getFieldRelatedDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockRelated);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');

    await expect(getFieldRelatedDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999/related');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getFieldRelatedDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldRelatedDefinition.name).toBe('get_field_related');
    expect(getFieldRelatedDefinition.description).toBe(
      'Get related entities (tables, fields) for a field in Metabase',
    );
    expect(getFieldRelatedDefinition.inputSchema).toEqual(GetFieldRelatedInputSchema);
  });
});
