import { TableIdInputSchema } from '@src/schemas/table';
import { getVirtualCardTableFksDefinition } from '@src/tools/table/get-virtual-card-table-fks';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getVirtualCardTableFks tool', () => {
  it('should return formatted MCP response with foreign keys', async () => {
    const mockResponse = [{ origin_id: 1, destination_id: 2 }];
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getVirtualCardTableFksDefinition.handler(mockClient, { id: 5 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/card__5/fks');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getVirtualCardTableFksDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Not found',
    );
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getVirtualCardTableFksDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Unauthorized',
    );
  });
  it('should have correct tool definition metadata', () => {
    expect(getVirtualCardTableFksDefinition.name).toBe('get_virtual_card_table_fks');
    expect(getVirtualCardTableFksDefinition.description).toBe(
      'Get foreign keys for a virtual card-based table in Metabase',
    );
    expect(getVirtualCardTableFksDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
