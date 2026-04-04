import { TableIdInputSchema } from '@src/schemas/table';
import { discardTableValuesDefinition } from '@src/tools/table/discard-table-values';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('discardTableValues tool', () => {
  it('should return formatted MCP response after discarding table values', async () => {
    const mockResult = { status: 'success' };
    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await discardTableValuesDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/5/discard_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should discard values for different table ID', async () => {
    const mockClient = createMockClientWithResponse('post', { status: 'success' });

    await discardTableValuesDefinition.handler(mockClient, { id: 20 });

    expect(mockClient.post).toHaveBeenCalledWith('/api/table/20/discard_values');
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Table not found');

    await expect(discardTableValuesDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(discardTableValuesDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(discardTableValuesDefinition.name).toBe('discard_table_values');
    expect(discardTableValuesDefinition.description).toBe(
      'Discard cached field values for a table in Metabase',
    );
    expect(discardTableValuesDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
