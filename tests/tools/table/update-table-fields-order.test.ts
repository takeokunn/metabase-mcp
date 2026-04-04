import { UpdateTableFieldsOrderInputSchema } from '@src/schemas/table';
import { updateTableFieldsOrderDefinition } from '@src/tools/table/update-table-fields-order';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('updateTableFieldsOrder tool', () => {
  it('should return formatted MCP response after reordering fields', async () => {
    const mockResult = { status: 'success' };
    const mockClient = createMockClientWithResponse('put', mockResult);

    const result = await updateTableFieldsOrderDefinition.handler(mockClient, {
      id: 5,
      field_order: [3, 1, 2, 4],
    });

    expectMcpContent(result, mockResult);
    expect(mockClient.put).toHaveBeenCalledWith('/api/table/5/fields/order', [3, 1, 2, 4]);
    expect(mockClient.put).toHaveBeenCalledOnce();
  });

  it('should reorder fields for different table', async () => {
    const mockClient = createMockClientWithResponse('put', { status: 'success' });

    await updateTableFieldsOrderDefinition.handler(mockClient, {
      id: 10,
      field_order: [20, 21, 22],
    });

    expect(mockClient.put).toHaveBeenCalledWith('/api/table/10/fields/order', [20, 21, 22]);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('put', 'Table not found');

    await expect(
      updateTableFieldsOrderDefinition.handler(mockClient, { id: 999, field_order: [1, 2] }),
    ).rejects.toThrow('Table not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('put', createApiError('Forbidden', 403));

    await expect(
      updateTableFieldsOrderDefinition.handler(mockClient, { id: 1, field_order: [1, 2] }),
    ).rejects.toThrow('Forbidden');
  });

  it('should have correct tool definition metadata', () => {
    expect(updateTableFieldsOrderDefinition.name).toBe('update_table_fields_order');
    expect(updateTableFieldsOrderDefinition.description).toBe(
      'Reorder fields in a table in Metabase',
    );
    expect(updateTableFieldsOrderDefinition.inputSchema).toEqual(UpdateTableFieldsOrderInputSchema);
  });
});
