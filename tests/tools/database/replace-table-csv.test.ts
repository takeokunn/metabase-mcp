import { replaceTableCsvDefinition, ReplaceTableCsvParamsSchema } from '@src/tools/database/replace-table-csv';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('replaceTableCsv tool', () => {
  it('should replace table with CSV and return formatted MCP response', async () => {
    const mockResponse = { status: 'complete', id: 42 };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await replaceTableCsvDefinition.handler(mockClient, { id: 1, table_id: 5 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/table/5/replace');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    await expect(
      replaceTableCsvDefinition.handler(mockClient, { id: 999, table_id: 1 }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(
      replaceTableCsvDefinition.handler(mockClient, { id: 1, table_id: 5 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(replaceTableCsvDefinition.name).toBe('replace_table_csv');
    expect(replaceTableCsvDefinition.description).toBe(
      'Replace an existing table with CSV data in a database in Metabase',
    );
    expect(replaceTableCsvDefinition.inputSchema).toEqual(ReplaceTableCsvParamsSchema);
  });
});
