import { GetFieldRemappingInputSchema } from '@src/schemas/field';
import { getFieldRemappingDefinition } from '@src/tools/field/get-field-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getFieldRemapping tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResponse = { id: 1, remapped_to: 2 };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getFieldRemappingDefinition.handler(mockClient, { id: 1, remapped_id: 2 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/field/1/remapping/2');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getFieldRemappingDefinition.handler(mockClient, { id: 999, remapped_id: 1 })).rejects.toThrow('Not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getFieldRemappingDefinition.handler(mockClient, { id: 1, remapped_id: 2 })).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(getFieldRemappingDefinition.name).toBe('get_field_remapping');
    expect(getFieldRemappingDefinition.description).toBe('Get remapping between two fields in Metabase');
    expect(getFieldRemappingDefinition.inputSchema).toEqual(GetFieldRemappingInputSchema);
  });
});
