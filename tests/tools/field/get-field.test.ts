import { GetFieldInputSchema } from '@src/schemas/field';
import { getFieldDefinition } from '@src/tools/field/get-field';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getField tool', () => {
  it('should return formatted MCP response with field data', async () => {
    const mockField = {
      id: 1,
      name: 'email',
      display_name: 'Email Address',
      base_type: 'type/Text',
      semantic_type: 'type/Email',
      table_id: 5,
    };

    const mockClient = createMockClientWithResponse('get', mockField);

    const result = await getFieldDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockField);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle field with minimal data', async () => {
    const mockField = {
      id: 42,
      name: 'status',
      base_type: 'type/Text',
      table_id: 10,
    };

    const mockClient = createMockClientWithResponse('get', mockField);

    const result = await getFieldDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockField);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/42');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');

    await expect(getFieldDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/999');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(getFieldDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldDefinition.name).toBe('get_field');
    expect(getFieldDefinition.description).toBe(
      'Get details of a specific field by ID from Metabase',
    );
    expect(getFieldDefinition.inputSchema).toEqual(GetFieldInputSchema);
  });
});
