import { UpdateFieldValuesInputSchema } from '@src/schemas/field';
import { updateFieldValuesDefinition } from '@src/tools/field/update-field-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateFieldValues tool', () => {
  it('should return formatted MCP response after updating field values', async () => {
    const mockResponse = {
      field_id: 1,
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 1,
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/1/values', {
      values: [
        ['active', 'Active Status'],
        ['inactive', 'Inactive Status'],
      ],
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle update with numeric values', async () => {
    const mockResponse = {
      field_id: 42,
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 42,
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/42/values', {
      values: [
        [1, 'Priority 1 - Critical'],
        [2, 'Priority 2 - High'],
        [3, 'Priority 3 - Medium'],
        [4, 'Priority 4 - Low'],
      ],
    });
  });

  it('should handle empty values array', async () => {
    const mockResponse = {
      field_id: 10,
      values: [],
    };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await updateFieldValuesDefinition.handler(mockClient, {
      id: 10,
      values: [],
    });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/10/values', { values: [] });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Field not found');

    await expect(
      updateFieldValuesDefinition.handler(mockClient, {
        id: 999,
        values: [['test', 'Test']],
      }),
    ).rejects.toThrow('Field not found');
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/999/values', {
      values: [['test', 'Test']],
    });
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(
      updateFieldValuesDefinition.handler(mockClient, {
        id: 1,
        values: [['test', 'Test']],
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateFieldValuesDefinition.name).toBe('update_field_values');
    expect(updateFieldValuesDefinition.description).toBe(
      'Update the human-readable values for a field in Metabase',
    );
    expect(updateFieldValuesDefinition.inputSchema).toEqual(UpdateFieldValuesInputSchema);
  });
});
