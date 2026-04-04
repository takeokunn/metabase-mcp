import { appendCsvToTableDefinition, AppendCsvToTableParamsSchema } from '@src/tools/database/append-csv-to-table';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('appendCsvToTable tool', () => {
  it('should append CSV to table and return formatted MCP response', async () => {
    const mockResponse = { status: 'complete', id: 42 };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const result = await appendCsvToTableDefinition.handler(mockClient, { table_id: 5 });

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/table/5/append-csv');
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    await expect(
      appendCsvToTableDefinition.handler(mockClient, { table_id: 1 }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(
      appendCsvToTableDefinition.handler(mockClient, { table_id: 5 }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(appendCsvToTableDefinition.name).toBe('append_csv_to_table');
    expect(appendCsvToTableDefinition.description).toBe(
      'Append rows from a CSV upload to an existing table in a database in Metabase',
    );
    expect(appendCsvToTableDefinition.inputSchema).toEqual(AppendCsvToTableParamsSchema);
  });
});
