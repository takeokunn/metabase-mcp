import { TableIdInputSchema } from '@src/schemas/table';
import { getVirtualCardTableQueryMetadataDefinition } from '@src/tools/table/get-virtual-card-table-query-metadata';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('getVirtualCardTableQueryMetadata tool', () => {
  it('should return formatted MCP response with query metadata', async () => {
    const mockResponse = { fields: [], metrics: [] };
    const mockClient = createMockClientWithResponse('get', mockResponse);
    const result = await getVirtualCardTableQueryMetadataDefinition.handler(mockClient, { id: 5 });
    expectMcpContent(result, mockResponse);
    expect(mockClient.get).toHaveBeenCalledWith('/api/table/card__5/query_metadata');
    expect(mockClient.get).toHaveBeenCalledOnce();
  });
  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('get', 'Not found');
    await expect(getVirtualCardTableQueryMetadataDefinition.handler(mockClient, { id: 999 })).rejects.toThrow('Not found');
  });
  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('get', createApiError('Unauthorized', 401));
    await expect(getVirtualCardTableQueryMetadataDefinition.handler(mockClient, { id: 1 })).rejects.toThrow('Unauthorized');
  });
  it('should have correct tool definition metadata', () => {
    expect(getVirtualCardTableQueryMetadataDefinition.name).toBe('get_virtual_card_table_query_metadata');
    expect(getVirtualCardTableQueryMetadataDefinition.description).toBe('Get query metadata for a virtual card-based table in Metabase');
    expect(getVirtualCardTableQueryMetadataDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
