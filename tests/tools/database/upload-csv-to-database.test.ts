import { UploadCsvToDatabaseInputSchema } from '@src/schemas/database';
import { uploadCsvToDatabaseDefinition } from '@src/tools/database/upload-csv-to-database';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('uploadCsvToDatabase tool', () => {
  it('should upload CSV and return formatted MCP response', async () => {
    const mockResponse = { status: 'complete', id: 10 };

    const mockClient = createMockClientWithResponse('post', mockResponse);

    const input = { id: 1, table_name: 'new_table' };
    const result = await uploadCsvToDatabaseDefinition.handler(mockClient, input);

    expectMcpContent(result, mockResponse);
    expect(mockClient.post).toHaveBeenCalledWith('/api/database/1/csv', {
      table_name: 'new_table',
      schema_name: undefined,
      collection_id: undefined,
    });
    expect(mockClient.post).toHaveBeenCalledOnce();
  });

  it('should pass optional schema_name and collection_id when provided', async () => {
    const mockResponse = { status: 'complete', id: 11 };
    const mockClient = createMockClientWithResponse('post', mockResponse);

    await uploadCsvToDatabaseDefinition.handler(mockClient, {
      id: 2,
      table_name: 'my_table',
      schema_name: 'public',
      collection_id: 5,
    });

    expect(mockClient.post).toHaveBeenCalledWith('/api/database/2/csv', {
      table_name: 'my_table',
      schema_name: 'public',
      collection_id: 5,
    });
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'Database not found');

    await expect(
      uploadCsvToDatabaseDefinition.handler(mockClient, { id: 999, table_name: 'test' }),
    ).rejects.toThrow('Database not found');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Unauthorized', 401));

    await expect(
      uploadCsvToDatabaseDefinition.handler(mockClient, { id: 1, table_name: 'test' }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should have correct tool definition metadata', () => {
    expect(uploadCsvToDatabaseDefinition.name).toBe('upload_csv_to_database');
    expect(uploadCsvToDatabaseDefinition.description).toBe(
      'Upload a CSV to create a new table in a database in Metabase',
    );
    expect(uploadCsvToDatabaseDefinition.inputSchema).toEqual(UploadCsvToDatabaseInputSchema);
  });
});
