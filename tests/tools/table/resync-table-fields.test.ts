import { TableIdInputSchema } from '@src/schemas/table';
import { resyncTableFieldsDefinition } from '@src/tools/table/resync-table-fields';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('resyncTableFields tool', () => {
  it('should return formatted MCP response after resyncing table fields', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 1 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/1/rescan_values');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should handle resync for different table IDs', async () => {
    const mockResult = { success: true };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 42 });

    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/42/rescan_values');
  });

  it('should handle empty response from API', async () => {
    const mockResult = {};

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 5 });

    expectMcpContent(result, mockResult);
  });

  it('should handle null response from API', async () => {
    const mockClient = createMockClientWithResponse('post', null);

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 10 });

    expectMcpContent(result, null);
  });

  it('should handle response with message', async () => {
    const mockResult = {
      success: true,
      message: 'Rescan initiated for table',
    };

    const mockClient = createMockClientWithResponse('post', mockResult);

    const result = await resyncTableFieldsDefinition.handler(mockClient, { id: 15 });

    expectMcpContent(result, mockResult);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Table not found');

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 999 })).rejects.toThrow(
      'Table not found',
    );
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/999/rescan_values');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Forbidden', 403));

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 1 })).rejects.toThrow(
      'Forbidden',
    );
  });

  it('should handle server error during resync', async () => {
    const mockClient = createMockClientWithError(
      'post',
      createApiError('Internal Server Error', 500),
    );

    await expect(resyncTableFieldsDefinition.handler(mockClient, { id: 3 })).rejects.toThrow(
      'Internal Server Error',
    );
  });

  it('should have correct tool definition metadata', () => {
    expect(resyncTableFieldsDefinition.name).toBe('resync_table_fields');
    expect(resyncTableFieldsDefinition.description).toBe(
      'Rescan field values for a table in Metabase',
    );
    expect(resyncTableFieldsDefinition.inputSchema).toEqual(TableIdInputSchema);
  });
});
