import { FieldDimensionParamsSchema } from '@src/schemas/field';
import { deleteFieldDimensionDefinition } from '@src/tools/field/delete-field-dimension';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('deleteFieldDimension tool', () => {
  it('should return formatted MCP response after deleting dimension', async () => {
    const mockResult = null;
    const mockClient = createMockClientWithResponse('delete', mockResult);

    const result = await deleteFieldDimensionDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, mockResult);
    expect(mockClient.delete).toHaveBeenCalledWith('/api/field/10/dimension');
    expect(mockClient.delete).toHaveBeenCalledOnce();
  });

  it('should delete dimension for different field', async () => {
    const mockClient = createMockClientWithResponse('delete', null);

    await deleteFieldDimensionDefinition.handler(mockClient, { id: 5 });

    expect(mockClient.delete).toHaveBeenCalledWith('/api/field/5/dimension');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('delete', 'Field not found');

    await expect(deleteFieldDimensionDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Field not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('delete', createApiError('Forbidden', 403));

    await expect(deleteFieldDimensionDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(deleteFieldDimensionDefinition.name).toBe('delete_field_dimension');
    expect(deleteFieldDimensionDefinition.description).toBe(
      'Delete a dimension (remapping) from a field in Metabase',
    );
    expect(deleteFieldDimensionDefinition.inputSchema).toEqual(FieldDimensionParamsSchema);
  });
});
