import { UploadCsvInputSchema } from '@src/schemas/upload';
import { uploadCsvDefinition } from '@src/tools/upload/upload-csv';
import { describe, expect, it } from 'vitest';
import { createApiError } from '../../__factories__';
import { expectMcpContent } from '../../__helpers__';
import { createMockClientWithError, createMockClientWithResponse } from '../../__mocks__';

describe('uploadCsv tool', () => {
  it('should return formatted MCP response', async () => {
    const mockResult = { id: 1, name: 'my_table', db_id: 2 };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const input = { db_id: 2, table_name: 'my_table' };
    const result = await uploadCsvDefinition.handler(mockClient, input);
    expectMcpContent(result, mockResult);
    expect(mockClient.post).toHaveBeenCalledWith('/api/upload/csv', input);
  });

  it('should pass optional fields when provided', async () => {
    const mockResult = { id: 1, name: 'my_table' };
    const mockClient = createMockClientWithResponse('post', mockResult);
    const input = {
      db_id: 2,
      table_name: 'my_table',
      schema_name: 'public',
      collection_id: 10,
    };
    await uploadCsvDefinition.handler(mockClient, input);
    expect(mockClient.post).toHaveBeenCalledWith('/api/upload/csv', input);
  });

  it('should propagate client errors', async () => {
    const mockClient = createMockClientWithError('post', 'API error');
    await expect(
      uploadCsvDefinition.handler(mockClient, { db_id: 1, table_name: 'test' }),
    ).rejects.toThrow('API error');
  });

  it('should propagate API errors with status codes', async () => {
    const mockClient = createMockClientWithError('post', createApiError('Bad Request', 400));
    await expect(
      uploadCsvDefinition.handler(mockClient, { db_id: 1, table_name: 'test' }),
    ).rejects.toThrow('Bad Request');
  });

  it('should have correct tool definition metadata', () => {
    expect(uploadCsvDefinition.name).toBe('upload_csv');
    expect(uploadCsvDefinition.description).toBe(
      'Upload a CSV file to create a new table in Metabase',
    );
    expect(uploadCsvDefinition.inputSchema).toEqual(UploadCsvInputSchema);
  });
});
