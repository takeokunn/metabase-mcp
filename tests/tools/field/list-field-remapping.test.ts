import { FieldDimensionParamsSchema } from '@src/schemas/field';
import { listFieldRemappingDefinition } from '@src/tools/field/list-field-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('listFieldRemapping tool', () => {
  it('should return formatted MCP response with remapping values', async () => {
    const mockResult = {
      values: [
        [1, 'Active'],
        [2, 'Inactive'],
        [3, 'Pending'],
      ],
    };

    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listFieldRemappingDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/10/values/remapping');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should handle empty remapping values', async () => {
    const mockResult = { values: [] };
    const mockClient = createMockClientWithResponse('get', mockResult);

    const result = await listFieldRemappingDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/5/values/remapping');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Field not found');

    await expect(listFieldRemappingDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));

    await expect(listFieldRemappingDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(listFieldRemappingDefinition.name).toBe('list_field_remapping');
    expect(listFieldRemappingDefinition.description).toBe(
      'Get remapping values for a field in Metabase',
    );
    expect(listFieldRemappingDefinition.inputSchema).toEqual(FieldDimensionParamsSchema);
  });
});
