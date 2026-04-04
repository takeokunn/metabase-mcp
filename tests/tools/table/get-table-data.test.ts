import { TableIdInputSchema } from '@src/schemas/table';
import { getTableDataDefinition } from '@src/tools/table/get-table-data';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getTableData tool', () => {
  it('should return formatted MCP response with table data', async () => {
    const mockResponse = { data: { rows: [[1, 'foo']] }, row_count: 1 };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getTableDataDefinition.handler(mockClient, { id: 5 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/5/data');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getTableDataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getTableDataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getTableDataDefinition.name).toBe('get_table_data');
    expect(getTableDataDefinition.description).toBe('Get data rows from a table in Metabase');
    expect(getTableDataDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
