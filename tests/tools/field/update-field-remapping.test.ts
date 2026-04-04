import { UpdateFieldRemappingInputSchema } from '@src/schemas/field';
import { updateFieldRemappingDefinition } from '@src/tools/field/update-field-remapping';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateFieldRemapping tool', () => {
  it('should return formatted MCP response after updating remapping', async () => {
    const mockResult = { status: 'success' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const values = [
      [1, 'Active'],
      [2, 'Inactive'],
    ];

    const result = await updateFieldRemappingDefinition.handler(mockClient, {
      id: 10,
      values,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/10/values/remapping', values);
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should update remapping for different field', async () => {
    const mockClient = createMockClientWithResponse('post', { status: 'success' });

    const values = [[100, 'Yes'], [200, 'No']];

    await updateFieldRemappingDefinition.handler(mockClient, { id: 5, values });

    expect(mockClient.post).toHaveBeenCalledWith('/api/field/5/values/remapping', values);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Field not found');

    await expect(
      updateFieldRemappingDefinition.handler(mockClient, { id: 999, values: [[1, 'One']] }),
    ).rejects.toThrow('Field not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(
      updateFieldRemappingDefinition.handler(mockClient, { id: 1, values: [[1, 'One']] }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateFieldRemappingDefinition.name).toBe('update_field_remapping');
    expect(updateFieldRemappingDefinition.description).toBe(
      'Update remapping values for a field in Metabase',
    );
    expect(updateFieldRemappingDefinition.inputSchema).toEqual(UpdateFieldRemappingInputSchema);
  });
});
