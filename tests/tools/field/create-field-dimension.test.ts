import { CreateFieldDimensionInputSchema } from '@src/schemas/field';
import { createFieldDimensionDefinition } from '@src/tools/field/create-field-dimension';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('createFieldDimension tool', () => {
  it('should return formatted MCP response after creating dimension', async () => {
    const mockResult = {
      id: 1,
      field_id: 10,
      name: 'Product Category',
      type: 'external',
      human_readable_field_id: 20,
    };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await createFieldDimensionDefinition.handler(mockClient, {
      id: 10,
      type: 'external',
      name: 'Product Category',
      human_readable_field_id: 20,
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/field/10/dimension', {
      type: 'external',
      name: 'Product Category',
      human_readable_field_id: 20,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should create internal dimension without human_readable_field_id', async () => {
    const mockResult = { id: 2, field_id: 5, name: 'Status Label', type: 'internal' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    await createFieldDimensionDefinition.handler(mockClient, {
      id: 5,
      type: 'internal',
      name: 'Status Label',
    });

    expect(mockClient.post).toHaveBeenCalledWith('/api/field/5/dimension', {
      type: 'internal',
      name: 'Status Label',
      human_readable_field_id: undefined,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Field not found');

    await expect(
      createFieldDimensionDefinition.handler(mockClient, {
        id: 999,
        type: 'internal',
        name: 'Test',
      }),
    ).rejects.toThrow('Field not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(
      createFieldDimensionDefinition.handler(mockClient, {
        id: 1,
        type: 'internal',
        name: 'Test',
      }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(createFieldDimensionDefinition.name).toBe('create_field_dimension');
    expect(createFieldDimensionDefinition.description).toBe(
      'Create a dimension (remapping) for a field in Metabase',
    );
    expect(createFieldDimensionDefinition.inputSchema).toEqual(CreateFieldDimensionInputSchema);
  });
});
